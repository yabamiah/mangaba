use tauri::AppHandle;
use tauri_plugin_notification::NotificationExt;

pub fn notify_new_chapter(app: &AppHandle, title: &str, chapter: &str) {
    let _ = app
        .notification()
        .builder()
        .title(format!("Mangaba - {title}"))
        .body(format!("Capitulo {chapter} em portugues disponivel."))
        .show();
}
