import { BookOpen } from "lucide-react";
import { useState } from "react";
import { cn } from "@pequiplan/ui";

interface MangaCoverProps {
  title: string;
  src?: string;
  className?: string;
}

export function MangaCover({ title, src, className = "" }: MangaCoverProps) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (src && !failed) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        {!loaded && <div aria-hidden="true" className="skeleton absolute inset-0 rounded-md" />}
        <img
          alt={`Capa de ${title}`}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0"
          )}
          loading="lazy"
          onError={() => setFailed(true)}
          onLoad={() => setLoaded(true)}
          src={src}
        />
      </div>
    );
  }

  return (
    <div className={`manga-cover flex h-full w-full flex-col justify-between p-4 ${className}`}>
      <BookOpen className="h-6 w-6 text-primary" />
      <div>
        <p className="font-rounded text-sm font-semibold leading-tight text-foreground">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">capa indisponível</p>
      </div>
    </div>
  );
}
