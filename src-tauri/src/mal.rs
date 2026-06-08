use anyhow::{anyhow, Context, Result};
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};
use chrono::{Duration, Utc};
use rand::{rngs::OsRng, RngCore};
use reqwest::Client;
use serde::Deserialize;
use std::collections::HashMap;
use std::io::{Read, Write};
use std::net::TcpListener;
use std::process::Command;
use std::time::{Duration as StdDuration, Instant};

const AUTHORIZE_URL: &str = "https://myanimelist.net/v1/oauth2/authorize";
const TOKEN_URL: &str = "https://myanimelist.net/v1/oauth2/token";
const REDIRECT_URI: &str = "http://localhost:8080/callback";

#[derive(Debug, Clone)]
pub struct MalTokenSet {
    pub access_token: String,
    pub refresh_token: Option<String>,
    pub expires_at: String,
}

#[derive(Debug, Deserialize)]
struct TokenResponse {
    access_token: String,
    refresh_token: Option<String>,
    expires_in: i64,
}

struct CallbackPayload {
    code: String,
    state: String,
}

pub async fn authenticate(client_id: &str) -> Result<MalTokenSet> {
    let client_id = client_id.trim();
    if client_id.is_empty() {
        return Err(anyhow!("MyAnimeList Client ID is required"));
    }

    let verifier = random_urlsafe(64);
    let challenge = verifier.clone();
    let state = random_urlsafe(32);
    let auth_url = authorization_url(client_id, &challenge, &state);

    let expected_state = state.clone();
    let callback_task = tokio::task::spawn_blocking(move || wait_for_callback(&expected_state));
    open_browser(&auth_url)?;
    let callback = callback_task
        .await
        .context("failed to join MyAnimeList callback listener")??;

    if callback.state != state {
        return Err(anyhow!("MyAnimeList authorization state did not match"));
    }

    exchange_code(client_id, &callback.code, &verifier).await
}

pub async fn refresh(client_id: &str, refresh_token: &str) -> Result<MalTokenSet> {
    let mut form = vec![
        ("client_id", client_id.to_string()),
        ("grant_type", "refresh_token".to_string()),
        ("refresh_token", refresh_token.to_string()),
    ];

    if let Ok(secret) = std::env::var("MAL_CLIENT_SECRET") {
        if !secret.trim().is_empty() {
            form.push(("client_secret", secret));
        }
    }

    let response = Client::new()
        .post(TOKEN_URL)
        .form(&form)
        .send()
        .await
        .context("failed to refresh MyAnimeList token")?;

    parse_token_response(response).await
}

async fn exchange_code(client_id: &str, code: &str, verifier: &str) -> Result<MalTokenSet> {
    let mut form = vec![
        ("client_id", client_id.to_string()),
        ("grant_type", "authorization_code".to_string()),
        ("code", code.to_string()),
        ("redirect_uri", REDIRECT_URI.to_string()),
        ("code_verifier", verifier.to_string()),
    ];

    if let Ok(secret) = std::env::var("MAL_CLIENT_SECRET") {
        if !secret.trim().is_empty() {
            form.push(("client_secret", secret));
        }
    }

    let response = Client::new()
        .post(TOKEN_URL)
        .form(&form)
        .send()
        .await
        .context("failed to exchange MyAnimeList authorization code")?;

    parse_token_response(response).await
}

async fn parse_token_response(response: reqwest::Response) -> Result<MalTokenSet> {
    let status = response.status();
    let body = response.text().await.unwrap_or_default();
    if !status.is_success() {
        return Err(anyhow!(
            "MyAnimeList token endpoint returned {status}: {body}"
        ));
    }

    let token: TokenResponse =
        serde_json::from_str(&body).context("failed to decode MyAnimeList token response")?;
    let expires_at = Utc::now()
        .checked_add_signed(Duration::seconds(token.expires_in.saturating_sub(60)))
        .unwrap_or_else(Utc::now)
        .to_rfc3339();

    Ok(MalTokenSet {
        access_token: token.access_token,
        refresh_token: token.refresh_token,
        expires_at,
    })
}

fn authorization_url(client_id: &str, challenge: &str, state: &str) -> String {
    format!(
        "{AUTHORIZE_URL}?response_type=code&client_id={}&redirect_uri={}&state={}&code_challenge={}&code_challenge_method=plain",
        urlencoding::encode(client_id),
        urlencoding::encode(REDIRECT_URI),
        urlencoding::encode(state),
        urlencoding::encode(challenge),
    )
}

fn random_urlsafe(bytes: usize) -> String {
    let mut data = vec![0_u8; bytes];
    OsRng.fill_bytes(&mut data);
    URL_SAFE_NO_PAD.encode(data)
}

fn wait_for_callback(expected_state: &str) -> Result<CallbackPayload> {
    let listener = TcpListener::bind("127.0.0.1:8080")
        .context("failed to bind MyAnimeList callback server on localhost:8080")?;
    listener
        .set_nonblocking(true)
        .context("failed to configure MyAnimeList callback server")?;

    let started = Instant::now();
    loop {
        if started.elapsed() > StdDuration::from_secs(180) {
            return Err(anyhow!("Timed out waiting for MyAnimeList authorization"));
        }

        match listener.accept() {
            Ok((mut stream, _addr)) => {
                let mut buffer = [0_u8; 4096];
                let read = stream.read(&mut buffer).unwrap_or(0);
                let request = String::from_utf8_lossy(&buffer[..read]);
                let payload = parse_callback_request(&request)?;
                let valid = payload.state == expected_state;
                let body = if valid {
                    "Authorization received. You can close this window and return to Mangaba while it finishes connecting."
                } else {
                    "Authorization failed. Please return to Mangaba and try again."
                };
                let response = format!(
                    "HTTP/1.1 200 OK\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
                    body.len(),
                    body
                );
                let _ = stream.write_all(response.as_bytes());
                return Ok(payload);
            }
            Err(err) if err.kind() == std::io::ErrorKind::WouldBlock => {
                std::thread::sleep(StdDuration::from_millis(100));
            }
            Err(err) => return Err(err).context("failed to accept MyAnimeList callback"),
        }
    }
}

