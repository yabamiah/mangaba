use crate::models::{AppSettings, Chapter, FollowedManga, Manga, ReadingProgress};
use anyhow::{Context, Result};
use chrono::Utc;
use rusqlite::{params, Connection, OptionalExtension};
use rusqlite_migration::{Migrations, M};
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

#[derive(Clone)]
pub struct Database {
    conn: Arc<Mutex<Connection>>,
}

impl Database {
    pub fn open(path: PathBuf) -> Result<Self> {
        let mut conn = Connection::open(path)?;
        conn.pragma_update(None, "foreign_keys", "ON")?;
        migrations().to_latest(&mut conn)?;
        let db = Self {
            conn: Arc::new(Mutex::new(conn)),
        };
        db.seed_settings()?;
        Ok(db)
    }

    pub fn upsert_manga(&self, manga: &Manga) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO manga (id, title, description, author, cover_art_id, cover_filename, cover_url, status, original_language, created_at, updated_at, mal_id, mal_score, mal_status)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)
             ON CONFLICT(id) DO UPDATE SET title=excluded.title, description=excluded.description, author=excluded.author,
             cover_art_id=excluded.cover_art_id, cover_filename=excluded.cover_filename, cover_url=excluded.cover_url,
             status=excluded.status, original_language=excluded.original_language, updated_at=excluded.updated_at,
             mal_id=excluded.mal_id, mal_score=excluded.mal_score, mal_status=excluded.mal_status",
            params![
                manga.id,
                manga.title,
                manga.description,
                manga.author,
                manga.cover_art_id,
                manga.cover_filename,
                manga.cover_url,
                manga.status,
                manga.original_language,
                manga.created_at,
                manga.updated_at,
                manga.mal_id,
                manga.mal_score,
                manga.mal_status
            ],
        )?;
        Ok(())
    }

    pub fn get_manga(&self, manga_id: &str) -> Result<Option<Manga>> {
        let conn = self.conn.lock().unwrap();
        conn.query_row(
            "SELECT m.id, m.title, m.description, m.author, m.cover_art_id, m.cover_filename, m.cover_url,
             m.status, m.original_language, m.created_at, m.updated_at,
             m.mal_id, m.mal_score, m.mal_status, EXISTS(SELECT 1 FROM followed_manga f WHERE f.manga_id = m.id)
             FROM manga m WHERE m.id = ?1",
            [manga_id],
            manga_from_row,
        )
        .optional()
        .context("failed to load manga")
    }

    pub fn follow_manga(&self, manga_id: &str, language: &str) -> Result<()> {
        let now = Utc::now().to_rfc3339();
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO followed_manga (manga_id, preferred_language, last_checked_at, notify_enabled)
             VALUES (?1, ?2, ?3, 1)
             ON CONFLICT(manga_id) DO UPDATE SET preferred_language=excluded.preferred_language",
            params![manga_id, language, now],
        )?;
        Ok(())
    }

    pub fn unfollow_manga(&self, manga_id: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM followed_manga WHERE manga_id = ?1", [manga_id])?;
        Ok(())
    }

    pub fn set_manga_notify_enabled(&self, manga_id: &str, enabled: bool) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "UPDATE followed_manga SET notify_enabled = ?1 WHERE manga_id = ?2",
            params![if enabled { 1 } else { 0 }, manga_id],
        )?;
        Ok(())
    }

    pub fn get_followed_manga(&self, manga_id: &str) -> Result<Option<FollowedManga>> {
        let conn = self.conn.lock().unwrap();
        conn.query_row(
            "SELECT m.id, m.title, m.description, m.author, m.cover_art_id, m.cover_filename, m.cover_url,
             m.status, m.original_language, m.created_at, m.updated_at,
             m.mal_id, m.mal_score, m.mal_status, 1, f.preferred_language, f.last_checked_at, f.notify_enabled,
             (SELECT COUNT(*) FROM chapters c WHERE c.manga_id = m.id AND c.read = 0),
             (SELECT GROUP_CONCAT(chapter, ', ') FROM (SELECT chapter FROM chapters WHERE manga_id = m.id AND read = 0 ORDER BY CAST(chapter AS REAL) DESC LIMIT 3))
             FROM followed_manga f JOIN manga m ON m.id = f.manga_id WHERE m.id = ?1",
            [manga_id],
            |row| {
                Ok(FollowedManga {
                    manga: manga_from_row(row)?,
                    preferred_language: row.get(15)?,
                    last_checked_at: row.get(16)?,
                    notify_enabled: row.get::<_, i64>(17)? == 1,
                    unread_count: row.get(18)?,
                    unread_chapters: row.get(19)?,
                })
            },
        )
        .optional()
        .context("failed to load followed manga")
    }

    pub fn followed(&self) -> Result<Vec<FollowedManga>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT m.id, m.title, m.description, m.author, m.cover_art_id, m.cover_filename, m.cover_url,
             m.status, m.original_language, m.created_at, m.updated_at,
             m.mal_id, m.mal_score, m.mal_status, 1, f.preferred_language, f.last_checked_at, f.notify_enabled,
             (SELECT COUNT(*) FROM chapters c WHERE c.manga_id = m.id AND c.read = 0),
             (SELECT GROUP_CONCAT(chapter, ', ') FROM (SELECT chapter FROM chapters WHERE manga_id = m.id AND read = 0 ORDER BY CAST(chapter AS REAL) DESC LIMIT 3))
             FROM followed_manga f JOIN manga m ON m.id = f.manga_id ORDER BY m.title ASC",
        )?;
        let rows = stmt.query_map([], |row| {
            Ok(FollowedManga {
                manga: manga_from_row(row)?,
                preferred_language: row.get(15)?,
                last_checked_at: row.get(16)?,
                notify_enabled: row.get::<_, i64>(17)? == 1,
                unread_count: row.get(18)?,
                unread_chapters: row.get(19)?,
            })
        })?;
        rows.collect::<rusqlite::Result<Vec<_>>>()
            .context("failed to load followed manga")
    }

    pub fn upsert_chapter(&self, chapter: &Chapter) -> Result<bool> {
        let conn = self.conn.lock().unwrap();
        let existed: Option<String> = conn
            .query_row(
                "SELECT id FROM chapters WHERE id = ?1",
                [&chapter.id],
                |row| row.get(0),
            )
            .optional()?;
        conn.execute(
            "INSERT INTO chapters (id, manga_id, volume, chapter, title, translated_language, scanlator_group, external_url,
             publish_at, readable_at, pages, read)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
             ON CONFLICT(id) DO UPDATE SET volume=excluded.volume, chapter=excluded.chapter, title=excluded.title,
             scanlator_group=excluded.scanlator_group, external_url=excluded.external_url, publish_at=excluded.publish_at,
             readable_at=excluded.readable_at, pages=excluded.pages",
            params![
                chapter.id,
                chapter.manga_id,
                chapter.volume,
                chapter.chapter,
                chapter.title,
                chapter.translated_language,
                chapter.scanlator_group,
                chapter.external_url,
                chapter.publish_at,
                chapter.readable_at,
                chapter.pages,
                if chapter.read { 1 } else { 0 }
            ],
        )?;
        Ok(existed.is_none())
    }

    pub fn chapters(&self, manga_id: &str, language: &str) -> Result<Vec<Chapter>> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, manga_id, volume, chapter, title, translated_language, scanlator_group, external_url,
             publish_at, readable_at, pages, read, 0 FROM chapters
             WHERE manga_id = ?1 AND translated_language = ?2
             ORDER BY CAST(volume AS INTEGER), CAST(chapter AS REAL), readable_at ASC",
        )?;
        let rows = stmt.query_map(params![manga_id, language], chapter_from_row)?;
        rows.collect::<rusqlite::Result<Vec<_>>>()
            .context("failed to load chapters")
    }

    pub fn mark_chapter_read(&self, chapter_id: &str) -> Result<()> {
        let now = Utc::now().to_rfc3339();
        let conn = self.conn.lock().unwrap();
        conn.execute("UPDATE chapters SET read = 1 WHERE id = ?1", [chapter_id])?;
        conn.execute(
            "INSERT INTO reading_progress (chapter_id, page_index, completed, updated_at)
             VALUES (?1, COALESCE((SELECT page_index FROM reading_progress WHERE chapter_id = ?1), 0), 1, ?2)
             ON CONFLICT(chapter_id) DO UPDATE SET completed=1, updated_at=excluded.updated_at",
            params![chapter_id, now],
        )?;
        Ok(())
    }

    pub fn mark_chapter_unread(&self, chapter_id: &str) -> Result<()> {
        let now = Utc::now().to_rfc3339();
        let conn = self.conn.lock().unwrap();
        conn.execute("UPDATE chapters SET read = 0 WHERE id = ?1", [chapter_id])?;
        conn.execute(
            "UPDATE reading_progress SET completed = 0, updated_at = ?2 WHERE chapter_id = ?1",
            params![chapter_id, now],
        )?;
        Ok(())
    }

    pub fn save_progress(&self, chapter_id: &str, page_index: i64, completed: bool) -> Result<()> {
        let now = Utc::now().to_rfc3339();
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO reading_progress (chapter_id, page_index, completed, updated_at)
             VALUES (?1, ?2, ?3, ?4)
             ON CONFLICT(chapter_id) DO UPDATE SET page_index=excluded.page_index, completed=excluded.completed, updated_at=excluded.updated_at",
            params![chapter_id, page_index, if completed { 1 } else { 0 }, now],
        )?;
        Ok(())
    }

    pub fn progress(&self, chapter_id: &str) -> Result<ReadingProgress> {
        let conn = self.conn.lock().unwrap();
        conn.query_row(
            "SELECT chapter_id, page_index, completed, updated_at FROM reading_progress WHERE chapter_id = ?1",
            [chapter_id],
            |row| {
                Ok(ReadingProgress {
                    chapter_id: row.get(0)?,
                    page_index: row.get(1)?,
                    completed: row.get::<_, i64>(2)? == 1,
                    updated_at: row.get(3)?,
                })
            },
        )
        .optional()
        .map(|value| {
            value.unwrap_or_else(|| ReadingProgress {
                chapter_id: chapter_id.to_string(),
                page_index: 0,
                completed: false,
                updated_at: Utc::now().to_rfc3339(),
            })
        })
        .context("failed to load reading progress")
    }

    pub fn cached_cover_path(&self, manga_id: &str, filename: &str) -> Result<Option<String>> {
        let conn = self.conn.lock().unwrap();
        conn.query_row(
            "SELECT local_path FROM cover_cache WHERE manga_id = ?1 AND filename = ?2",
            params![manga_id, filename],
            |row| row.get(0),
        )
        .optional()
        .context("failed to load cached cover")
    }

    pub fn save_cover_cache(&self, manga_id: &str, filename: &str, local_path: &str) -> Result<()> {
        let now = Utc::now().to_rfc3339();
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO cover_cache (manga_id, filename, local_path, cached_at)
             VALUES (?1, ?2, ?3, ?4)
             ON CONFLICT(manga_id, filename) DO UPDATE SET local_path=excluded.local_path, cached_at=excluded.cached_at",
            params![manga_id, filename, local_path, now],
        )?;
        Ok(())
    }

    pub fn get_settings(&self) -> Result<AppSettings> {
        Ok(AppSettings {
            default_language: self
                .get_setting("default_language")?
                .unwrap_or_else(|| "pt-br".to_string()),
            update_interval_minutes: self
                .get_setting("update_interval_minutes")?
                .and_then(|value| value.parse().ok())
                .unwrap_or(60),
            content_ratings: self
                .get_setting("content_ratings")?
                .and_then(|value| serde_json::from_str(&value).ok())
                .unwrap_or_else(|| vec!["safe".to_string(), "suggestive".to_string()]),
            user_agent: self
                .get_setting("user_agent")?
                .unwrap_or_else(|| "Mangaba/0.1.0 (+local desktop app)".to_string()),
            theme: self
                .get_setting("theme")?
                .unwrap_or_else(|| "system".to_string()),
            reader_mode: self
                .get_setting("reader_mode")?
                .unwrap_or_else(|| "scroll".to_string()),
            reader_layout: self
                .get_setting("reader_layout")?
                .unwrap_or_else(|| "single".to_string()),
            reader_fit: self
                .get_setting("reader_fit")?
                .unwrap_or_else(|| "auto".to_string()),
            api_token: self.get_setting("api_token")?,
            mal_client_id: self
                .get_setting("mal_client_id")?
                .or_else(|| std::env::var("MAL_CLIENT_ID").ok()),
            mal_sync_on_read: self
                .get_setting("mal_sync_on_read")?
                .map(|v| v == "true")
                .unwrap_or(true),
            mal_sync_on_complete: self
                .get_setting("mal_sync_on_complete")?
                .map(|v| v == "true")
                .unwrap_or(true),
            mal_ask_before_sync: self
                .get_setting("mal_ask_before_sync")?
                .map(|v| v == "true")
                .unwrap_or(false),
            mal_sync_score: self
                .get_setting("mal_sync_score")?
                .map(|v| v == "true")
                .unwrap_or(false),
        })
    }

    pub fn update_settings(&self, settings: serde_json::Value) -> Result<()> {
        if let Some(map) = settings.as_object() {
            for (key, value) in map {
                if value.is_null() {
                    self.remove_setting(key)?;
                    continue;
                }

                let value = if value.is_string() {
                    value.as_str().unwrap_or_default().to_string()
                } else {
                    value.to_string()
                };
                self.set_setting(key, &value)?;
            }
        }
        Ok(())
    }

    pub fn get_setting(&self, key: &str) -> Result<Option<String>> {
        let conn = self.conn.lock().unwrap();
        conn.query_row(
            "SELECT value FROM app_settings WHERE key = ?1",
            [key],
            |row| row.get(0),
        )
        .optional()
        .context("failed to load setting")
    }

    pub fn set_setting(&self, key: &str, value: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT INTO app_settings (key, value) VALUES (?1, ?2)
             ON CONFLICT(key) DO UPDATE SET value=excluded.value",
            params![key, value],
        )?;
        Ok(())
    }

    pub fn remove_setting(&self, key: &str) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        conn.execute("DELETE FROM app_settings WHERE key = ?1", [key])?;
        Ok(())
    }

    fn seed_settings(&self) -> Result<()> {
        let defaults = [
            ("default_language", "pt-br"),
            ("update_interval_minutes", "60"),
            ("content_ratings", r#"["safe","suggestive"]"#),
            ("user_agent", "Mangaba/0.1.0 (+local desktop app)"),
            ("theme", "system"),
            ("reader_mode", "scroll"),
            ("mal_sync_on_read", "true"),
            ("mal_sync_on_complete", "true"),
            ("mal_ask_before_sync", "false"),
            ("mal_sync_score", "false"),
        ];
        for (key, value) in defaults {
            if self.get_setting(key)?.is_none() {
                self.set_setting(key, value)?;
            }
        }
        Ok(())
    }
}

