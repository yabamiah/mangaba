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
    pub mal_id: Option<i64>,
    pub mal_score: Option<f64>,
    pub mal_status: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct FollowedManga {
    pub manga: Manga,
    pub preferred_language: String,
    pub unread_count: i64,
    pub last_checked_at: Option<String>,
    pub notify_enabled: bool,
    pub unread_chapters: Option<String>,
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
    pub mal_client_id: Option<String>,
    pub mal_sync_on_read: bool,
    pub mal_sync_on_complete: bool,
    pub mal_ask_before_sync: bool,
    pub mal_sync_score: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct SyncStatus {
    pub is_syncing: bool,
    pub last_sync: Option<String>,
    pub errors: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalAuthStatus {
    pub client_id: Option<String>,
    pub connected: bool,
    pub expires_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalOAuthResult {
    pub connected: bool,
    pub expires_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalUser {
    pub name: String,
    pub picture: String,
    pub joined_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalListStatus {
    pub status: String,
    pub score: i32,
    pub num_volumes_read: i32,
    pub num_chapters_read: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalPicture {
    pub medium: String,
    pub large: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalNode {
    pub id: i64,
    pub title: String,
    pub main_picture: Option<MalPicture>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalListItem {
    pub node: MalNode,
    pub list_status: MalListStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MalListResponse {
    pub data: Vec<MalListItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalGenre {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, TS)]
#[ts(export, export_to = "../../src/lib/bindings/")]
pub struct MalRankingManga {
    pub id: i64,
    pub title: String,
    pub main_picture: Option<MalPicture>,
    pub mean: Option<f64>,
    pub genres: Option<Vec<MalGenre>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MalRankingItem {
    pub node: MalRankingManga,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MalRankingResponse {
    pub data: Vec<MalRankingItem>,
}
