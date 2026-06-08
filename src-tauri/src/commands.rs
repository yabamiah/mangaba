use crate::models::{
    AppSettings, Chapter, FollowedManga, Manga, MangaFilters, MangaResult, ReadingProgress,
    SyncStatus,
};
use crate::{notifications, AppState};
use regex::Regex;
use tauri::{AppHandle, Manager, State};

type CommandResult<T> = Result<T, String>;

#[tauri::command]
pub async fn search_manga(
    state: State<'_, AppState>,
    query: String,
    filters: MangaFilters,
    offset: Option<u32>,
    limit: Option<u32>,
) -> CommandResult<Vec<MangaResult>> {
    let cache_key = format!(
        "search:v3:{}:{}:{}:{}",
        query,
        serde_json::to_string(&filters).map_err(to_error)?,
        offset.unwrap_or(0),
        limit.unwrap_or(20)
    );
    if let Some(cached) = state.cache.get(&cache_key).map_err(to_error)? {
        return serde_json::from_str(&cached).map_err(to_error);
    }

    let results = state
        .client
        .search_manga(&query, &filters, offset.unwrap_or(0), limit.unwrap_or(20))
        .await
        .map_err(to_error)?;

    for result in &results {
        let manga = Manga {
            id: result.id.clone(),
            title: result.title.clone(),
            description: result.description.clone(),
            author: result.author.clone(),
            cover_art_id: result.cover_art_id.clone(),
            cover_filename: result.cover_filename.clone(),
            cover_url: result.cover_url.clone(),
            status: result.status.clone(),
            original_language: result.original_language.clone(),
            followed: result.followed,
            created_at: chrono::Utc::now().to_rfc3339(),
            updated_at: chrono::Utc::now().to_rfc3339(),
        };
        let _ = state.db.upsert_manga(&manga);
    }

    state
        .cache
        .set(
            &cache_key,
            &serde_json::to_string(&results).map_err(to_error)?,
            30 * 60,
        )
        .map_err(to_error)?;
    Ok(results)
}

#[tauri::command]
pub async fn get_manga(state: State<'_, AppState>, manga_id: String) -> CommandResult<Manga> {
    if let Some(manga) = state.db.get_manga(&manga_id).map_err(to_error)? {
        if manga.author.is_some()
            && (manga.cover_filename.is_some() || manga.cover_art_id.is_none())
        {
            return Ok(manga);
        }
    }
    let cache_key = format!("manga:v3:{manga_id}");
    if let Some(cached) = state.cache.get(&cache_key).map_err(to_error)? {
        return serde_json::from_str(&cached).map_err(to_error);
    }
    let manga = state.client.get_manga(&manga_id).await.map_err(to_error)?;
    state.db.upsert_manga(&manga).map_err(to_error)?;
    state
        .cache
        .set(
            &cache_key,
            &serde_json::to_string(&manga).map_err(to_error)?,
            30 * 60,
        )
        .map_err(to_error)?;
    Ok(manga)
}

#[tauri::command]
pub async fn get_manga_by_url(state: State<'_, AppState>, url: String) -> CommandResult<Manga> {
    let re =
        Regex::new(r"[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}")
            .map_err(to_error)?;
    let manga_id = re
        .find(&url)
        .map(|found| found.as_str().to_string())
        .ok_or_else(|| "URL do MangaDex sem UUID valido".to_string())?;
    get_manga(state, manga_id).await
}

#[tauri::command]
pub async fn follow_manga(
    state: State<'_, AppState>,
    manga_id: String,
    language: String,
) -> CommandResult<()> {
    if state.db.get_manga(&manga_id).map_err(to_error)?.is_none() {
        let manga = state.client.get_manga(&manga_id).await.map_err(to_error)?;
        state.db.upsert_manga(&manga).map_err(to_error)?;
    }
    state
        .db
        .follow_manga(&manga_id, &language)
        .map_err(to_error)
}

#[tauri::command]
pub fn unfollow_manga(state: State<'_, AppState>, manga_id: String) -> CommandResult<()> {
    state.db.unfollow_manga(&manga_id).map_err(to_error)
}

