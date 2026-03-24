import React, { createContext, useContext, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("sl_lang") || "pt"; } catch { return "pt"; }
  });

  const toggleLang = () => {
    const next = lang === "pt" ? "en" : "pt";
    setLang(next);
    try { localStorage.setItem("sl_lang", next); } catch {}
  };

  const t = (key) =>
    translations[lang]?.[key] ?? translations.pt?.[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
