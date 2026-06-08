import { Button, Card, CardContent } from "@pequiplan/ui";
import { BookMarked, ChevronRight } from "lucide-react";
import type { MangaResult } from "../lib/bindings";
import { MangaCover } from "./MangaCover";

interface MangaListItemProps {
  manga: MangaResult;
  onOpen: (mangaId: string) => void;
  onFollow?: (mangaId: string) => void;
}

export function MangaListItem({ manga, onOpen, onFollow }: MangaListItemProps) {
  return (
    <Card
      className="card-paper cursor-pointer overflow-hidden p-0 transition-shadow duration-200 hover:shadow-paper-md"
      onClick={() => onOpen(manga.id)}
      role="article"
    >
      <CardContent className="grid gap-4 p-3 sm:grid-cols-[92px_1fr_auto] sm:items-center">
        <div className="h-32 overflow-hidden rounded-md border border-border sm:h-32">
          <MangaCover src={manga.cover_url} title={manga.title} />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-rounded text-lg font-semibold leading-tight">{manga.title}</h3>
            <span className="rounded-sm border border-border bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
              {manga.status}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{manga.description}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Autor: {manga.author ?? "Autor desconhecido"} · Idioma original: {manga.original_language ?? "n/d"}
          </p>
        </div>
        <div className="flex gap-2 sm:flex-col" onClick={(e) => e.stopPropagation()}>
          {onFollow && (
            <Button
              aria-label={manga.followed ? `Deixar de acompanhar ${manga.title}` : `Acompanhar ${manga.title}`}
              onClick={() => onFollow(manga.id)}
              size="sm"
              variant={manga.followed ? "secondary" : "outline"}
            >
              <BookMarked className="h-4 w-4" />
              {manga.followed ? "Acompanhando" : "Acompanhar"}
            </Button>
          )}
          <Button
            aria-label={`Abrir ${manga.title}`}
            onClick={() => onOpen(manga.id)}
            size="sm"
          >
            Abrir
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
