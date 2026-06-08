import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  RadioButton,
  Select,
  SelectionButton,
  ToggleButton,
} from "@pequiplan/ui";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../components/Toast";
import { api } from "../lib/api";
import type { AppSettings, ReaderMode, ThemeMode } from "../lib/bindings";

const defaultSettings: AppSettings = {
  default_language: "pt-br",
  update_interval_minutes: 60,
  content_ratings: ["safe", "suggestive"],
  user_agent: "Mangaba/0.1.0 (+local desktop app)",
  theme: "system",
  reader_mode: "scroll",
};

const uiLanguageOptions = [
  { value: "pt-br", label: "Português (Brasil)" },
  { value: "en", label: "English" },
] as const;

const languageOptions = [
  { value: "pt-br", label: "Brazilian Portuguese" },
  { value: "en", label: "English" },
  { value: "zh", label: "Simplified Chinese" },
  { value: "zh-hk", label: "Traditional Chinese" },
  { value: "es", label: "Castilian Spanish" },
  { value: "es-la", label: "Latin American Spanish" },
  { value: "ja-ro", label: "Romanized Japanese" },
  { value: "ko-ro", label: "Romanized Korean" },
  { value: "zh-ro", label: "Romanized Chinese" },
] as const;

const contentRatings = ["safe", "suggestive", "erotica", "pornographic"] as const;

function applyTheme(theme: ThemeMode) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else if (theme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", prefersDark);
  }
}

