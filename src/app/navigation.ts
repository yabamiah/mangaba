export type Page = "home" | "search" | "library" | "manga" | "reader" | "history" | "settings";

export interface RouteState {
  page: Page;
  mangaId?: string;
  chapterId?: string;
  historyDate?: string;
}
