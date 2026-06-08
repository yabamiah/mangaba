import { Button, Input } from "@pequiplan/ui";
import { Key } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "./Toast";
import { api } from "../lib/api";

export function ApiTokenDialog({ onSaved }: { onSaved: () => void }) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!token.trim()) return;
    setSaving(true);
    try {
      await api.updateSettings({ api_token: token.trim() } as any);
      toast(t("common.saved"), "success");
      onSaved();
    } catch (err) {
      toast(String(err), "error");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Key className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">{t("api_token.title")}</h2>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          {t("api_token.description")}
        </p>
        <div className="mb-6 space-y-4">
          <Input
            autoFocus
            onChange={(e) => setToken(e.target.value)}
            placeholder={t("api_token.placeholder")}
            type="password"
            value={token}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void save();
              }
            }}
          />
        </div>
        <div className="flex justify-end">
          <Button disabled={!token.trim() || saving} onClick={save}>
            {saving ? t("common.saving") : t("api_token.save")}
          </Button>
        </div>
      </div>
    </div>
  );
}