export function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const adultRatingsEnabled =
    settings.content_ratings.includes("erotica") ||
    settings.content_ratings.includes("pornographic");

  useEffect(() => {
    void api.getSettings().then(setSettings).catch(() => {});
  }, []);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (settings.update_interval_minutes < 15) {
      nextErrors.interval = t("settings.validation_interval");
    }
    if (!settings.user_agent.trim()) {
      nextErrors.user_agent = t("settings.validation_user_agent");
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function save() {
    if (!validate()) {
      toast(t("settings.validation_fix_errors"), "warning");
      return;
    }
    try {
      await api.updateSettings(settings);
      toast(t("settings.save_success"), "success");
    } catch {
      toast(t("settings.save_error"), "error");
    }
  }

  async function clearCache() {
    try {
      await api.clearCache(30);
      toast(t("settings.cache_success"), "success");
    } catch {
      toast(t("settings.cache_error"), "error");
    }
  }

  async function changeUiLanguage(language: string) {
    const normalized = language.toLowerCase();
    localStorage.setItem("mangaba.uiLanguage", normalized);
    await i18n.changeLanguage(normalized);
  }

  const themeOptions = [
    { value: "system", label: t("settings.theme_system") },
    { value: "light", label: t("settings.theme_light") },
    { value: "dark", label: t("settings.theme_dark") },
  ] satisfies Array<{ value: ThemeMode; label: string }>;

  const readerModeOptions = [
    { value: "scroll", label: t("settings.reader_scroll") },
    { value: "single", label: t("settings.reader_single") },
    { value: "rtl", label: t("settings.reader_rtl") },
  ] satisfies Array<{ value: ReaderMode; label: string }>;

  function setAdultRatings(enabled: boolean) {
    setSettings((current) => {
      const baseRatings = current.content_ratings.filter((rating) => rating !== "erotica" && rating !== "pornographic");
      return {
        ...current,
        content_ratings: enabled ? [...baseRatings, "erotica", "pornographic"] : baseRatings,
      };
    });
  }

  return (
    <section className="mangaba-screen">
      <div className="mangaba-topline">
        <div>
          <h1 className="mangaba-screen-title">{t("settings.title")}</h1>
          <p className="mangaba-screen-subtitle">{t("settings.subtitle")}</p>
        </div>
        <div className="mangaba-toolbar-actions">
          <Button onClick={save} size="sm">
            <Save className="h-4 w-4" />
            {t("settings.save")}
          </Button>
          <Button onClick={clearCache} size="sm" variant="outline">
            <Trash2 className="h-4 w-4" />
            {t("settings.clear_cache")}
          </Button>
        </div>
      </div>

      <div className="mangaba-scroll-area">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-5">
        <Card className="card-paper p-0">
          <CardHeader>
            <CardTitle className="font-rounded">{t("settings.reading_sync")}</CardTitle>
            <CardDescription>{t("settings.reading_sync_description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-medium">{t("settings.interface_language")}</p>
              <div className="mangaba-toolbar-actions">
                {uiLanguageOptions.map((option) => {
                  const active = (i18n.resolvedLanguage ?? i18n.language) === option.value;
                  return (
                    <Button
                      key={option.value}
                      onClick={() => void changeUiLanguage(option.value)}
                      size="sm"
                      type="button"
                      variant={active ? "secondary" : "outline"}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
            <Select
              label={t("settings.default_language")}
              options={languageOptions as unknown as Array<{ value: string; label: string }>}
              value={settings.default_language}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSettings((current) => ({
                  ...current,
                  default_language: e.target.value as AppSettings["default_language"],
                }))
              }
            />
            <label className="space-y-2 text-sm font-medium">
              {t("settings.interval_label")}
              <Input
                min={15}
                onChange={(event) => {
                  setSettings((current) => ({ ...current, update_interval_minutes: Number(event.target.value) }));
                  setErrors((e) => {
                    delete e.interval;
                    return { ...e };
                  });
                }}
                type="number"
                value={settings.update_interval_minutes}
              />
              {errors.interval && <p className="text-xs text-destructive">{errors.interval}</p>}
            </label>
            <div className="sm:col-span-2">
              <ButtonGroup label={t("settings.theme")} orientation="horizontal" role="radiogroup">
                {themeOptions.map((option) => (
                  <RadioButton
                    checked={settings.theme === option.value}
                    key={option.value}
                    label={option.label}
                    name="theme"
                    onChange={(value) => setSettings((current) => ({ ...current, theme: value as ThemeMode }))}
                    value={option.value}
                  />
                ))}
              </ButtonGroup>
            </div>
            <div className="sm:col-span-2">
              <ButtonGroup label={t("settings.reader_mode")} orientation="horizontal" role="radiogroup">
                {readerModeOptions.map((option) => (
                  <RadioButton
                    checked={settings.reader_mode === option.value}
                    key={option.value}
                    label={option.label}
                    name="reader-mode"
                    onChange={(value) => setSettings((current) => ({ ...current, reader_mode: value as ReaderMode }))}
                    value={option.value}
                  />
                ))}
              </ButtonGroup>
            </div>
          </CardContent>
        </Card>

        <Card className="card-paper p-0">
          <CardHeader>
            <CardTitle className="font-rounded">{t("settings.compliance_title")}</CardTitle>
            <CardDescription>{t("settings.compliance_description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="space-y-2 text-sm font-medium">
              User-Agent
              <Input
                onChange={(event) => {
                  setSettings((current) => ({ ...current, user_agent: event.target.value }));
                  setErrors((e) => {
                    delete e.user_agent;
                    return { ...e };
                  });
                }}
                value={settings.user_agent}
              />
              {errors.user_agent && <p className="text-xs text-destructive">{errors.user_agent}</p>}
            </label>
            <ToggleButton checked={adultRatingsEnabled} label={t("settings.include_adult")} onChange={setAdultRatings} />
            <ButtonGroup label={t("settings.content_ratings_label")} orientation="horizontal">
              {contentRatings.map((rating) => (
                <SelectionButton
                  checked={settings.content_ratings.includes(rating)}
                  key={rating}
                  label={rating}
                  onChange={(checked) =>
                    setSettings((current) => ({
                      ...current,
                      content_ratings: checked
                        ? [...current.content_ratings, rating]
                        : current.content_ratings.filter((item) => item !== rating),
                    }))
                  }
                  value={rating}
                />
              ))}
            </ButtonGroup>
          </CardContent>
        </Card>
      </section>

      <aside className="space-y-3" />
        </div>
      </div>
    </section>
  );
}
