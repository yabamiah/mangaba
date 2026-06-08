use crate::models::{Chapter, Manga, MangaFilters, MangaResult};
use crate::rate_limiter::GlobalRateLimiter;
use anyhow::{anyhow, Context, Result};
use chrono::Utc;
use reqwest::Url;
use serde_json::Value;
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

#[derive(Clone)]
pub struct MangaDexClient {
    http: reqwest::Client,
    limiter: GlobalRateLimiter,
    api_token: Arc<RwLock<Option<String>>>,
}

impl MangaDexClient {
    pub fn new(user_agent: String, api_token: Option<String>) -> Result<Self> {
        let http = reqwest::ClientBuilder::new()
            .user_agent(user_agent)
            .timeout(std::time::Duration::from_secs(15))
            .build()?;

        Ok(Self {
            http,
            limiter: GlobalRateLimiter::manga_dex_default(),
            api_token: Arc::new(RwLock::new(api_token)),
        })
    }

    pub fn set_api_token(&self, token: Option<String>) {
        if let Ok(mut lock) = self.api_token.write() {
            *lock = token;
        }
    }

    pub async fn search_manga(
        &self,
        query: &str,
        filters: &MangaFilters,
        offset: u32,
        limit: u32,
    ) -> Result<Vec<MangaResult>> {
        let mut url = Url::parse("https://api.mangadex.org/manga")?;
        {
            let mut query_pairs = url.query_pairs_mut();
            query_pairs.append_pair("title", query);
            query_pairs.append_pair("offset", &offset.to_string());
            query_pairs.append_pair("limit", &limit.min(100).to_string());
            query_pairs.append_pair("includes[]", "cover_art");
            query_pairs.append_pair("includes[]", "author");
            query_pairs.append_pair("includes[]", "artist");
            query_pairs.append_pair("order[relevance]", "desc");
            if let Some(language) = filters
                .original_language
                .as_deref()
                .filter(|value| !value.is_empty())
            {
                query_pairs.append_pair("originalLanguage[]", language);
            }
            if let Some(status) = filters
                .status
                .as_deref()
                .filter(|value| *value != "any" && !value.is_empty())
            {
                query_pairs.append_pair("status[]", status);
            }
            if let Some(translated) = filters
                .available_translated_language
                .as_deref()
                .filter(|value| !value.is_empty())
            {
                query_pairs.append_pair("availableTranslatedLanguage[]", translated);
            }
            for rating in &filters.content_ratings {
                query_pairs.append_pair("contentRating[]", rating);
            }
        }
        let value = self.get_json(url).await?;
        let mut manga = value["data"]
            .as_array()
            .map(|items| items.iter().filter_map(parse_manga).collect::<Vec<_>>())
            .unwrap_or_default();
        self.hydrate_search_covers(&mut manga).await?;
        Ok(manga.into_iter().map(MangaResult::from).collect())
    }

    pub async fn get_manga(&self, manga_id: &str) -> Result<Manga> {
        let mut url = Url::parse(&format!("https://api.mangadex.org/manga/{manga_id}"))?;
        {
            let mut query = url.query_pairs_mut();
            query.append_pair("includes[]", "cover_art");
            query.append_pair("includes[]", "author");
            query.append_pair("includes[]", "artist");
        }
        let value = self.get_json(url).await?;
        let mut manga = parse_manga(&value["data"]).ok_or_else(|| anyhow!("manga not found"))?;
        self.hydrate_cover(&mut manga).await?;
        Ok(manga)
    }

    pub async fn get_chapters(
        &self,
        manga_id: &str,
        language: &str,
        ratings: &[String],
    ) -> Result<Vec<Chapter>> {
        let mut url = Url::parse(&format!("https://api.mangadex.org/manga/{manga_id}/feed"))?;
        {
            let mut query = url.query_pairs_mut();
            query.append_pair("translatedLanguage[]", language);
            query.append_pair("order[chapter]", "asc");
            query.append_pair("limit", "500");
            for rating in ratings {
                query.append_pair("contentRating[]", rating);
            }
        }
        let value = self.get_json(url).await?;
        Ok(value["data"]
            .as_array()
            .map(|items| {
                items
                    .iter()
                    .filter_map(|item| parse_chapter(item, manga_id))
                    .collect::<Vec<_>>()
            })
            .unwrap_or_default())
    }

