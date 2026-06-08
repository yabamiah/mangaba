import React, { useMemo } from "react";
import { cn } from "../../utils";
import { StatsCard } from "../StatsCard";
import { MiniCalendar, CalendarDay } from "../MiniCalendar";
import { HandDrawnTracker, Habit } from "../HandDrawnTracker";

// --- Icons ---
const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const FlameIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

// --- Types ---

/** Estatísticas de leitura do usuário */
export interface ReadingStats {
  /** Total de capítulos marcados como lidos */
  chaptersRead: number;
  /** Total de capítulos em toda a biblioteca */
  chaptersTotal: number;
  /** Número de mangás sendo acompanhados */
  mangasFollowing: number;
  /** Dias consecutivos com pelo menos uma leitura */
  streak: number;
}

/** Um mangá com capítulos não lidos — exibido na seção de atalhos */
export interface UnreadManga {
  id: string | number;
  /** Título do mangá */
  title: string;
  /** Quantidade de capítulos não lidos */
  unreadCount: number;
  /**
   * Classe Tailwind de cor de acento (bg-*).
   * Sugestão: mapear por gênero ou tag do MangaDex.
   * Ex: action → "bg-orange-400", romance → "bg-pink-400"
   */
  accentColor: string;
  /** URL da capa já cacheada localmente (opcional) */
  coverUrl?: string;
}

/** Informações sobre o último mangá/capítulo lido */
export interface LastRead {
  mangaTitle: string;
  chapterNumber: number | string;
  /** URL da capa para o banner (opcional — fallback para gradiente) */
  coverUrl?: string;
}

/** Estado da sincronização com o MangaDex */
export interface SyncState {
  /** "idle" | "syncing" | "done" | "error" */
  status: "idle" | "syncing" | "done" | "error";
  /** Timestamp da última sync bem-sucedida */
  lastSyncedAt?: Date;
}

export interface DashboardLabels {
  overviewTitle?: string;
  trackerTitle?: string;
  newChaptersTitle?: string;
  calendarTitle?: string;
  btnSearch?: string;
  statChapters?: string;
  statRead?: string;
  statFollowing?: string;
  statStreak?: string;
  statDays?: string;
  chaptersUnit?: string;
  mangasUnit?: string;
  syncing?: string;
  syncError?: string;
  neverSynced?: string;
  justNow?: string;
  minutesAgo?: (count: number) => string;
  hoursAgo?: (count: number) => string;
  daysAgo?: (count: number) => string;
  syncFailure?: string;
  chapterContinue?: (chapter: string | number) => string;
  noWeeklyActivity?: string;
  unreadCount?: (count: number) => string;
  allCaughtUp?: string;
  fallbackQuote?: { text: string; author: string };
}

export interface DashboardProps {
  stats?: ReadingStats;
  calendarDays?: CalendarDay[];
  /** Mangás com atividade dos últimos 7 dias para o tracker */
  weeklyActivity?: Habit[];
  /** Mangás com capítulos não lidos (atalhos rápidos) */
  unreadMangas?: UnreadManga[];
  /** Último capítulo lido — define o banner e a citação */
  lastRead?: LastRead;
  /** Estado atual da sincronização */
  syncState?: SyncState;
  labels?: DashboardLabels;
  /** Abre a tela de busca do MangaDex */
  onSearch?: () => void;
  /** Navega para a tela de detalhes/leitor do mangá */
  onMangaClick?: (manga: UnreadManga) => void;
  /** Dispara sincronização manual */
  onSync?: () => void;
  /** Dispara clique num dia do calendário */
  onDateClick?: (date: string) => void;
  className?: string;
}

// --- Helpers ---

type ResolvedDashboardLabels = Required<Omit<DashboardLabels, "fallbackQuote">> & {
  fallbackQuote?: { text: string; author: string };
};

/** Formata o tempo desde a última sync de forma legível */
function formatSyncTime(date: Date | undefined, labels: ResolvedDashboardLabels): string {
  if (!date) return labels.neverSynced;
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return labels.justNow;
  if (diffMin < 60) return labels.minutesAgo(diffMin);
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return labels.hoursAgo(diffH);
  return labels.daysAgo(Math.floor(diffH / 24));
}

/**
 * Retorna uma frase de mangá/leitura baseada no dia do ano,
 * de modo que muda diariamente mas é determinística.
 */