#[tauri::command]
pub fn set_manga_notifications(
    state: State<'_, AppState>,
    manga_id: String,
    enabled: bool,
) -> CommandResult<()> {
    state
        .db
        .set_manga_notify_enabled(&manga_id, enabled)
        .map_err(to_error)
}

#[tauri::command]
pub fn get_followed_manga(state: State<'_, AppState>, manga_id: String) -> CommandResult<Option<FollowedManga>> {
    state.db.get_followed_manga(&manga_id).map_err(to_error)
}

#[tauri::command]
pub fn list_followed_manga(state: State<'_, AppState>) -> CommandResult<Vec<FollowedManga>> {
    state.db.followed().map_err(to_error)
}

#[tauri::command]
pub async fn sync_manga_chapters(
    state: State<'_, AppState>,
    manga_id: String,
) -> CommandResult<()> {
    let settings = state.db.get_settings().map_err(to_error)?;
    let cache_key = format!("chapters:{}:{}", manga_id, settings.default_language);
    if let Some(cached) = state.cache.get(&cache_key).map_err(to_error)? {
        let chapters: Vec<Chapter> = serde_json::from_str(&cached).map_err(to_error)?;
        for chapter in chapters {
            state.db.upsert_chapter(&chapter).map_err(to_error)?;
        }
        return Ok(());
    }
    let chapters = state
        .client
        .get_chapters(
            &manga_id,
            &settings.default_language,
            &settings.content_ratings,
        )
        .await
        .map_err(to_error)?;
    for chapter in chapters {
        state.db.upsert_chapter(&chapter).map_err(to_error)?;
    }
    let saved = state
        .db
        .chapters(&manga_id, &settings.default_language)
        .map_err(to_error)?;
    state
        .cache
        .set(
            &cache_key,
            &serde_json::to_string(&saved).map_err(to_error)?,
            30 * 60,
        )
        .map_err(to_error)?;
    Ok(())
}

#[tauri::command]
pub async fn sync_all_followed(app: AppHandle, state: State<'_, AppState>) -> CommandResult<()> {
    state.scheduler.begin();
    let followed = state.db.followed().map_err(to_error)?;
    let settings = state.db.get_settings().map_err(to_error)?;
    let mut errors = Vec::new();

    for item in followed {
        match state
            .client
            .get_chapters(
                &item.manga.id,
                &item.preferred_language,
                &settings.content_ratings,
            )
            .await
        {
            Ok(chapters) => {
                for mut chapter in chapters {
                    match state.db.upsert_chapter(&chapter) {
                        Ok(true) if item.notify_enabled => {
                            chapter.is_new = true;
                            if chapter
                                .readable_at
                                .as_deref()
                                .map(is_readable_now)
                                .unwrap_or(true)
                            {
                                notifications::notify_new_chapter(
                                    &app,
                                    &item.manga.title,
                                    chapter.chapter.as_deref().unwrap_or("?"),
                                );
                            }
                        }
                        Ok(_) => {}
                        Err(err) => errors.push(err.to_string()),
                    }
                }
            }
            Err(err) => errors.push(format!("{}: {err}", item.manga.title)),
        }
    }

    state.scheduler.finish(errors.clone());
    if errors.is_empty() {
        Ok(())
    } else {
        Err(errors.join("\n"))
    }
}

#[tauri::command]
pub fn get_chapters(
    state: State<'_, AppState>,
    manga_id: String,
    language: String,
) -> CommandResult<Vec<Chapter>> {
    state.db.chapters(&manga_id, &language).map_err(to_error)
}

#[tauri::command]
pub fn get_sync_status(state: State<'_, AppState>) -> SyncStatus {
    state.scheduler.status()
}

#[tauri::command]
pub async fn get_chapter_pages(
    state: State<'_, AppState>,
    chapter_id: String,
) -> CommandResult<Vec<String>> {
    let cache_key = format!("at-home:{chapter_id}");
    if let Some(cached) = state.cache.get(&cache_key).map_err(to_error)? {
        return serde_json::from_str(&cached).map_err(to_error);
    }
    let pages = state
        .client
        .get_chapter_pages(&chapter_id)
        .await
        .map_err(to_error)?;
    state
        .cache
        .set(
            &cache_key,
            &serde_json::to_string(&pages).map_err(to_error)?,
            15 * 60,
        )
        .map_err(to_error)?;
    Ok(pages)
}

