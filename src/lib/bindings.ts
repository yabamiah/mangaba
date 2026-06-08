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
  mal_id?: number | null;
  mal_score?: number | null;
  mal_status?: string | null;
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
  mal_client_id?: string | null;
}

export interface MalAuthStatus {
  client_id?: string | null;
  connected: boolean;
  expires_at?: string | null;
}

export interface MalOAuthResult {
  connected: boolean;
  expires_at?: string | null;
}

export interface MalUser {
  name: string;
  picture: string;
  joined_at?: string | null;
}

export interface MalListStatus {
  status: string;
  score: number;
  num_volumes_read: number;
  num_chapters_read: number;
}

export interface MalPicture {
  medium: string;
  large: string;
}

export interface MalNode {
  id: number;
  title: string;
  main_picture?: MalPicture | null;
}

export interface MalListItem {
  node: MalNode;
  list_status: MalListStatus;
}

export interface MalGenre {
  id: number;
  name: string;
}

export interface MalRankingManga {
  id: number;
  title: string;
  main_picture?: MalPicture | null;
  mean?: number | null;
  genres?: MalGenre[] | null;
}
