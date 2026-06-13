import { invoke as tauriInvoke } from "@tauri-apps/api/core";
import type {
  AppSettings,
  Category,
  Chapter,
  FollowedManga,
  Manga,
  MangaFilters,
  MangaResult,
  MalAuthStatus,
  MalOAuthResult,
  ReadingProgress,
  SyncStatus,
  MalUser,
  MalListItem,
  MalRankingManga,
  HistoryEntry,
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
  getMalAuthStatus() {
    return invoke<MalAuthStatus>("get_mal_auth_status");
  },
  connectMal(clientId?: string) {
    return invoke<MalOAuthResult>("connect_mal", { clientId });
  },
  refreshMalToken() {
    return invoke<MalOAuthResult>("refresh_mal_token");
  },
  disconnectMal() {
    return invoke<void>("disconnect_mal");
  },
  getMalUser() {
    return invoke<MalUser>("get_mal_user");
  },
  getMalUserMangalist() {
    return invoke<MalListItem[]>("get_mal_user_mangalist");
  },
  getMalRanking() {
    return invoke<MalRankingManga[]>("get_mal_ranking");
  },
  updateMalListStatus(mangaId: number, status: string, numChaptersRead: number, score?: number) {
    return invoke<void>("update_mal_list_status", { mangaId, status, numChaptersRead, score });
  },
  getCategories() {
    return invoke<Category[]>("get_categories");
  },
  createCategory(id: string, name: string, color: string, icon: string, sortOrder: number) {
    return invoke<void>("create_category", { id, name, color, icon, sortOrder });
  },
  updateCategory(id: string, name: string, color: string, icon: string, sortOrder: number) {
    return invoke<void>("update_category", { id, name, color, icon, sortOrder });
  },
  deleteCategory(id: string) {
    return invoke<void>("delete_category", { id });
  },
  setMangaCategories(mangaId: string, categoryIds: string[]) {
    return invoke<void>("set_manga_categories", { mangaId, categoryIds });
  },
  getHistory() {
    return invoke<HistoryEntry[]>("get_history");
  },
  addMangaHistory(mangaId: string) {
    return invoke<void>("add_manga_history", { mangaId });
  },
};

export function extractMangaDexId(input: string): string | null {
  return input.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i)?.[0] ?? null;
}
