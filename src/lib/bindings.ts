export type ContentRating = "safe" | "suggestive" | "erotica" | "pornographic";
export type MangaStatus = "ongoing" | "completed" | "hiatus" | "cancelled" | "unknown";
export type ReaderMode = "scroll" | "single" | "rtl";
export type ThemeMode = "light" | "dark" | "system";

export interface MangaFilters {
  original_language?: string;
  status?: MangaStatus | "any";
  content_ratings: ContentRating[];
  available_translated_language?: string;
}

export interface MangaResult {
  id: string;
  title: string;
  description?: string;
  author?: string;
  cover_art_id?: string;
  cover_filename?: string;
  cover_url?: string;
  status: MangaStatus;
  original_language?: string;
  followed: boolean;
}

export interface Manga extends MangaResult {
  created_at: string;
  updated_at: string;
}

export interface FollowedManga {
  manga: Manga;
  preferred_language: string;
  unread_count: number;
  last_checked_at?: string;
  notify_enabled: boolean;
}

export interface Chapter {
  id: string;
  manga_id: string;
  volume?: string;
  chapter?: string;
  title?: string;
  translated_language: string;
  scanlator_group?: string;
  external_url?: string;
  publish_at?: string;
  readable_at?: string;
  pages?: number;
  read: boolean;
  is_new: boolean;
}

export interface ReadingProgress {
  chapter_id: string;
  page_index: number;
  completed: boolean;
  updated_at: string;
}

export interface SyncStatus {
  is_syncing: boolean;
  last_sync?: string;
  errors: string[];
}

export interface AppSettings {
  default_language: string;
  update_interval_minutes: number;
  content_ratings: ContentRating[];
  user_agent: string;
  theme: ThemeMode;
  reader_mode: ReaderMode;
  api_token?: string | null;
}