fn parse_callback_request(request: &str) -> Result<CallbackPayload> {
    let request_line = request
        .lines()
        .next()
        .ok_or_else(|| anyhow!("MyAnimeList callback request was empty"))?;
    let path = request_line
        .split_whitespace()
        .nth(1)
        .ok_or_else(|| anyhow!("MyAnimeList callback request did not include a path"))?;
    let query = path
        .split_once('?')
        .map(|(_, query)| query)
        .ok_or_else(|| anyhow!("MyAnimeList callback did not include query parameters"))?;
    let params = parse_query(query)?;

    if let Some(error) = params.get("error") {
        return Err(anyhow!("MyAnimeList authorization failed: {error}"));
    }

    Ok(CallbackPayload {
        code: params
            .get("code")
            .cloned()
            .ok_or_else(|| anyhow!("MyAnimeList callback did not include code"))?,
        state: params
            .get("state")
            .cloned()
            .ok_or_else(|| anyhow!("MyAnimeList callback did not include state"))?,
    })
}

fn parse_query(query: &str) -> Result<HashMap<String, String>> {
    query
        .split('&')
        .filter(|part| !part.is_empty())
        .map(|part| {
            let (key, value) = part.split_once('=').unwrap_or((part, ""));
            Ok((
                urlencoding::decode(key)?.into_owned(),
                urlencoding::decode(value)?.into_owned(),
            ))
        })
        .collect()
}

#[cfg(target_os = "macos")]
fn open_browser(url: &str) -> Result<()> {
    Command::new("open")
        .arg(url)
        .spawn()
        .context("failed to open browser for MyAnimeList authorization")?;
    Ok(())
}

#[cfg(target_os = "windows")]
fn open_browser(url: &str) -> Result<()> {
    Command::new("rundll32")
        .args(["url.dll,FileProtocolHandler", url])
        .spawn()
        .context("failed to open browser for MyAnimeList authorization")?;
    Ok(())
}

#[cfg(all(unix, not(target_os = "macos")))]
fn open_browser(url: &str) -> Result<()> {
    Command::new("xdg-open")
        .arg(url)
        .spawn()
        .context("failed to open browser for MyAnimeList authorization")?;
    Ok(())
}

use crate::models::{MalListItem, MalListResponse, MalRankingManga, MalRankingResponse, MalUser};

pub async fn get_user(token: &str) -> Result<MalUser> {
    let response = Client::new()
        .get("https://api.myanimelist.net/v2/users/@me")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .context("failed to fetch MAL user")?;

    if !response.status().is_success() {
        return Err(anyhow!("MAL API error: {}", response.status()));
    }

    response
        .json::<MalUser>()
        .await
        .context("failed to decode MAL user")
}

pub async fn get_user_mangalist(token: &str) -> Result<Vec<MalListItem>> {
    let url = "https://api.myanimelist.net/v2/users/@me/mangalist?fields=list_status,num_volumes_read,num_chapters_read,score,manga&limit=1000";

    let response = Client::new()
        .get(url)
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .context("failed to fetch MAL mangalist")?;

    if !response.status().is_success() {
        return Err(anyhow!("MAL API error: {}", response.status()));
    }

    let list: MalListResponse = response
        .json()
        .await
        .context("failed to decode MAL mangalist")?;
    Ok(list.data)
}

pub async fn get_ranking(token: &str) -> Result<Vec<MalRankingManga>> {
    let response = Client::new()
        .get("https://api.myanimelist.net/v2/manga/ranking?ranking_type=manga&limit=50&fields=mean,genres,synopsis")
        .header("Authorization", format!("Bearer {}", token))
        .send()
        .await
        .context("failed to fetch MAL ranking")?;

    if !response.status().is_success() {
        return Err(anyhow!("MAL API error: {}", response.status()));
    }

    let ranking: MalRankingResponse = response
        .json()
        .await
        .context("failed to decode MAL ranking")?;
    Ok(ranking.data.into_iter().map(|item| item.node).collect())
}

pub async fn update_list_status(
    token: &str,
    manga_id: i64,
    status: &str,
    num_chapters_read: i32,
    score: Option<i32>,
) -> Result<()> {
    let mut form = vec![
        ("status".to_string(), status.to_string()),
        (
            "num_chapters_read".to_string(),
            num_chapters_read.to_string(),
        ),
    ];
    if let Some(s) = score {
        form.push(("score".to_string(), s.to_string()));
    }

    let response = Client::new()
        .patch(format!(
            "https://api.myanimelist.net/v2/manga/{}/my_list_status",
            manga_id
        ))
        .header("Authorization", format!("Bearer {}", token))
        .form(&form)
        .send()
        .await
        .context("failed to update MAL list status")?;

    if !response.status().is_success() {
        return Err(anyhow!("MAL API error: {}", response.status()));
    }

    Ok(())
}
