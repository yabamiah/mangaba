import { Card, CardContent, Button } from "@pequiplan/ui";
import { AlertCircle, Inbox } from "lucide-react";

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  action?: EmptyStateAction;
  variant?: "empty" | "error";
}

export function EmptyState({ title, description, icon, action, variant = "empty" }: EmptyStateProps) {
  const DefaultIcon = variant === "error" ? AlertCircle : Inbox;
  const Icon = icon ?? DefaultIcon;

  return (
    <Card className={`card-paper border-dashed ${variant === "error" ? "border-destructive/30" : ""}`}>
      <CardContent className="flex flex-col items-center p-8 text-center">
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
            variant === "error" ? "bg-destructive/10" : "bg-secondary"
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              variant === "error" ? "text-destructive" : "text-muted-foreground"
            }`}
          />
        </div>
        <p className="font-handwritten text-xl font-normal leading-none tracking-tight">{title}</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
        {action && (
          <Button className="mt-4" onClick={action.onClick} size="sm" variant="outline">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
