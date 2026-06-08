import { createContext, useCallback, useContext, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { cn } from "@pequiplan/ui";

type ToastVariant = "success" | "error" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  exiting?: boolean;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 0;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return context;
}

const icons: Record<ToastVariant, React.ComponentType<{ className?: string }>> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-success/30 bg-success/10 text-success",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-info/30 bg-info/10 text-info",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant = "success") => {
    const id = nextId++;
    setToasts((current) => [...current, { id, message, variant }]);
    window.setTimeout(() => {
      setToasts((current) =>
        current.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      window.setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, 200);
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((current) =>
      current.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex flex-col items-center gap-2 px-4 md:bottom-6"
      >
        {toasts.map((t) => {
          const Icon = icons[t.variant];
          return (
            <div
              className={cn(
                "pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 shadow-paper-md backdrop-blur-xl",
                "bg-card",
                variantStyles[t.variant],
                t.exiting ? "animate-toast-out" : "animate-toast-in"
              )}
              key={t.id}
              role="status"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <p className="text-sm font-medium text-foreground">{t.message}</p>
              <button
                aria-label="Fechar notificação"
                className="ml-2 shrink-0 rounded-md p-1 text-muted-foreground hover:text-foreground focus-ring"
                onClick={() => dismiss(t.id)}
                type="button"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
