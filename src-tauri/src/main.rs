mod cache;
mod commands;
mod database;
mod mal;
mod mangadex;
mod models;
mod notifications;
mod rate_limiter;
mod scheduler;

use anyhow::Context;
use cache::ApiCache;
use database::Database;
use mangadex::MangaDexClient;
use scheduler::SyncScheduler;
use tauri::Manager;

pub struct AppState {
    pub db: Database,
    pub client: MangaDexClient,
    pub cache: ApiCache,
    pub scheduler: SyncScheduler,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = dotenvy::dotenv();

    tauri::Builder::default()
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            let data_dir = app
                .path()
                .app_data_dir()
                .context("failed to resolve app data dir")?;
            std::fs::create_dir_all(&data_dir)?;

            let db = Database::open(data_dir.join("mangaba.sqlite"))?;
            let cache = ApiCache::open(data_dir.join("api-cache"))?;
            let user_agent = db
                .get_setting("user_agent")?
                .unwrap_or_else(|| "Mangaba/0.1.0 (+local desktop app)".to_string());
            let api_token = db.get_setting("api_token")?;
            let client = MangaDexClient::new(user_agent, api_token)?;
            let scheduler = SyncScheduler::new();

            app.manage(AppState {
                db,
                client,
                cache,
                scheduler,
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::search_manga,
            commands::get_manga,
            commands::get_manga_by_url,
            commands::follow_manga,
            commands::unfollow_manga,
            commands::set_manga_notifications,
            commands::get_followed_manga,
            commands::list_followed_manga,
            commands::sync_manga_chapters,
            commands::sync_all_followed,
            commands::get_chapters,
            commands::get_sync_status,
            commands::get_chapter_pages,
            commands::mark_chapter_read,
            commands::mark_chapter_unread,
            commands::save_reading_progress,
            commands::get_reading_progress,
            commands::cache_manga_cover,
            commands::get_settings,
            commands::update_settings,
            commands::clear_cache,
            commands::get_mal_auth_status,
            commands::connect_mal,
            commands::refresh_mal_token,
            commands::disconnect_mal,
            commands::get_mal_user,
            commands::get_mal_user_mangalist,
            commands::get_mal_ranking,
            commands::update_mal_list_status,
            commands::get_categories,
            commands::create_category,
            commands::update_category,
            commands::delete_category,
            commands::set_manga_categories,
            commands::add_manga_history,
            commands::get_history
        ])
        .run(tauri::generate_context!())
        .expect("error while running Mangaba");
}

fn main() {
    run();
}