#[tauri::command]
pub fn mark_chapter_read(state: State<'_, AppState>, chapter_id: String) -> CommandResult<()> {
    state.db.mark_chapter_read(&chapter_id).map_err(to_error)
}

#[tauri::command]
pub fn mark_chapter_unread(state: State<'_, AppState>, chapter_id: String) -> CommandResult<()> {
    state.db.mark_chapter_unread(&chapter_id).map_err(to_error)
}

#[tauri::command]
pub fn save_reading_progress(
    state: State<'_, AppState>,
    chapter_id: String,
    page_index: i64,
) -> CommandResult<()> {
    state
        .db
        .save_progress(&chapter_id, page_index, false)
        .map_err(to_error)
}

#[tauri::command]
pub fn get_reading_progress(
    state: State<'_, AppState>,
    chapter_id: String,
) -> CommandResult<ReadingProgress> {
    state.db.progress(&chapter_id).map_err(to_error)
}

#[tauri::command]
pub async fn cache_manga_cover(
    app: AppHandle,
    state: State<'_, AppState>,
    manga_id: String,
) -> CommandResult<String> {
    let manga = if let Some(manga) = state.db.get_manga(&manga_id).map_err(to_error)? {
        if manga.cover_filename.is_some() {
            manga
        } else {
            let manga = state.client.get_manga(&manga_id).await.map_err(to_error)?;
            state.db.upsert_manga(&manga).map_err(to_error)?;
            manga
        }
    } else {
        let manga = state.client.get_manga(&manga_id).await.map_err(to_error)?;
        state.db.upsert_manga(&manga).map_err(to_error)?;
        manga
    };
    let filename = manga
        .cover_filename
        .ok_or_else(|| "Manga sem cover_art retornado pela API".to_string())?;

    if let Some(path) = state
        .db
        .cached_cover_path(&manga_id, &filename)
        .map_err(to_error)?
    {
        if std::path::Path::new(&path).exists() {
            return Ok(path);
        }
    }

    let cover_dir = app
        .path()
        .app_data_dir()
        .map_err(to_error)?
        .join("covers")
        .join(&manga_id);
    std::fs::create_dir_all(&cover_dir).map_err(to_error)?;
    let local_path = cover_dir.join(&filename);
    let bytes = state
        .client
        .download_cover(&manga_id, &filename)
        .await
        .map_err(to_error)?;
    std::fs::write(&local_path, bytes).map_err(to_error)?;
    let local_path = local_path.to_string_lossy().to_string();
    state
        .db
        .save_cover_cache(&manga_id, &filename, &local_path)
        .map_err(to_error)?;
    Ok(local_path)
}

#[tauri::command]
pub fn get_settings(state: State<'_, AppState>) -> CommandResult<AppSettings> {
    state.db.get_settings().map_err(to_error)
}

#[tauri::command]
pub fn update_settings(
    state: State<'_, AppState>,
    settings: serde_json::Value,
) -> CommandResult<()> {
    state.db.update_settings(settings.clone()).map_err(to_error)?;
    if let Some(api_token) = settings.get("api_token") {
        if api_token.is_null() || api_token.as_str().unwrap_or("").is_empty() {
            state.client.set_api_token(None);
        } else if let Some(token) = api_token.as_str() {
            state.client.set_api_token(Some(token.to_string()));
        }
    }
    Ok(())
}

#[tauri::command]
pub fn clear_cache(state: State<'_, AppState>, _older_than_days: Option<u32>) -> CommandResult<()> {
    state.cache.clear().map_err(to_error)
}

fn is_readable_now(value: &str) -> bool {
    chrono::DateTime::parse_from_rfc3339(value)
        .map(|date| date <= chrono::Utc::now())
        .unwrap_or(true)
}

fn to_error(error: impl std::fmt::Display) -> String {
    error.to_string()
}
