import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ptBR from "./locales/pt-br/translation.json";
import en from "./locales/en/translation.json";
import zh from "./locales/zh/translation.json";
import zhHK from "./locales/zh-hk/translation.json";
import es from "./locales/es/translation.json";
import esLA from "./locales/es-la/translation.json";
import jaRO from "./locales/ja-ro/translation.json";
import koRO from "./locales/ko-ro/translation.json";
import zhRO from "./locales/zh-ro/translation.json";

const resources = {
  "pt-br": { translation: ptBR },
  "pt-BR": { translation: ptBR },
  en: { translation: en },
  zh: { translation: zh },
  "zh-hk": { translation: zhHK },
  es: { translation: es },
  "es-la": { translation: esLA },
  "ja-ro": { translation: jaRO },
  "ko-ro": { translation: koRO },
  "zh-ro": { translation: zhRO },
};

const supportedUiLanguages = ["pt-br", "en"] as const;

function detectInitialLanguage() {
  const stored = localStorage.getItem("mangaba.uiLanguage")?.toLowerCase();
  if (stored && supportedUiLanguages.includes(stored as (typeof supportedUiLanguages)[number])) {
    return stored;
  }

  const browserLanguage = navigator.language.toLowerCase();
  return browserLanguage.startsWith("pt") ? "pt-br" : "en";
}

void i18n.use(initReactI18next).init({
  resources,
  lng: detectInitialLanguage(),
  fallbackLng: "en",
  supportedLngs: ["pt-br", "pt-BR", "en"],
  lowerCaseLng: true,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export default i18n;
