import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContent } from "../contexts/GlobalContentContext";
import { useLanguage } from "../contexts/LanguageContext";

// Simple SVG Icons
const Icons = {
  Lock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
  Pencil: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
  Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>,
  X: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
};

export const EditModeFAB = () => {
  const { isEditMode, setIsEditMode, hasPendingChanges, saveChanges, discardChanges } = useGlobalContent();
  const { t } = useLanguage();

  return (
    <div style={{ position: "fixed", bottom: 40, right: 40, zIndex: 9999, display: "flex", gap: 16, alignItems: "center" }}>
      
      <AnimatePresence>
        {hasPendingChanges && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            style={{ display: "flex", gap: 8, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(24px)", padding: 8, borderRadius: 24, boxShadow: "0 10px 30px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <button
              onClick={discardChanges}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid rgba(220,0,0,0.2)", color: "#E00", borderRadius: 16, padding: "8px 16px", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "0.2s" }}
            >
              <Icons.X /> {t("edit_revert")}
            </button>
            <button
              onClick={saveChanges}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "#171717", border: "none", color: "#FFF", borderRadius: 16, padding: "8px 20px", cursor: "pointer", fontSize: 13, fontWeight: 500, transition: "0.2s" }}
            >
              <Icons.Check /> {t("edit_publish")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsEditMode(!isEditMode)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 56, height: 56, borderRadius: "50%", border: "none", cursor: "pointer",
          background: isEditMode ? "#0066FF" : "#171717",
          color: "#FFF",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.3s ease"
        }}
        title={isEditMode ? t("edit_active") : t("edit_activate")}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isEditMode ? "pencil" : "lock"}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            {isEditMode ? <Icons.Pencil /> : <Icons.Lock />}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