fn migrations() -> Migrations<'static> {
    Migrations::new(vec![
        M::up(
            r#"
        CREATE TABLE manga (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          cover_filename TEXT,
          status TEXT,
          original_language TEXT,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE TABLE followed_manga (
          manga_id TEXT PRIMARY KEY,
          preferred_language TEXT NOT NULL DEFAULT 'pt-br',
          last_checked_at TEXT,
          notify_enabled INTEGER NOT NULL DEFAULT 1,
          FOREIGN KEY (manga_id) REFERENCES manga(id)
        );
        CREATE TABLE chapters (
          id TEXT PRIMARY KEY,
          manga_id TEXT NOT NULL,
          volume TEXT,
          chapter TEXT,
          title TEXT,
          translated_language TEXT NOT NULL,
          scanlator_group TEXT,
          external_url TEXT,
          publish_at TEXT,
          readable_at TEXT,
          pages INTEGER,
          read INTEGER NOT NULL DEFAULT 0,
          FOREIGN KEY (manga_id) REFERENCES manga(id)
        );
        CREATE TABLE cover_cache (
          manga_id TEXT NOT NULL,
          filename TEXT NOT NULL,
          local_path TEXT NOT NULL,
          cached_at TEXT NOT NULL,
          PRIMARY KEY (manga_id, filename)
        );
        CREATE TABLE reading_progress (
          chapter_id TEXT PRIMARY KEY,
          page_index INTEGER NOT NULL DEFAULT 0 CHECK(page_index >= 0),
          completed INTEGER NOT NULL DEFAULT 0,
          updated_at TEXT NOT NULL,
          FOREIGN KEY (chapter_id) REFERENCES chapters(id)
        );
        CREATE TABLE app_settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
        CREATE INDEX idx_chapters_manga_id ON chapters(manga_id);
        CREATE INDEX idx_chapters_language ON chapters(translated_language);
        CREATE INDEX idx_chapters_readable ON chapters(readable_at DESC);
        "#,
        ),
        M::up(
            r#"
            ALTER TABLE manga ADD COLUMN author TEXT;
            ALTER TABLE manga ADD COLUMN cover_art_id TEXT;
            ALTER TABLE manga ADD COLUMN cover_url TEXT;
            "#,
        ),
        M::up(
            r#"
            ALTER TABLE manga ADD COLUMN mal_id INTEGER;
            ALTER TABLE manga ADD COLUMN mal_score REAL;
            ALTER TABLE manga ADD COLUMN mal_status TEXT;
            "#,
        ),
    ])
}

fn manga_from_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<Manga> {
    Ok(Manga {
        id: row.get(0)?,
        title: row.get(1)?,
        description: row.get(2)?,
        author: row.get(3)?,
        cover_art_id: row.get(4)?,
        cover_filename: row.get(5)?,
        cover_url: row.get(6)?,
        status: row.get(7)?,
        original_language: row.get(8)?,
        created_at: row.get(9)?,
        updated_at: row.get(10)?,
        mal_id: row.get(11)?,
        mal_score: row.get(12)?,
        mal_status: row.get(13)?,
        followed: row.get::<_, i64>(14)? == 1,
    })
}

fn chapter_from_row(row: &rusqlite::Row<'_>) -> rusqlite::Result<Chapter> {
    Ok(Chapter {
        id: row.get(0)?,
        manga_id: row.get(1)?,
        volume: row.get(2)?,
        chapter: row.get(3)?,
        title: row.get(4)?,
        translated_language: row.get(5)?,
        scanlator_group: row.get(6)?,
        external_url: row.get(7)?,
        publish_at: row.get(8)?,
        readable_at: row.get(9)?,
        pages: row.get(10)?,
        read: row.get::<_, i64>(11)? == 1,
        is_new: row.get::<_, i64>(12)? == 1,
    })
}