    pub async fn get_chapter_pages(&self, chapter_id: &str) -> Result<Vec<String>> {
        let url = Url::parse(&format!(
            "https://api.mangadex.org/at-home/server/{chapter_id}"
        ))?;
        let value = self.get_json(url).await?;
        let base_url = value["baseUrl"]
            .as_str()
            .context("at-home response missing baseUrl")?;
        let chapter = &value["chapter"];
        let hash = chapter["hash"]
            .as_str()
            .context("at-home response missing hash")?;
        let data = chapter["data"]
            .as_array()
            .context("at-home response missing pages")?;
        Ok(data
            .iter()
            .filter_map(|item| item.as_str())
            .map(|filename| format!("{base_url}/data/{hash}/{filename}"))
            .collect())
    }

    pub async fn download_cover(&self, manga_id: &str, filename: &str) -> Result<Vec<u8>> {
        let url = Url::parse(&format!(
            "https://uploads.mangadex.org/covers/{manga_id}/{filename}"
        ))?;
        self.limiter.wait().await;
        let response = self.http.get(url).send().await?;
        if !response.status().is_success() {
            return Err(anyhow!("MangaDex cover CDN returned {}", response.status()));
        }
        Ok(response.bytes().await?.to_vec())
    }

    async fn hydrate_search_covers(&self, manga: &mut [Manga]) -> Result<()> {
        let cover_ids = manga
            .iter()
            .filter_map(|item| item.cover_art_id.clone())
            .collect::<Vec<_>>();
        if cover_ids.is_empty() {
            return Ok(());
        }

        let filenames = self.get_cover_file_names(&cover_ids).await?;
        for item in manga {
            if let Some(cover_id) = item.cover_art_id.as_deref() {
                if let Some(filename) = filenames.get(cover_id) {
                    item.cover_filename = Some(filename.clone());
                    item.cover_url = Some(cover_image_url(&item.id, filename));
                }
            }
        }
        Ok(())
    }

    async fn hydrate_cover(&self, manga: &mut Manga) -> Result<()> {
        let Some(cover_id) = manga.cover_art_id.clone() else {
            return Ok(());
        };
        if let Some(filename) = self.get_cover_file_name(&cover_id).await? {
            manga.cover_filename = Some(filename.clone());
            manga.cover_url = Some(cover_image_url(&manga.id, &filename));
        }
        Ok(())
    }

    async fn get_cover_file_names(&self, cover_ids: &[String]) -> Result<HashMap<String, String>> {
        let mut url = Url::parse("https://api.mangadex.org/cover")?;
        {
            let mut query = url.query_pairs_mut();
            query.append_pair("limit", &cover_ids.len().min(100).to_string());
            for cover_id in cover_ids.iter().take(100) {
                query.append_pair("ids[]", cover_id);
            }
        }
        let value = self.get_json(url).await?;
        Ok(value["data"]
            .as_array()
            .map(|items| {
                items
                    .iter()
                    .filter_map(|item| {
                        Some((
                            item["id"].as_str()?.to_string(),
                            item["attributes"]["fileName"].as_str()?.to_string(),
                        ))
                    })
                    .collect::<HashMap<_, _>>()
            })
            .unwrap_or_default())
    }

    async fn get_cover_file_name(&self, cover_id: &str) -> Result<Option<String>> {
        let url = Url::parse(&format!("https://api.mangadex.org/cover/{cover_id}"))?;
        let value = self.get_json(url).await?;
        Ok(value["data"]["attributes"]["fileName"]
            .as_str()
            .map(ToString::to_string))
    }

    async fn get_json(&self, url: Url) -> Result<Value> {
        self.limiter.wait().await;
        let mut req = self.http.get(url);
        if let Ok(lock) = self.api_token.read() {
            if let Some(token) = &*lock {
                req = req.bearer_auth(token);
            }
        }
        let response = req.send().await?;
        if !response.status().is_success() {
            return Err(anyhow!("MangaDex returned {}", response.status()));
        }
        response
            .json::<Value>()
            .await
            .context("failed to decode MangaDex response")
    }
}