const MANGA_QUOTES = [
  { text: "Mesmo na escuridão mais profunda, uma faísca de vontade pode iluminar o caminho.", author: "Berserk" },
  { text: "A força não vem de vencer. Vem de superar as dificuldades.", author: "Naruto" },
  { text: "Pessoas que não podem jogar fora algo valioso nunca conseguem mudar nada.", author: "Fullmetal Alchemist" },
  { text: "O mundo não é perfeito, mas está aqui para nós — tente descobrir o que é bom.", author: "Fullmetal Alchemist" },
  { text: "Independente de quão sombrio o mundo possa ser, o sol ainda nasce amanhã.", author: "Vinland Saga" },
  { text: "Ninguém nasce com força. Você cresce ao superar a dor.", author: "One Piece" },
  { text: "A única batalha que você perde é aquela que abandona.", author: "Vagabond" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000
  );
  return MANGA_QUOTES[dayOfYear % MANGA_QUOTES.length];
}

// --- Component ---

export const Dashboard: React.FC<DashboardProps> = ({
  stats = { chaptersRead: 0, chaptersTotal: 0, mangasFollowing: 0, streak: 0 },
  calendarDays = [],
  weeklyActivity = [],
  unreadMangas = [],
  lastRead,
  syncState = { status: "idle" },
  labels = {},
  onSearch,
  onMangaClick,
  onSync,
  onDateClick,
  className,
}) => {
  const l = {
    overviewTitle: "Visão geral",
    trackerTitle: "Atividade semanal",
    newChaptersTitle: "Novos capítulos",
    calendarTitle: "Calendário",
    btnSearch: "Buscar mangá",
    statChapters: "Na biblioteca",
    statRead: "Lidos",
    statFollowing: "Acompanhando",
    statStreak: "Sequência",
    statDays: "dias seguidos",
    chaptersUnit: "capítulos",
    mangasUnit: "mangás",
    syncing: "Sincronizando...",
    syncError: "Erro na sync",
    neverSynced: "nunca sincronizado",
    justNow: "agora mesmo",
    minutesAgo: (count: number) => `há ${count} min`,
    hoursAgo: (count: number) => `há ${count}h`,
    daysAgo: (count: number) => `há ${count} dias`,
    syncFailure: "Falha na sincronização",
    chapterContinue: (chapter: string | number) => `Capítulo ${chapter} · continuar leitura`,
    noWeeklyActivity: "Nenhuma atividade registrada nos últimos 7 dias.",
    unreadCount: (count: number) => `${count} não lidos`,
    allCaughtUp: "Tudo em dia. Nenhum capítulo novo no momento.",
    ...labels,
  } satisfies ResolvedDashboardLabels;

  // Frase do dia ou contexto do último mangá lido
  const quote = useMemo(() => {
    if (lastRead) {
      return {
        text: lastRead.mangaTitle,
        author: l.chapterContinue(lastRead.chapterNumber),
      };
    }
    if (l.fallbackQuote) return l.fallbackQuote;
    return getDailyQuote();
  }, [lastRead, l]);

  // Streak destacado se ≥ 7 dias
  const streakHighlighted = stats.streak >= 7;

  // Texto de status da sync
  const syncLabel = useMemo(() => {
    if (syncState.status === "syncing") return l.syncing;
    if (syncState.status === "error") return l.syncError;
    return formatSyncTime(syncState.lastSyncedAt, l);
  }, [syncState, l]);

  // URL do banner: capa do último mangá ou gradiente fallback
  const bannerStyle: React.CSSProperties = lastRead?.coverUrl
    ? {
        backgroundImage: `url(${lastRead.coverUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }
    : {};

  return (
    <div
      className={cn(
        "w-full max-w-[1600px] min-h-full flex gap-1 justify-center",
        "transition-all duration-500 ease-out py-4 px-2 overflow-y-auto",
        className
      )}
    >
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
        <div className="relative shadow-paper-float rounded-[2rem] overflow-hidden bg-transparent border-none">
          {/* ── Conteúdo principal ── */}
          <div className="bg-card graph-paper relative z-20 px-8 py-10 md:px-12 md:py-12 rounded-[2rem]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* ── Coluna esquerda ── */}
              <div className="lg:col-span-8 flex flex-col gap-10">

                {/* Stats */}
                <div>
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <BookOpenIcon className="w-5 h-5" />
                      {l.overviewTitle}
                    </h2>
                    {/* Indicador de erro de sync */}
                    {syncState.status === "error" && (
                      <span className="text-xs font-mono text-destructive bg-destructive/10 px-2 py-1 rounded">
                        {l.syncFailure}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* 4 cards com dados de leitura */}
                    <StatsCard
                      title={l.statChapters}
                      value={stats.chaptersTotal}
                      subtext={l.chaptersUnit}
                    />
                    <StatsCard
                      title={l.statRead}
                      value={stats.chaptersRead}
                      highlighted={stats.chaptersRead > 0}
                    />
                    <StatsCard
                      title={l.statFollowing}
                      value={stats.mangasFollowing}
                      subtext={l.mangasUnit}
                    />
                    {/*
                     * Streak destacado visualmente se ≥ 7 dias.
                     * O subtext muda para reforçar o marco.
                     */}
                    <StatsCard
                      title={l.statStreak}
                      value={stats.streak}
                      subtext={
                        streakHighlighted
                          ? `${l.statDays} 🔥`
                          : l.statDays
                      }
                      highlighted={streakHighlighted}
                    />
                  </div>
                </div>

                {/* Tracker de atividade semanal */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <FlameIcon className="w-5 h-5" />
                    {l.trackerTitle}
                  </h2>
                  {weeklyActivity.length > 0 ? (
                    <HandDrawnTracker habits={weeklyActivity} />
                  ) : (
                    <p className="text-sm text-muted-foreground font-serif italic py-4">
                      {l.noWeeklyActivity}
                    </p>
                  )}
                </div>

                {/* Novos capítulos (antes: templates/atalhos) */}
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                    <BellIcon className="w-5 h-5" />
                    {l.newChaptersTitle}
                    {unreadMangas.length > 0 && (
                      <span className="ml-auto text-xs font-mono font-normal normal-case tracking-normal bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                        {l.unreadCount(unreadMangas.reduce((acc, m) => acc + m.unreadCount, 0))}
                      </span>
                    )}
                  </h2>

                  {unreadMangas.length === 0 ? (
                    <p className="text-sm text-muted-foreground font-serif italic py-2">
                      {l.allCaughtUp}
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {unreadMangas.map((manga) => (
                        <button
                          key={manga.id}
                          onClick={() => onMangaClick?.(manga)}
                          className="w-full flex items-center gap-3 p-2 rounded-lg border-b border-border/30 hover:bg-secondary/30 transition-colors text-left group"
                        >
                          {/* Miniatura da capa ou dot de cor */}
                          {manga.coverUrl ? (
                            <img
                              src={manga.coverUrl}
                              alt={manga.title}
                              className="w-8 h-12 object-cover rounded object-top flex-shrink-0"
                            />
                          ) : (
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full flex-shrink-0",
                                manga.accentColor
                              )}
                            />
                          )}

                          <span className="flex-1 text-sm text-muted-foreground font-serif italic group-hover:text-foreground transition-colors truncate">
                            {manga.title}
                          </span>

                          {/* Badge com contagem de capítulos não lidos */}
                          <span className="flex-shrink-0 text-xs font-mono bg-destructive/10 text-destructive px-2 py-0.5 rounded-full">
                            +{manga.unreadCount}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Coluna direita ── */}
              <div className="lg:col-span-4 relative">
                <div className="hidden lg:block absolute left-[-24px] top-0 bottom-0 w-px border-l border-dashed border-border" />

                <div className="bg-secondary/30 dark:bg-secondary/20 p-6 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2 mb-6 text-primary">
                    <CalendarIcon className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {l.calendarTitle}
                    </span>
                  </div>
                  {/*
                   * O MiniCalendar recebe dias com hasEntry=true
                   * para os dias onde houve pelo menos uma leitura.
                   * Funciona como heatmap mensal de atividade.
                   */}
                  <MiniCalendar days={calendarDays} onDayClick={(day) => day.date && onDateClick?.(day.date)} />
                </div>

                {/* CTA — abre a busca do MangaDex */}
                <button
                  onClick={onSearch}
                  className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-lg hover:opacity-90 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{l.btnSearch}</span>
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                    +
                  </div>
                </button>

                {/* Resumo de sync abaixo do CTA */}
                <div className="mt-4 flex items-center justify-center gap-1.5">
                  <CheckCircleIcon
                    className={cn(
                      "w-3.5 h-3.5",
                      syncState.status === "error"
                        ? "text-destructive"
                        : "text-muted-foreground"
                    )}
                  />
                  <span className="text-xs text-muted-foreground font-mono">
                    {syncLabel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
