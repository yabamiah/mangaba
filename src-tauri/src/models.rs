use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MangaFilters {
    pub original_language: Option<String>,
    pub status: Option<String>,
    pub content_ratings: Vec<String>,
    pub available_translated_language: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MangaResult {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub author: Option<String>,
    pub cover_art_id: Option<String>,
    pub cover_filename: Option<String>,
    pub cover_url: Option<String>,
    pub status: String,
    pub original_language: Option<String>,
    pub followed: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct Manga {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub author: Option<String>,
    pub cover_art_id: Option<String>,
    pub cover_filename: Option<String>,
    pub cover_url: Option<String>,
    pub status: String,
    pub original_language: Option<String>,
    pub followed: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct FollowedManga {
    pub manga: Manga,
    pub preferred_language: String,
    pub unread_count: i64,
    pub last_checked_at: Option<String>,
    pub notify_enabled: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct Chapter {
    pub id: String,
    pub manga_id: String,
    pub volume: Option<String>,
    pub chapter: Option<String>,
    pub title: Option<String>,
    pub translated_language: String,
    pub scanlator_group: Option<String>,
    pub external_url: Option<String>,
    pub publish_at: Option<String>,
    pub readable_at: Option<String>,
    pub pages: Option<i64>,
    pub read: bool,
    pub is_new: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct ReadingProgress {
    pub chapter_id: String,
    pub page_index: i64,
    pub completed: bool,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct AppSettings {
    pub default_language: String,
    pub update_interval_minutes: i64,
    pub content_ratings: Vec<String>,
    pub user_agent: String,
    pub theme: String,
    pub reader_mode: String,
    pub api_token: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct SyncStatus {
    pub is_syncing: bool,
    pub last_sync: Option<String>,
    pub errors: Vec<String>,
}
