import { Button, ColorPicker, IconPicker, Switch, Input } from "@pequiplan/ui";
import { Bell, RefreshCw, Search, Heart, Bookmark, Star, Flame, Clock, Trophy, Sword, Ghost, GripVertical, Edit, Trash, Plus, FolderPlus, Settings2, LayoutGrid, Copy, EyeOff, Layers, MoreVertical, Check, ArrowLeft } from "lucide-react";
import { useAsync } from "../hooks/useAsync";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api";
import { EmptyState } from "../components/EmptyState";
import { MangaCover } from "../components/MangaCover";
import { SkeletonCard } from "../components/Skeleton";
import { useToast } from "../components/Toast";
import type { Category, FollowedManga, AppSettings } from "../lib/bindings";

const ICONS_MAP: Record<string, React.ReactNode> = {
  "heart": <Heart />,
  "bookmark": <Bookmark />,
  "star": <Star />,
  "flame": <Flame />,
  "clock": <Clock />,
  "trophy": <Trophy />,
  "sword": <Sword />,
  "ghost": <Ghost />
};

interface LibraryPageProps {
  onOpenManga: (mangaId: string) => void;
  onSearch: () => void;
}

export function LibraryPage({ onOpenManga, onSearch }: LibraryPageProps) {
  const { data, error, loading, reload } = useAsync(async () => {
    const [followed, categories, settings] = await Promise.all([
      api.listFollowedManga(),
      api.getCategories(),
      api.getSettings()
    ]);
    return { followed, categories, settings };
  }, []);

  const { toast } = useToast();
  const { t } = useTranslation();
  
  const followed = data?.followed ?? [];
  const categories = data?.categories ?? [];
  const settings = data?.settings;

  const hideEmptyUncategorized = settings?.hide_empty_uncategorized === true;

  const [activeTab, setActiveTab] = useState<"library" | "manage">("library");
  const [showNewCat, setShowNewCat] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  async function sync() {
    try {
      await api.syncAllFollowed();
      await reload();
      toast(t("library.sync_success"), "success");
    } catch {
      toast(t("library.sync_error"), "error");
    }
  }

  async function toggleHideEmptyUncategorized(checked: boolean) {
    if (!settings) return;
    try {
      await api.updateSettings({ hide_empty_uncategorized: checked } as Partial<AppSettings>);
      await reload();
    } catch (e) {
      toast(t("library.config_save_error"), "error");
    }
  }

  return (
    <section className="mangaba-screen">
      {loading && (
        <div className="mangaba-scroll-area">
          <div className="grid gap-3 md:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      )}

      {error && (
        <EmptyState
          action={{ label: t("common.retry"), onClick: reload }}
          description={error}
          title={t("library.error_title")}
          variant="error"
        />
      )}

      {!loading && !error && activeTab === "library" && (
        <LibraryView 
          followed={followed} 
          categories={categories} 
          hideEmptyUncategorized={hideEmptyUncategorized}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          onOpenManga={onOpenManga}
          onSearch={onSearch}
          sync={sync}
          goToManage={() => setActiveTab("manage")}
          goToNewCat={() => setShowNewCat(true)}
          reload={reload}
        />
      )}

      {!loading && !error && activeTab === "manage" && (
        <ManageCategoriesView 
          categories={categories} 
          hideEmptyUncategorized={hideEmptyUncategorized}
          onToggleHideEmptyUncategorized={toggleHideEmptyUncategorized}
          onBack={() => setActiveTab("library")}
          onNew={() => setShowNewCat(true)}
          reload={reload}
        />
      )}

      {showNewCat && (
        <NewCategoryView 
          onCreated={() => {
            reload();
            setShowNewCat(false);
          }} 
          onCancel={() => setShowNewCat(false)}
          nextSortOrder={categories.length}
        />
      )}
    </section>
  );
}

function LibraryView({ followed, categories, hideEmptyUncategorized, activeFilter, setActiveFilter, onOpenManga, onSearch, sync, goToManage, goToNewCat, reload }: {
  followed: FollowedManga[];
  categories: Category[];
  hideEmptyUncategorized: boolean;
  activeFilter: string;
  setActiveFilter: (f: string) => void;
  onOpenManga: (id: string) => void;
  onSearch: () => void;
  sync: () => void;
  goToManage: () => void;
  goToNewCat: () => void;
  reload: () => void;
}) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();

  const unreadCount = followed.reduce((sum: number, item: FollowedManga) => sum + item.unread_count, 0);

  const uncategorizedMangas = followed.filter((m: FollowedManga) => !m.category_ids || m.category_ids.length === 0);

  async function handleDrop(e: React.DragEvent, categoryId: string | null) {
    e.preventDefault();
    e.stopPropagation();

    const mangaId = e.dataTransfer.getData("text/plain");
    if (!mangaId) {
      console.warn('No mangaId found in drag data');
      return;
    }

    console.log('Dropping manga:', mangaId, 'into category:', categoryId);

    try {
      await api.setMangaCategories(mangaId, categoryId ? [categoryId] : []);
      reload();
    } catch (error) {
      console.error('Error moving manga:', error);
      toast(t("library.manga_move_error"), "error");
    }
  }

  return (
    <div className="border border-border-light rounded-xl overflow-hidden flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b border-border-light">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-foreground">{t("library.title")}</h2>
          <p className="text-xs text-muted-foreground">{t("dashboard.mangas", { count: followed.length })} · {t("library.unread_count", { count: unreadCount })}</p>
        </div>
        <Button size="sm" variant="outline" onClick={goToManage}>
          <Settings2 className="w-4 h-4 mr-2" /> {t("library.categories")}
        </Button>
        <Button size="sm" variant="outline" onClick={sync}>
          <RefreshCw className="w-4 h-4 mr-2" /> {t("library.sync")}
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {followed.length === 0 ? (
          <EmptyState
            action={{ label: t("library.go_to_search"), onClick: onSearch }}
            description={t("library.empty_description")}
            icon={Search}
            title={t("library.empty_title")}
          />
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                type="button" 
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs transition-colors ${activeFilter === "all" ? "bg-secondary text-foreground border-primary" : "border-border-light text-muted-foreground hover:bg-secondary"}`}
                onClick={() => setActiveFilter("all")}
              >
                <Layers className="w-3.5 h-3.5" /> {t("library.all")}
              </button>
              {categories.map((cat: Category) => (
                <button 
                  key={cat.id}
                  type="button" 
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs transition-colors ${activeFilter === cat.id ? "bg-secondary text-foreground border-primary" : "border-border-light text-muted-foreground hover:bg-secondary"}`}
                  onClick={() => setActiveFilter(cat.id)}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                  {cat.name}
                </button>
              ))}
              <button 
                type="button" 
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:bg-secondary transition-colors"
                onClick={goToNewCat}
              >
                <Plus className="w-3.5 h-3.5" /> {t("library.new")}
              </button>
            </div>

            {categories.map((cat: Category) => {
              if (activeFilter !== "all" && activeFilter !== cat.id) return null;
              
              const catMangas = followed.filter((m: FollowedManga) => m.category_ids?.includes(cat.id));
              
              return (
                <div 
                  key={cat.id} 
                  className="mb-6 rounded-lg border border-transparent hover:border-border-light p-2 -mx-2 transition-colors"
                  onDragOver={(e) => { 
                    e.preventDefault(); 
                    e.dataTransfer.dropEffect = "move";
                    e.currentTarget.classList.add('bg-secondary/50');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('bg-secondary/50');
                  }}
                  onDrop={(e) => {
                    e.currentTarget.classList.remove('bg-secondary/50');
                    handleDrop(e, cat.id);
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
                    <span className="text-sm font-medium text-foreground flex-1">{cat.name}</span>
                    <span className="text-xs text-muted-foreground">{catMangas.length} {t("dashboard.mangas")}</span>
                    <button className="text-muted-foreground hover:bg-secondary p-1 rounded-md" onClick={goToManage}><MoreVertical className="w-4 h-4" /></button>
                  </div>
                  
                  {catMangas.length > 0 ? (
                    <MangaGrid mangas={catMangas} onOpenManga={onOpenManga} />
                  ) : (
                    <div 
                      className="border border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-secondary transition-colors"
                      onClick={goToSearchOrOpenCat}
                    >
                      <Plus className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">{t("library.add_manga")}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {(activeFilter === "all" || activeFilter === "uncategorized") && (!hideEmptyUncategorized || uncategorizedMangas.length > 0) && (
              <div 
                className="mb-6 rounded-lg border border-transparent hover:border-border-light p-2 -mx-2 transition-colors"
                onDragOver={(e) => { 
                  e.preventDefault(); 
                  e.dataTransfer.dropEffect = "move";
                  e.currentTarget.classList.add('bg-secondary/50');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-secondary/50');
                }}
                onDrop={(e) => {
                  e.currentTarget.classList.remove('bg-secondary/50');
                  handleDrop(e, null);
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-border"></div>
                  <span className="text-sm font-medium text-muted-foreground flex-1">{t("library.uncategorized")}</span>
                  <span className="text-xs text-muted-foreground">{t("dashboard.mangas", { count: uncategorizedMangas.length })}</span>
                </div>
                {uncategorizedMangas.length > 0 ? (
                  <MangaGrid mangas={uncategorizedMangas} onOpenManga={onOpenManga} />
                ) : (
                  <p className="text-xs text-muted-foreground italic">{t("library.uncategorized_empty")}</p>
                )}
              </div>
            )}

            <button 
              className="w-full border border-dashed border-border/80 rounded-xl p-4 flex items-center gap-2 cursor-pointer text-sm text-muted-foreground hover:border-primary hover:text-foreground hover:bg-secondary transition-colors mb-4"
              onClick={goToNewCat}
            >
              <FolderPlus className="w-5 h-5" />
              {t("library.create_new_category")}
            </button>

            <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg text-xs text-muted-foreground mt-4">
              <Bell className="w-4 h-4 shrink-0" />
              <span>{t("library.last_sync", { date: followed[0]?.last_checked_at ? new Date(followed[0].last_checked_at).toLocaleString(i18n.language) : t("library.no_sync") })}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );

  function goToSearchOrOpenCat() {
    onSearch();
  }
}

function MangaGrid({ mangas, onOpenManga }: { mangas: FollowedManga[], onOpenManga: (id: string) => void }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2.5">
      {mangas.map((item) => (
        <div
          key={item.manga.id}
          draggable
          onDragStart={(e) => {
            console.log('Drag start:', item.manga.id);
            e.dataTransfer.setData("text/plain", item.manga.id);
            e.dataTransfer.effectAllowed = "move";
            e.currentTarget.classList.add('opacity-50');
          }}
          onDragEnd={(e) => {
            e.currentTarget.classList.remove('opacity-50');
          }}
          onClick={() => onOpenManga(item.manga.id)}
          role="button"
          tabIndex={0}
          className="cursor-grab active:cursor-grabbing rounded-md overflow-hidden border border-border-light bg-background hover:border-border transition-colors text-left flex flex-col"
        >
          <span className="w-full aspect-[2/3] bg-secondary flex items-center justify-center relative">
            <MangaCover src={item.manga.cover_url} title={item.manga.title} />
            {item.unread_count > 0 && (
              <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-[9px] font-semibold px-1.5 py-0.5 rounded-full min-w-[16px] text-center">
                {item.unread_count}
              </span>
            )}
          </span>
          <span className="p-1.5 flex-1 flex flex-col">
            <span className="text-[11px] font-medium text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
              {item.manga.title}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {item.preferred_language}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function NewCategoryView({ onCreated, onCancel, nextSortOrder }: { onCreated: () => void; onCancel: () => void; nextSortOrder: number }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#e55a2b");
  const [icon, setIcon] = useState("heart");
  
  const colors = ["#e55a2b", "#2e7d9e", "#7b5ea7", "#2d7a4f", "#c08a2a", "#8a8a8a", "#c2445e"];
  const icons = [
    { id: "heart", icon: <Heart className="w-4 h-4" /> },
    { id: "bookmark", icon: <Bookmark className="w-4 h-4" /> },
    { id: "star", icon: <Star className="w-4 h-4" /> },
    { id: "flame", icon: <Flame className="w-4 h-4" /> },
    { id: "clock", icon: <Clock className="w-4 h-4" /> },
    { id: "trophy", icon: <Trophy className="w-4 h-4" /> },
    { id: "sword", icon: <Sword className="w-4 h-4" /> },
    { id: "ghost", icon: <Ghost className="w-4 h-4" /> }
  ];

  const { toast } = useToast();
  const { t } = useTranslation();

  async function handleCreate() {
    if (!name.trim()) return;
    try {
      const id = crypto.randomUUID();
      await api.createCategory(id, name.trim(), color, icon, nextSortOrder);
      toast(t("library.category_created"), "success");
      onCreated();
    } catch (e) {
      toast(t("library.category_create_error"), "error");
    }
  }

  function fillTemplate(tName: string, tColor: string, tIcon: string) {
    setName(tName);
    setColor(tColor);
    setIcon(tIcon);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl border border-border p-5 w-full max-w-[320px] shadow-xl">
        <h2 className="text-[15px] font-medium text-foreground mb-1">{t("library.new_category")}</h2>
        <p className="text-xs text-muted-foreground mb-4">{t("library.new_category_desc")}</p>

        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-4 mb-2">{t("library.start_template")}</div>
        <div className="flex flex-col gap-1.5 mb-4">
          <TemplateRow name={t("library.favorites", "Favoritos")} color="#e55a2b" onClick={() => fillTemplate(t("library.favorites", "Favoritos"), "#e55a2b", "heart")} />
          <TemplateRow name={t("library.plan_to_read", "Próximos a ler")} color="#2e7d9e" onClick={() => fillTemplate(t("library.plan_to_read", "Próximos a ler"), "#2e7d9e", "bookmark")} />
          <TemplateRow name={t("library.dropped", "Dropados")} color="#888888" onClick={() => fillTemplate(t("library.dropped", "Dropados"), "#888888", "x")} />
        </div>

        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mt-4 mb-2">{t("library.or_customize")}</div>
        
        <label className="block text-xs font-medium text-muted-foreground mb-1">{t("library.category_name")}</label>
        <Input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder={t("library.category_placeholder", "ex: Ação, Concluídos, Releituras...")} 
          className="mb-3 h-8"
        />

        <label className="block text-xs font-medium text-muted-foreground mb-1">{t("library.color")}</label>
        <ColorPicker colors={colors} selectedColor={color} onSelect={setColor} className="mb-3" />

        <label className="block text-xs font-medium text-muted-foreground mb-1">{t("library.icon")}</label>
        <IconPicker icons={icons} selectedIconId={icon} onSelect={setIcon} className="mb-3" />

        <div className="p-2.5 bg-secondary rounded-md flex items-center gap-2 mb-1 border border-border-light">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
          <div className="text-muted-foreground">{ICONS_MAP[icon] || <Heart className="w-4 h-4" />}</div>
          <span className="text-[13px] font-medium text-foreground">{name || t("library.category_name")}</span>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-border-light">
          <Button variant="outline" size="sm" onClick={onCancel}>{t("common.back")}</Button>
          <Button variant="primary" size="sm" onClick={handleCreate} disabled={!name.trim()}>
            <Check className="w-4 h-4 mr-1.5" /> {t("library.create_new_category")}
          </Button>
        </div>
      </div>
    </div>
  );
}

function TemplateRow({ name, color, onClick }: { name: string; color: string; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 p-2 rounded-md border border-border-light cursor-pointer hover:bg-secondary hover:border-border transition-colors" onClick={onClick}>
      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
      <span className="text-xs text-foreground flex-1">{name}</span>
      <span className="text-[10px] text-muted-foreground">{t("library.template")}</span>
    </div>
  );
}

function ManageCategoriesView({ categories, hideEmptyUncategorized, onToggleHideEmptyUncategorized, onBack, onNew, reload }: { categories: Category[]; hideEmptyUncategorized: boolean; onToggleHideEmptyUncategorized: (c: boolean) => void; onBack: () => void; onNew: () => void; reload: () => void }) {
  const { toast } = useToast();
  const { t } = useTranslation();

  async function handleDelete(id: string) {
    try {
      await api.deleteCategory(id);
      toast(t("library.category_deleted"), "success");
      reload();
    } catch {
      toast(t("library.category_delete_error"), "error");
    }
  }

  return (
    <div className="border border-border-light rounded-xl overflow-hidden flex flex-col h-full">
      <div className="flex items-center p-3 border-b border-border-light">
        <button className="p-1.5 text-muted-foreground hover:bg-secondary rounded-md mr-2" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-medium text-foreground flex-1">{t("library.manage_categories")}</h2>
        <Button variant="primary" size="sm" onClick={onNew}>
          <Plus className="w-4 h-4 mr-1.5" /> {t("library.new")}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          {t("library.manage_categories_hint")}
        </p>

        <div className="flex flex-col mb-6">
          {categories.map((cat: Category) => (
            <div key={cat.id} className="flex items-center gap-2.5 py-2.5 border-b border-border-light last:border-0 group">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab opacity-50 group-hover:opacity-100" />
              <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></div>
              <div className="text-muted-foreground opacity-70">{ICONS_MAP[cat.icon] || <Heart className="w-4 h-4" />}</div>
              <span className="text-[13px] text-foreground flex-1">{cat.name}</span>
              <button className="p-1.5 text-muted-foreground hover:bg-secondary rounded-md" title={t("common.edit", "Editar")}>
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md" title={t("common.delete", "Excluir")} onClick={() => handleDelete(cat.id)}>
                <Trash className="w-4 h-4" />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground italic text-center py-4">{t("library.no_categories")}</p>
          )}
        </div>

        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">{t("library.display_rules")}</div>
        <div className="flex flex-col gap-1.5">
          <RuleRow icon={<LayoutGrid className="w-4 h-4" />} text={t("library.rule_uncategorized")} />
          <RuleRow icon={<Copy className="w-4 h-4" />} text={t("library.rule_multiple")} />
          <div className="flex items-center gap-2 p-2.5 rounded-md border border-border-light text-xs">
            <EyeOff className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-muted-foreground">{t("library.hide_empty_uncategorized")}</span>
            <Switch checked={hideEmptyUncategorized} onCheckedChange={onToggleHideEmptyUncategorized} />
          </div>
        </div>
      </div>
    </div>
  );
}

function RuleRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-md border border-border-light text-xs text-muted-foreground">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="flex-1">{text}</span>
      <span className="text-[10px] opacity-70">{t("library.always_active")}</span>
    </div>
  );
}
