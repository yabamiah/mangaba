import { invoke as tauriInvoke } from "@tauri-apps/api/core";
import type {
  AppSettings,
  Chapter,
  FollowedManga,
  Manga,
  MangaFilters,
  MangaResult,
  ReadingProgress,
  SyncStatus,
} from "./bindings";

const isTauri = "__TAURI_INTERNALS__" in window;

async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  if (isTauri) {
    return tauriInvoke<T>(command, args);
  }
  throw new Error(`Comando ${command} indisponivel fora do Tauri. Execute com npm run tauri:dev para testar a integracao MangaDex.`);
}

export const api = {
  searchManga(query: string, filters: MangaFilters, offset = 0, limit = 20) {
    return invoke<MangaResult[]>("search_manga", { query, filters, offset, limit });
  },
  getManga(mangaId: string) {
    return invoke<Manga>("get_manga", { mangaId });
  },
  getMangaByUrl(url: string) {
    return invoke<Manga>("get_manga_by_url", { url });
  },
  followManga(mangaId: string, language: string) {
    return invoke<void>("follow_manga", { mangaId, language });
  },
  unfollowManga(mangaId: string) {
    return invoke<void>("unfollow_manga", { mangaId });
  },
  setMangaNotifications(mangaId: string, enabled: boolean) {
    return invoke<void>("set_manga_notifications", { mangaId, enabled });
  },
  getFollowedManga(mangaId: string) {
    return invoke<FollowedManga | null>("get_followed_manga", { mangaId });
  },
  listFollowedManga() {
    return invoke<FollowedManga[]>("list_followed_manga");
  },
  syncMangaChapters(mangaId: string) {
    return invoke<void>("sync_manga_chapters", { mangaId });
  },
  syncAllFollowed() {
    return invoke<void>("sync_all_followed");
  },
  getChapters(mangaId: string, language: string) {
    return invoke<Chapter[]>("get_chapters", { mangaId, language });
  },
  getSyncStatus() {
    return invoke<SyncStatus>("get_sync_status");
  },
  getChapterPages(chapterId: string) {
    return invoke<string[]>("get_chapter_pages", { chapterId });
  },
  markChapterRead(chapterId: string) {
    return invoke<void>("mark_chapter_read", { chapterId });
  },
  markChapterUnread(chapterId: string) {
    return invoke<void>("mark_chapter_unread", { chapterId });
  },
  saveReadingProgress(chapterId: string, pageIndex: number) {
    return invoke<void>("save_reading_progress", { chapterId, pageIndex });
  },
  getReadingProgress(chapterId: string) {
    return invoke<ReadingProgress>("get_reading_progress", { chapterId });
  },
  cacheMangaCover(mangaId: string) {
    return invoke<string>("cache_manga_cover", { mangaId });
  },
  getSettings() {
    return invoke<AppSettings>("get_settings");
  },
  updateSettings(nextSettings: Partial<AppSettings>) {
    return invoke<void>("update_settings", { settings: nextSettings });
  },
  clearCache(olderThanDays?: number) {
    return invoke<void>("clear_cache", { olderThanDays });
  },
};

export function extractMangaDexId(input: string): string | null {
  return input.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] ?? null;
}