fn parse_manga(item: &Value) -> Option<Manga> {
    let id = item["id"].as_str()?.to_string();
    let attributes = &item["attributes"];
    let title = localized_text(&attributes["title"]).unwrap_or_else(|| id.clone());
    let description = localized_text(&attributes["description"]);
    let relationships = item["relationships"].as_array();
    let author = relationship_names(relationships, "author")
        .or_else(|| relationship_names(relationships, "artist"));
    let cover_art_id = relationship_id(relationships, "cover_art");
    let cover_filename = relationship_attribute(relationships, "cover_art", "fileName");
    let cover_url = cover_filename
        .as_ref()
        .map(|filename| cover_image_url(&id, filename));
    let created_at = attributes["createdAt"]
        .as_str()
        .map(ToString::to_string)
        .unwrap_or_else(|| Utc::now().to_rfc3339());
    let updated_at = attributes["updatedAt"]
        .as_str()
        .map(ToString::to_string)
        .unwrap_or_else(|| Utc::now().to_rfc3339());

    Some(Manga {
        id,
        title,
        description,
        author,
        cover_art_id,
        cover_filename,
        cover_url,
        status: attributes["status"]
            .as_str()
            .unwrap_or("unknown")
            .to_string(),
        original_language: attributes["originalLanguage"]
            .as_str()
            .map(ToString::to_string),
        followed: false,
        created_at,
        updated_at,
        mal_id: None,
        mal_score: None,
        mal_status: None,
    })
}

impl From<Manga> for MangaResult {
    fn from(manga: Manga) -> Self {
        Self {
            id: manga.id,
            title: manga.title,
            description: manga.description,
            author: manga.author,
            cover_art_id: manga.cover_art_id,
            cover_filename: manga.cover_filename,
            cover_url: manga.cover_url,
            status: manga.status,
            original_language: manga.original_language,
            followed: manga.followed,
        }
    }
}

fn parse_chapter(item: &Value, fallback_manga_id: &str) -> Option<Chapter> {
    let attributes = &item["attributes"];
    let manga_id = item["relationships"]
        .as_array()
        .and_then(|relationships| {
            relationships.iter().find_map(|relationship| {
                if relationship["type"].as_str()? == "manga" {
                    relationship["id"].as_str().map(ToString::to_string)
                } else {
                    None
                }
            })
        })
        .unwrap_or_else(|| fallback_manga_id.to_string());

    Some(Chapter {
        id: item["id"].as_str()?.to_string(),
        manga_id,
        volume: attributes["volume"].as_str().map(ToString::to_string),
        chapter: attributes["chapter"].as_str().map(ToString::to_string),
        title: attributes["title"].as_str().map(ToString::to_string),
        translated_language: attributes["translatedLanguage"]
            .as_str()
            .unwrap_or("pt-br")
            .to_string(),
        scanlator_group: None,
        external_url: attributes["externalUrl"].as_str().map(ToString::to_string),
        publish_at: attributes["publishAt"].as_str().map(ToString::to_string),
        readable_at: attributes["readableAt"].as_str().map(ToString::to_string),
        pages: attributes["pages"].as_i64(),
        read: false,
        is_new: false,
    })
}

fn localized_text(value: &Value) -> Option<String> {
    ["pt-br", "en", "ja-ro", "ja"]
        .iter()
        .find_map(|key| value[*key].as_str().map(ToString::to_string))
        .or_else(|| {
            value
                .as_object()?
                .values()
                .find_map(|entry| entry.as_str().map(ToString::to_string))
        })
}

fn relationship_id(relationships: Option<&Vec<Value>>, relationship_type: &str) -> Option<String> {
    relationships?.iter().find_map(|relationship| {
        if relationship["type"].as_str()? == relationship_type {
            relationship["id"].as_str().map(ToString::to_string)
        } else {
            None
        }
    })
}

fn relationship_attribute(
    relationships: Option<&Vec<Value>>,
    relationship_type: &str,
    attribute: &str,
) -> Option<String> {
    relationships?.iter().find_map(|relationship| {
        if relationship["type"].as_str()? == relationship_type {
            relationship["attributes"][attribute]
                .as_str()
                .map(ToString::to_string)
        } else {
            None
        }
    })
}

fn relationship_names(
    relationships: Option<&Vec<Value>>,
    relationship_type: &str,
) -> Option<String> {
    let names = relationships?
        .iter()
        .filter_map(|relationship| {
            if relationship["type"].as_str()? == relationship_type {
                relationship["attributes"]["name"]
                    .as_str()
                    .map(ToString::to_string)
            } else {
                None
            }
        })
        .collect::<Vec<_>>();
    if names.is_empty() {
        None
    } else {
        Some(names.join(", "))
    }
}

fn cover_image_url(manga_id: &str, filename: &str) -> String {
    format!("https://uploads.mangadex.org/covers/{manga_id}/{filename}.256.jpg")
}
