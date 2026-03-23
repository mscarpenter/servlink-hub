import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContent } from "./contexts/GlobalContentContext";
import { EditableText } from "./components/EditableText";
import { EditableList } from "./components/EditableList";
import { EditModeFAB } from "./components/EditModeFAB";
import { SyncIndicator } from "./components/SyncIndicator";

const THEMES = {
  dunas: {
    name: "Dunas de Jurerê",
    colors: { bg: "#F9F9F8", bgAlt: "#F1F1F0", surface: "rgba(255, 255, 255, 0.7)", surfaceSolid: "#FFFFFF", border: "rgba(226, 232, 240, 0.4)", text: "#000000", textMuted: "#666666", textDim: "#A3A3A3", accent: "#171717", highlight: "#0066FF", slate: "#0F172A" }
  },
  ventosul: {
    name: "Vento Sul",
    colors: { bg: "#FFFFFF", bgAlt: "#FAFAFA", surface: "rgba(255, 255, 255, 0.8)", surfaceSolid: "#FFFFFF", border: "rgba(0, 0, 0, 0.1)", text: "#111111", textMuted: "#888888", textDim: "#BBBBBB", accent: "#000000", highlight: "#0051FF", slate: "#1A1A1A" }
  },
  reserva: {
    name: "Reserva Natural",
    colors: { bg: "#F4F7F6", bgAlt: "#ECF1EF", surface: "rgba(255, 255, 255, 0.6)", surfaceSolid: "#FFFFFF", border: "rgba(180, 200, 190, 0.3)", text: "#0D2B1D", textMuted: "#4A6B5D", textDim: "#8DAA9D", accent: "#0A2016", highlight: "#10B981", slate: "#163D2B" }
  },
  sunset: {
    name: "Sunset Gold",
    colors: { bg: "#FAFAF9", bgAlt: "#F5F5F4", surface: "rgba(255, 255, 255, 0.7)", surfaceSolid: "#FFFFFF", border: "rgba(214, 211, 209, 0.4)", text: "#1C1917", textMuted: "#78716C", textDim: "#A8A29E", accent: "#0C0A09", highlight: "#D97706", slate: "#292524" }
  }
};

const TYPOGRAPHIES = {
  tecnologica: { name: "A Tecnológica", primary: '"Geist", "Inter", sans-serif', secondary: '"Geist Mono", "JetBrains Mono", monospace' },
  narrativa: { name: "A Narrativa", primary: '"SF Pro Display", "-apple-system", sans-serif', secondary: '"New York", "Georgia", serif' },
  contemporanea: { name: "A Contemporânea", primary: '"Montserrat", sans-serif', secondary: '"Roboto Mono", monospace' },
  classica: { name: "A Clássica de Luxo", primary: '"Cabinet Grotesk", sans-serif', secondary: '"EB Garamond", serif' }
};

const COLORS = {
  bg: "#F9F9F8",
  bgAlt: "#F1F1F0",
  surface: "rgba(255, 255, 255, 0.7)",
  surfaceSolid: "#FFFFFF",
  border: "rgba(226, 232, 240, 0.4)",
  text: "#000000",
  textMuted: "#666666",
  textDim: "#A3A3A3",
  accent: "#171717",
  highlight: "#0066FF",
  slate: "#0F172A",
  green: "#0070F3",
  red: "#E00",
  codeBg: "#0A0A0A",
  codeText: "#EDEDED",
};

// Inline SVG Icons
const Icons = {
  System: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>,
  Growth: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>,
  Tech: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>,
  Play: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>,
  Sprints: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>,
  List: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
  Board: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  Checkbox: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>,
  Calendar: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>,
  High: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="5 12 12 5 19 12"></polyline></svg>,
  Medium: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><line x1="5" y1="6" x2="19" y2="6"></line></svg>,
  Low: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>,
  Save: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>,
  Send: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>,
  Home: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  ArrowRight: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>,
  Github: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>,
  Book: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
};

const CustomSelect = ({ value, options, onChange, renderOption }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div 
        onClick={() => setOpen(!open)}
        style={{ padding: "6px 12px", border: "1px solid var(--theme-border)", borderRadius: 6, display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: "var(--theme-surfaceSolid)", fontSize: 13, color: "var(--theme-text)", minWidth: 160, justifyContent: "space-between" }}
      >
        {renderOption(options.find(o => o.id === value) || options[0])}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </div>
      {open && (
        <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 4, background: "var(--theme-surfaceSolid)", border: "1px solid var(--theme-border)", borderRadius: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 10, minWidth: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {options.map(opt => (
            <div 
              key={opt.id}
              onClick={() => { onChange(opt.id); setOpen(false); }}
              style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", borderBottom: "1px solid var(--theme-border)" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--theme-bgAlt)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {renderOption(opt)}
              {value === opt.id && <svg style={{ marginLeft: "auto", minWidth: 12 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"></path></svg>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};



export default function ServLinkBackOffice() {
  const { data, updateData, isEditMode } = useGlobalContent();
  
  const currentTheme = data?.branding?.theme || 'dunas';
  const currentTypo = data?.branding?.typography || 'tecnologica';
  const themeData = THEMES[currentTheme] || THEMES.dunas;
  const typoData = TYPOGRAPHIES[currentTypo] || TYPOGRAPHIES.tecnologica;

  const [activeMain, setActiveMain] = useState("home");
  const [activeSub, setActiveSub] = useState(null);
  const [globalHover, setGlobalHover] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const gridRef = useRef(null);

  // States for SCRUM Board mapping from context
  const tasks = data.scrum.tasks;
  const setTasks = (newTasks) => updateData('scrum.tasks', newTasks);
  
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sprintView, setSprintView] = useState("board");
  const [noteStatus, setNoteStatus] = useState("[Rascunho Automático]");

  const handleSaveNote = () => {
    setNoteStatus("Salvando...");
    setTimeout(() => setNoteStatus("Salvo em Segurança"), 500);
    setTimeout(() => setNoteStatus("[Rascunho Automático]"), 3000);
  };

  const handleSendToSprints = () => {
    const newId = "SL-" + String(tasks.length + 1).padStart(2, '0');
    setTasks([...tasks, {
      id: newId,
      title: data.diferencial.docTitle || "Ideia Operacional Sem Título",
      desc: data.diferencial.docText,
      status: "Backlog",
      priority: "Medium",
      points: 2,
      sprint: "Sprint 01",
      assignees: ["MC"],
      deadline: "TBD",
    }]);
    setNoteStatus("✅ Task Injetada em Backlog!");
    setTimeout(() => setNoteStatus("[Rascunho Automático]"), 3500);
  };

  const handleDragStart = (e, id) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, status) => {
    e.preventDefault();
    if (!draggedTaskId) return;
    setTasks(ts => ts.map(t => t.id === draggedTaskId ? { ...t, status } : t));
    setDraggedTaskId(null);
  };
  
  const getPriorityColor = (p) => p === "High" ? COLORS.text : p === "Medium" ? COLORS.textMuted : COLORS.textDim;

  // States for ROI Calculator
  const [roiNoShow, setRoiNoShow] = useState(350);
  const [roiEvents, setRoiEvents] = useState(48);
  const [roiRate, setRoiRate] = useState(30);
  const roiTotal = roiNoShow * roiEvents * (roiRate / 100);
  const roiSaved = roiTotal * 0.72;

  const handleMouseMove = (e) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&family=Montserrat:wght@400;500;600&family=Roboto+Mono:wght@400&family=EB+Garamond:wght@400;500&display=swap');

    :root {
      --font-ui: 'Inter', -apple-system, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    body {
      margin: 0; padding: 0;
      font-family: var(--font-ui); color: ${COLORS.text};
      -webkit-font-smoothing: antialiased;
      background: ${COLORS.bg};
      overflow-x: hidden;
    }

    * { box-sizing: border-box; }

    .mesh-bg {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1;
      background: radial-gradient(circle at 15% 50%, #F1F1F0 0%, transparent 50%),
                  radial-gradient(circle at 85% 30%, rgba(226, 232, 240, 0.5) 0%, transparent 50%);
      animation: meshPulse 15s ease-in-out infinite alternate;
    }
    @keyframes meshPulse {
      0% { transform: scale(1); opacity: 0.8; }
      100% { transform: scale(1.1); opacity: 1; }
    }

    .glassmorphic {
      background: ${COLORS.surface};
      backdrop-filter: blur(12px) saturate(140%);
      border: 1px solid ${COLORS.border};
      border-radius: 16px;
    }
      
    .glass-dock {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 24px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02);
    }
      
    .glass-nav {
      background: rgba(249, 249, 248, 0.8);
      backdrop-filter: blur(12px) saturate(150%);
      border-bottom: 1px solid ${COLORS.border};
    }

    .status-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .status-ok { background: #22C55E; box-shadow: 0 0 8px #22C55E88; }
    .status-alert { background: #EAB308; }
    
    input[type=range] {
      -webkit-appearance: none; width: 100%; background: transparent;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 16px; width: 16px; border-radius: 50%;
      background: ${COLORS.surfaceSolid}; cursor: pointer;
      border: 1px solid #D0D0D5;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-top: -6px;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%; height: 4px; cursor: pointer;
      background: ${COLORS.border}; border-radius: 2px;
    }

    .bento-card {
      background: ${COLORS.surfaceSolid}; border: 1px solid ${COLORS.border}; border-radius: 12px;
      transition: all 0.2s ease; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    }
    .bento-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.04);
    }
  `;

  const NavTab = ({ id, label, icon: Icon, active, set }) => (
    <button onClick={() => set(id)} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "8px 16px", borderRadius: 8,
      background: active ? COLORS.surfaceSolid : "transparent",
      color: active ? COLORS.text : COLORS.textMuted,
      fontFamily: "var(--font-ui)", fontSize: 13, fontWeight: active ? 600 : 500,
      border: `1px solid ${active ? COLORS.border : "transparent"}`,
      boxShadow: active ? "0 2px 4px rgba(0,0,0,0.02)" : "none",
      cursor: "pointer", transition: "all 0.2s ease",
    }}>
      <Icon /> {label}
    </button>
  );

  const SectionTitle = ({ title, subtitle }) => (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 4 }}>{title}</h2>
      <p style={{ fontSize: 14, color: COLORS.textMuted }}>{subtitle}</p>
    </div>
  );

  const LivingConnectors = () => {
    const isJurereHovered = globalHover === "jurere";
    return (
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}>
        <motion.path 
          d="M 60% 30% C 75% 30%, 80% 20%, 90% 20%" 
          fill="none" 
          stroke={isJurereHovered ? COLORS.highlight : "rgba(0,0,0,0.05)"} 
          strokeWidth="2" 
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1 }} 
          transition={{ duration: 1.5, ease: "easeInOut" }} 
        />
        {isJurereHovered && (
          <motion.circle r="3" fill={COLORS.highlight}
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            style={{ offsetPath: "path('M 60% 30% C 75% 30%, 80% 20%, 90% 20%')" }}
          />
        )}
      </svg>
    );
  };

  const renderCard = (block, blockIndex) => {
    const isCore = block.type === "core";
    const isInfra = block.type === "infra";
    const xParallax = mousePos.x * (isCore ? 15 : isInfra ? -5 : 5);
    const yParallax = mousePos.y * (isCore ? 15 : isInfra ? -5 : 5);
    
    const hasHighlight = block.items.some(it => 
      (globalHover === "jurere" && (it.id === "vp_agile" || it.id === "seg_b2b"))
    );

    return (
      <motion.div
        key={block.id}
        className="glassmorphic"
        style={{
          gridColumn: block.col, gridRow: block.row,
          display: "flex", flexDirection: "column", padding: 20,
          position: "relative", zIndex: isCore ? 10 : 1,
          border: hasHighlight ? `1px solid ${COLORS.highlight}` : `1px solid ${COLORS.border}`,
          boxShadow: hasHighlight ? `0 0 20px rgba(0,102,255,0.15)` : 'none'
        }}
        animate={{ x: xParallax, y: yParallax }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        whileHover={{ scale: 1.02, zIndex: 20, boxShadow: "0 20px 40px rgba(0,0,0,0.06)" }}
        onMouseEnter={() => setGlobalHover(block.id)}
        onMouseLeave={() => setGlobalHover(null)}
      >
        {isCore && (
          <motion.div 
            style={{ position: "absolute", top: -50, left: -50, right: -50, bottom: -50, background: `radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%)`, zIndex: -1 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
        
        <div style={{
          fontFamily: isInfra ? "var(--font-mono)" : "var(--font-ui)",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          color: isCore ? COLORS.text : COLORS.textMuted,
          marginBottom: 16, display: "flex", alignItems: "center", gap: 8
        }}>
          {isInfra && <span className="status-dot status-ok" />}
          {isCore && <span className="status-dot status-alert" style={{ background: COLORS.highlight, boxShadow: `0 0 8px ${COLORS.highlight}88` }} />}
          <EditableText path={`bmc.cards.${blockIndex}.title`} />
        </div>

        <EditableList
          listPath={`bmc.cards.${blockIndex}.items`}
          renderItem={(item, i) => {
            const itemHighlight = globalHover === "jurere" && (item.id === "vp_agile" || item.id === "seg_b2b");
            return (
              <div key={item.id || i} style={{ display: "flex", alignItems: "baseline", gap: 8, flex: 1 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: itemHighlight ? COLORS.highlight : COLORS.textDim, flexShrink: 0 }} />
                <EditableText
                  path={`bmc.cards.${blockIndex}.items.${i}.text`}
                  style={{
                    fontSize: isCore ? 14 : 12,
                    fontFamily: isInfra ? "var(--font-mono)" : "var(--font-ui)",
                    fontWeight: itemHighlight || isCore ? 600 : 400,
                    color: itemHighlight ? COLORS.highlight : COLORS.textMuted,
                    lineHeight: 1.4, transition: "color 0.3s ease",
                    flex: 1
                  }}
                />
              </div>
            );
          }}
        />
      </motion.div>
    );
  };

  const renderCoreBMC = () => (
    <motion.div 
      key="bmc"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6 }}
      style={{ display: "flex", flexDirection: "column", gap: 32 }}
    >
      <div style={{ marginBottom: 16 }}>
        <EditableText path="bmc.title" as="h2" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.03em", color: COLORS.text, marginBottom: 4 }} />
        <EditableText path="bmc.subtitle" as="p" style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }} />
      </div>

      <div 
        ref={gridRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        style={{ 
          position: "relative",
          display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gridTemplateRows: "repeat(2, 140px)", gap: 16 
        }}
      >
        <LivingConnectors />
        {data.bmc.cards.map((block, i) => renderCard(block, i))}
      </div>

      <motion.div className="glass-dock" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, padding: "24px 32px", marginTop: 16, position: "relative" }}>
        <div style={{ position: "absolute", top: -16, left: "50%", transform: "translateX(-50%)", background: COLORS.text, color: "#FFF", padding: "4px 16px", borderRadius: 20, fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.05em", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}>
          FINANCIAL ENGINE
        </div>
        <div style={{ borderRight: `1px solid ${COLORS.border}`, paddingRight: 24 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: COLORS.textMuted, marginBottom: 12 }}>COST STRUCTURE</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {["Cloud Infra AWS", "Gateway Fees", "Manual Curation"].map(c => (
               <div key={c} style={{ fontSize: 12, padding: "4px 8px", background: "rgba(0,0,0,0.03)", borderRadius: 6, color: COLORS.textMuted }}>{c}</div>
            ))}
          </div>
        </div>
        <div style={{ paddingLeft: 8 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: COLORS.textMuted, marginBottom: 12 }}>REVENUE STREAMS</div>
          <div style={{ display: "flex", gap: 32 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.04em", color: COLORS.text }}>15-20%</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>Take Rate (Fase 1)</div>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.04em", color: COLORS.text }}>Pro</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted }}>SaaS Mensal (Fase 2)</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderCoreDiferencial = () => (
    <motion.div key="diferencial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 40, height: "100%" }}>
      <SectionTitle title="Diferencial Competitivo" subtitle="A essência do fosso institucional B2B." />
      
      <div style={{ background: "#FFF", borderRadius: 12, border: `1px solid ${COLORS.border}`, padding: "40px 60px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", fontFamily: "var(--font-ui)", lineHeight: 1.8, fontSize: 16, color: COLORS.text, display: "flex", flexDirection: "column", minHeight: 480 }}>
        <input 
          type="text" 
          value={data.diferencial.docTitle}
          onChange={(e) => updateData('diferencial.docTitle', e.target.value)}
          readOnly={!isEditMode}
          style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 24, paddingBottom: 16, border: "none", outline: "none", width: "100%", color: COLORS.text, background: "transparent", borderBottom: `1px dashed ${COLORS.border}` }} 
          placeholder="Título do documento..."
        />
        
        <textarea
          value={data.diferencial.docText}
          onChange={(e) => updateData('diferencial.docText', e.target.value)}
          readOnly={!isEditMode}
          placeholder="Comece a digitar suas ideias estratégicas aqui..."
          style={{ flex: 1, width: "100%", border: "none", outline: "none", resize: "none", background: "transparent", color: COLORS.textMuted, fontSize: 15, lineHeight: 1.8, fontFamily: "var(--font-ui)" }}
        />

        <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: noteStatus.includes("✅") ? "#22C55E" : COLORS.textDim, fontFamily: "var(--font-mono)", transition: "0.2s" }}>
            {noteStatus}
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button 
              onClick={() => { setActiveMain("growth"); setActiveSub("partners"); }}
              style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, background: "transparent", color: COLORS.textMuted, borderRadius: 8, border: `1px solid transparent`, cursor: "pointer", transition: "all 0.2s" }}
              title="Sinergia de Parcerias Institucionais"
              onMouseEnter={e => { e.currentTarget.style.color = COLORS.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = COLORS.textMuted; }}
            >
              <Icons.System />
            </button>
            <div style={{ height: 24, width: 1, background: COLORS.border }} />
            <button 
              onClick={handleSaveNote}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", background: "transparent", color: COLORS.textMuted, borderRadius: 8, border: `1px solid transparent`, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease" }}
              onMouseEnter={e => { e.currentTarget.style.color = COLORS.text; }}
              onMouseLeave={e => { e.currentTarget.style.color = COLORS.textMuted; }}
            >
              <Icons.Save /> Salvar Draft
            </button>
            <button 
              onClick={handleSendToSprints}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: COLORS.text, color: "#fff", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all 0.2s ease", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <Icons.Send /> Gerar Task
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderCoreProposta = () => (
    <motion.div key="proposta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
      <div style={{ paddingRight: 40 }}>
        <div style={{ marginBottom: 32 }}>
          <EditableText path="proposta.title" as="h2" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, margin: 0, marginBottom: 4 }} />
          <EditableText path="proposta.subtitle" as="p" style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }} />
        </div>
        <EditableText path="proposta.desc" as="div" style={{ fontSize: 15, color: COLORS.slateDim, lineHeight: 1.6, marginBottom: 24 }} />
        
        {/* Stage Manager Style Lead Gen Tracker */}
        <div className="glass-dock" style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, background: COLORS.surfaceSolid }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: COLORS.text, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.text }}>TELEMETRY</div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: COLORS.textMuted }}>Match Efficiency</div>
            </div>
          </div>
          <div style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>
            <div style={{ fontSize: 20, fontWeight: 500, color: COLORS.text, letterSpacing: "-0.05em" }}>60.0<span style={{ fontSize: 12, color: COLORS.textMuted }}>s</span></div>
          </div>
        </div>
      </div>
      
      <div style={{ position: "relative", paddingLeft: 24, borderLeft: `1px solid ${COLORS.border}` }}>
        <EditableList
          listPath="proposta.steps"
          renderItem={(step, i) => {
            const isHovered = globalHover === step.id;
            return (
              <div key={step.id || i} style={{ position: "relative", cursor: "pointer", display: "flex", flexDirection: "column", flex: 1, paddingBottom: 24 }}
                   onMouseEnter={() => setGlobalHover(step.id)}
                   onMouseLeave={() => setGlobalHover(null)}>
                <div style={{
                  position: "absolute", left: -30, top: 4, width: 11, height: 11, borderRadius: "50%",
                  background: step.status === 'critical' ? COLORS.red : step.status === 'loss' ? COLORS.slate : COLORS.surfaceSolid,
                  border: `2px solid ${step.status === 'normal' ? COLORS.textMuted : 'transparent'}`,
                  boxShadow: isHovered && step.id === 'jurere' ? `0 0 12px ${COLORS.highlight}` : 'none'
                }} />
                <EditableText path={`proposta.steps.${i}.time`} style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: isHovered && step.id === 'jurere' ? COLORS.highlight : COLORS.textMuted, marginBottom: 4 }} />
                <EditableText path={`proposta.steps.${i}.event`} style={{ fontSize: 14, fontWeight: isHovered && step.id === 'jurere' ? 600 : 500, color: isHovered && step.id === 'jurere' ? COLORS.highlight : COLORS.text, marginBottom: 4 }} />
                <EditableText path={`proposta.steps.${i}.desc`} as="div" style={{ fontSize: 13, color: COLORS.textDim, lineHeight: 1.5 }} />
              </div>
            )
          }}
        />
      </div>
    </motion.div>
  );

  const renderCorePitch = () => (
    <motion.div key="pitch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: 32, height: "calc(100vh - 240px)" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, overflowY: "auto", paddingRight: 16 }}>
        <div style={{ marginBottom: 32 }}>
          <EditableText path="pitch.title" as="h2" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, margin: 0, marginBottom: 4 }} />
          <EditableText path="pitch.subtitle" as="p" style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }} />
        </div>
        <EditableList
          listPath="pitch.acts"
          renderItem={(s, i) => (
            <div key={s.id || i} style={{ padding: 16, background: COLORS.surfaceSolid, border: `1px solid ${COLORS.border}`, borderRadius: 8, flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: COLORS.highlight, marginBottom: 4 }}>ACT <EditableText path={`pitch.acts.${i}.act`} /></div>
              <EditableText path={`pitch.acts.${i}.title`} style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, marginBottom: 4 }} />
              <EditableText path={`pitch.acts.${i}.text`} as="div" style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.5 }} />
            </div>
          )}
        />
      </div>
      <div style={{ background: COLORS.slate, borderRadius: 12, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ position: "absolute", top: 16, left: 16, fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.4)" }}>REFERENCE_PLAYER.mov</div>
        <button style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", border: "1px solid rgba(255,255,255,0.2)", cursor: "pointer", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
          <Icons.Play />
        </button>
      </div>
    </motion.div>
  );

  const renderGrowthROI = () => (
    <motion.div key="roi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ maxWidth: 800 }}>
      <SectionTitle title="Technical ROI Tool" subtitle="Calculadora de conversão B2B." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div style={{ padding: 24, background: COLORS.surfaceSolid, borderRadius: 12, border: `1px solid ${COLORS.border}` }}>
          {[
            { label: "Lost revenue / event", val: roiNoShow, set: setRoiNoShow, min: 50, max: 2000, prefix: "R$" },
            { label: "High-volume events / year", val: roiEvents, set: setRoiEvents, min: 10, max: 365, prefix: "" },
            { label: "No-Show factor", val: roiRate, set: setRoiRate, min: 5, max: 80, prefix: "", suffix: "%" }
          ].map((inp, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: COLORS.textMuted }}>{inp.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: COLORS.text }}>{inp.prefix}{inp.val}{inp.suffix}</span>
              </div>
              <input type="range" min={inp.min} max={inp.max} value={inp.val} onChange={e => inp.set(Number(e.target.value))} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ flex: 1, padding: 24, background: COLORS.surfaceSolid, borderRadius: 12, border: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: COLORS.textMuted, marginBottom: 8 }}>Estimated Lost Margin</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 500, color: COLORS.text }}>R$ {roiTotal.toLocaleString("pt-BR", {maximumFractionDigits:0})}</div>
          </div>
          <div style={{ flex: 1, padding: 24, background: COLORS.slate, borderRadius: 12, display: "flex", flexDirection: "column", justifyContent: "center" }}>
             <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>Value Recovered (72% efficiency)</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 32, fontWeight: 500, color: COLORS.green }}>+R$ {roiSaved.toLocaleString("pt-BR", {maximumFractionDigits:0})}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const themeOptions = Object.entries(THEMES).map(([id, t]) => ({ id, name: t.name, colors: t.colors }));
  const fontOptions = Object.entries(TYPOGRAPHIES).map(([id, t]) => ({ id, name: t.name, primary: t.primary }));

  const renderThemeOption = (opt) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ 
        width: 14, height: 14, borderRadius: "50%", 
        background: `linear-gradient(135deg, ${opt.colors?.highlight} 0%, ${opt.colors?.slate} 50%, ${opt.colors?.bg} 100%)`,
        boxShadow: "0 0 0 1px rgba(0,0,0,0.1)"
      }} />
      <span style={{ whiteSpace: "nowrap" }}>{opt.name}</span>
    </div>
  );

  const renderFontOption = (opt) => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: opt.primary }}>
      <span style={{ whiteSpace: "nowrap" }}>{opt.name}</span>
    </div>
  );

  const renderGrowthBranding = () => (
    <motion.div key="branding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* 1. Header */}
      <SectionTitle title="Branding Artifacts" subtitle="Assets and typography identity." />
      
      {/* 2. Top 3 Promo Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <div style={{ padding: 40, background: themeData.colors.surfaceSolid, borderRadius: 12, border: `1px solid ${themeData.colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: typoData.primary, transition: "all 0.3s ease" }}>
          <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.04em", color: themeData.colors.text }}>ServLink</span>
        </div>
        <div style={{ padding: 40, background: themeData.colors.slate, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: typoData.primary, transition: "all 0.3s ease" }}>
          <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.04em", color: themeData.colors.surfaceSolid }}>ServLink</span>
        </div>
        <div style={{ padding: 40, background: themeData.colors.surfaceSolid, borderRadius: 12, border: `1px solid ${themeData.colors.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: typoData.primary, transition: "all 0.3s ease" }}>
          <div style={{ width: 40, height: 40, background: themeData.colors.slate, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: themeData.colors.surfaceSolid, fontWeight: 600, fontSize: 18 }}>S</div>
        </div>
      </div>

      {/* 3. Bottom 2 Info Cards */}
      <div style={{ 
        marginTop: 24, display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16,
        '--theme-bg': themeData.colors.bg,
        '--theme-bgAlt': themeData.colors.bgAlt,
        '--theme-surfaceSolid': themeData.colors.surfaceSolid,
        '--theme-border': themeData.colors.border,
        '--theme-text': themeData.colors.text,
        '--theme-textMuted': themeData.colors.textMuted
      }}>
        
        {/* Typography Card */}
        <div style={{ padding: 24, background: themeData.colors.surfaceSolid, borderRadius: 12, border: `1px solid ${themeData.colors.border}`, transition: "all 0.3s ease", position: "relative", zIndex: 5 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, color: themeData.colors.textMuted, textTransform: "uppercase" }}>TYPOGRAPHY — {typoData.name}</div>
            <div style={{ transform: "translateY(-4px)", position: "relative", zIndex: 10 }}>
              <CustomSelect 
                value={currentTypo} 
                options={fontOptions} 
                onChange={val => updateData('branding.typography', val)}
                renderOption={renderFontOption}
              />
            </div>
          </div>
          <div style={{ fontSize: 48, fontWeight: 300, color: themeData.colors.text, fontFamily: typoData.primary, lineHeight: 1 }}>Aa</div>
          <div style={{ fontSize: 14, color: themeData.colors.textMuted, marginTop: 8, fontFamily: typoData.primary }}>The quick brown fox jumps over the lazy dog.</div>
        </div>

        {/* Palette Card */}
        <div style={{ padding: 24, background: themeData.colors.surfaceSolid, borderRadius: 12, border: `1px solid ${themeData.colors.border}`, display: "flex", flexDirection: "column", transition: "all 0.3s ease", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, color: themeData.colors.textMuted, textTransform: "uppercase" }}>CORE PALETTE</div>
            <div style={{ transform: "translateY(-4px)", position: "relative", zIndex: 10 }}>
              <CustomSelect 
                value={currentTheme} 
                options={themeOptions} 
                onChange={val => updateData('branding.theme', val)}
                renderOption={renderThemeOption}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: "auto", flexWrap: "wrap" }}>
            {[themeData.colors.bg, themeData.colors.surfaceSolid, themeData.colors.border, themeData.colors.text, themeData.colors.slate, themeData.colors.highlight].map((c, i) => (
              <div key={i} style={{ width: 32, height: 32, borderRadius: 4, background: c, border: `1px solid rgba(0,0,0,0.1)` }} title={c} />
            ))}
          </div>
        </div>

      </div>

      {/* 4. Brand Direction */}
      <div style={{ 
        marginTop: 24, padding: 32, borderRadius: 16, border: `1px solid ${themeData.colors.border}`,
        background: `linear-gradient(to bottom, ${themeData.colors.bgAlt}, ${themeData.colors.surfaceSolid})`, 
        display: "flex", flexDirection: "column", gap: 24, transition: "all 0.3s ease",
        fontFamily: "var(--font-ui)" 
      }}>
        <div style={{ fontSize: 11, color: themeData.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Direção de Marca</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          
          {/* Tom de Voz */}
          <div style={{ padding: 24, background: themeData.colors.surfaceSolid, borderRadius: 12, border: `1px solid ${themeData.colors.border}`, display: "flex", flexDirection: "column", gap: 20, transition: "all 0.3s ease" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: themeData.colors.highlight, fontFamily: typoData.primary }}>Tom de Voz</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Profissional mas acessível</div>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Confiança sem arrogância</div>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Linguagem direta, sem jargões</div>
            </div>
          </div>

          {/* Personalidade */}
          <div style={{ padding: 24, background: themeData.colors.surfaceSolid, borderRadius: 12, border: `1px solid ${themeData.colors.border}`, display: "flex", flexDirection: "column", gap: 20, transition: "all 0.3s ease" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: themeData.colors.highlight, fontFamily: typoData.primary }}>Personalidade</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Confiável como um maître</div>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Ágil como um barista</div>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Preciso como um sommelier</div>
            </div>
          </div>

          {/* Valores Visuais */}
          <div style={{ padding: 24, background: themeData.colors.surfaceSolid, borderRadius: 12, border: `1px solid ${themeData.colors.border}`, display: "flex", flexDirection: "column", gap: 20, transition: "all 0.3s ease" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: themeData.colors.highlight, fontFamily: typoData.primary }}>Valores Visuais</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Minimalismo funcional</div>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Hierarquia clara</div>
              <div style={{ fontSize: 13, color: themeData.colors.textMuted, lineHeight: 1.5, display: "flex", gap: 8 }}><span style={{ color: themeData.colors.textDim }}>→</span> Espaço para respirar</div>
            </div>
          </div>

        </div>
      </div>

    </motion.div>
  );

  const renderGrowthBlog = () => (
    <motion.div key="blog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: 32 }}>
        <EditableText path="blog.title" as="h2" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, margin: 0, marginBottom: 4 }} />
        <EditableText path="blog.subtitle" as="p" style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {data.blog.posts.map((p, i) => (
          <div key={p.id || i} className="bento-card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <EditableText path={`blog.posts.${i}.tag`} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: COLORS.highlight }} />
              <EditableText path={`blog.posts.${i}.date`} style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: COLORS.textMuted }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <EditableText path={`blog.posts.${i}.title`} as="h3" style={{ fontSize: 16, fontWeight: 500, color: COLORS.text, margin: 0 }} />
              <EditableText path={`blog.posts.${i}.desc`} as="p" style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.5, margin: 0 }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderGrowthPartners = () => (
    <motion.div key="partners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: 32 }}>
        <EditableText path="partners.title" as="h2" style={{ fontSize: 24, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, margin: 0, marginBottom: 4 }} />
        <EditableText path="partners.subtitle" as="p" style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {data.partners.list.map((p, i) => (
          <div key={p.id || i} className="bento-card" style={{ height: 120, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", filter: isEditMode ? "none" : "grayscale(100%)", transition: "all 0.3s ease", padding: 16 }}
               onMouseEnter={e => e.currentTarget.style.filter = "grayscale(0%)"}
               onMouseLeave={e => e.currentTarget.style.filter = isEditMode ? "none" : "grayscale(100%)"}>
            <EditableText path={`partners.list.${i}.name`} style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, letterSpacing: "-0.04em", cursor: "default" }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: COLORS.textMuted, marginTop: 8, display: "flex", gap: 4 }}>[<EditableText path={`partners.list.${i}.status`} />]</div>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderArchitecture = () => (
    <motion.div key="archi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: "flex", justifyContent: "center", paddingTop: 32 }}>
      <div style={{ width: "100%", maxWidth: 800, background: COLORS.codeBg, borderRadius: 16, border: `1px solid rgba(255,255,255,0.1)`, overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ height: 32, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", padding: "0 16px", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F56" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFBD2E" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#27C93F" }} />
          <div style={{ flex: 1, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 11, color: "rgba(255,255,255,0.3)", transform: "translateX(-24px)" }}>stack.config.yaml</div>
        </div>
        <div style={{ padding: 24, fontFamily: "var(--font-mono)", fontSize: 13, color: COLORS.codeText, lineHeight: 1.6 }}>
          <span style={{ color: "#FF7B72" }}>version:</span> <span style={{ color: "#79C0FF" }}>"2026.2"</span><br/>
          <span style={{ color: "#FF7B72" }}>project:</span> <span style={{ color: "#79C0FF" }}>"ServLink MVP"</span><br/><br/>
          <span style={{ color: "#FF7B72" }}>infrastructure:</span><br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>cloud:</span> AWS<br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>compute:</span> Serverless + Vercel<br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>database:</span> PostgreSQL (Supabase)<br/><br/>
          
          <span style={{ color: "#FF7B72" }}>frontend:</span><br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>framework:</span> Next.js 14 (App Router)<br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>styling:</span> Tailwind CSS<br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>state:</span> Zustand / React Query<br/><br/>

          <span style={{ color: "#FF7B72" }}>backend:</span><br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>core:</span> Laravel 11 / Octane<br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>payments:</span> Stripe Connect<br/>
          &nbsp;&nbsp;<span style={{ color: "#7EE787" }}>cache:</span> Redis<br/><br/>
          
          <span style={{ color: "#8B949E" }}># Status: Bootstrapping...</span>
        </div>
      </div>
    </motion.div>
  );

  const renderSprintsBoard = () => {
    const columns = ["Backlog", "To Do", "In Progress", "Done"];
    return (
      <motion.div key="sprints" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "calc(100vh - 160px)", display: "flex", flexDirection: "column" }}>
        
        {/* Gestão Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${COLORS.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <EditableText path="scrum.sprintTitle" as="h2" style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", color: COLORS.text, marginBottom: 4, margin: 0 }} />
              <div style={{ fontSize: 13, color: COLORS.textMuted, display: "flex", alignItems: "center", gap: 6 }}><Icons.List /> {tasks.length} issues</div>
            </div>
            
            <div style={{ height: 24, width: 1, background: COLORS.border, margin: "0 8px" }} />
            
            <div style={{ display: "flex", gap: 4, background: COLORS.surfaceSolid, padding: 4, borderRadius: 8, border: `1px solid ${COLORS.border}` }}>
              <button onClick={() => setSprintView("board")} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, background: sprintView === "board" ? COLORS.border : "transparent", color: sprintView === "board" ? COLORS.text : COLORS.textMuted, border: "none", cursor: "pointer" }}><Icons.Board /></button>
              <button onClick={() => setSprintView("list")} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, background: sprintView === "list" ? COLORS.border : "transparent", color: sprintView === "list" ? COLORS.text : COLORS.textMuted, border: "none", cursor: "pointer" }}><Icons.List /></button>
            </div>
            
            <div style={{ display: "flex", gap: 8, marginLeft: 8 }}>
              {["Modo Eu", "Prioridade", "Responsável"].map(f => (
                <button key={f} style={{ background: "transparent", border: `1px dashed ${COLORS.border}`, padding: "6px 12px", borderRadius: 6, fontSize: 13, fontWeight: 500, color: COLORS.textMuted, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.borderColor = COLORS.textDim} onMouseLeave={e => e.currentTarget.style.borderColor = COLORS.border}>{f}</button>
              ))}
            </div>
          </div>
          
          <div>
            <button style={{ background: COLORS.text, color: "#fff", border: "none", padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}><span style={{ fontFamily: "var(--font-mono)" }}>+</span> New Issue</button>
          </div>
        </div>

        {/* Board View */}
        {sprintView === "board" && (
          <div style={{ flex: 1, display: "flex", gap: 16, overflowX: "auto", paddingBottom: 16 }}>
            {columns.map(col => {
              const colTasks = tasks.filter(t => t.status === col);
              return (
                <div 
                  key={col}
                  onDragOver={handleDragOver}
                  onDrop={e => handleDrop(e, col)}
                  style={{ flex: 1, minWidth: 280, display: "flex", flexDirection: "column", gap: 12, background: "rgba(255,255,255,0.4)", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12 }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, padding: "0 4px" }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{col}</div>
                    <div style={{ fontSize: 12, color: COLORS.textMuted, fontFamily: "var(--font-mono)", background: COLORS.surfaceSolid, padding: "2px 6px", borderRadius: 12, border: `1px solid ${COLORS.border}` }}>{colTasks.length}</div>
                  </div>
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    {colTasks.map(task => (
                      <motion.div
                        layoutId={task.id}
                        key={task.id}
                        draggable
                        onDragStart={e => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTask(task)}
                        className="bento-card"
                        style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, background: COLORS.surfaceSolid, opacity: draggedTaskId === task.id ? 0.5 : 1 }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: COLORS.textDim }}>{task.id}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, color: task.priority === "High" ? COLORS.text : COLORS.textMuted }}>
                            {task.priority === "High" && <Icons.High />}
                            {task.priority === "Medium" && <Icons.Medium />}
                            {task.priority === "Low" && <Icons.Low />}
                          </div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, marginBottom: 6, lineHeight: 1.3 }}>{task.title}</div>
                        </div>
                        
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                          <div style={{ display: "flex", gap: 12 }}>
                            {task.subtasks && (
                              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: COLORS.textMuted, fontFamily: "var(--font-mono)" }}><Icons.Checkbox /> {task.subtasks.done}/{task.subtasks.total}</div>
                            )}
                            {task.deadline && (
                              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: COLORS.textMuted, fontFamily: "var(--font-mono)" }}><Icons.Calendar /> {task.deadline}</div>
                            )}
                          </div>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            {task.assignees.map(a => (
                              <div key={a} style={{ width: 22, height: 22, borderRadius: "50%", background: COLORS.text, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, border: `2px solid ${COLORS.surfaceSolid}`, marginLeft: -4 }}>{a}</div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {sprintView === "list" && (
          <div style={{ flex: 1, overflowY: "auto", background: COLORS.surfaceSolid, border: `1px solid ${COLORS.border}`, borderRadius: 12 }}>
            <div style={{ display: "flex", padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em", color: COLORS.textMuted, fontWeight: 600 }}>
              <div style={{ width: 80 }}>ID</div>
              <div style={{ flex: 1 }}>Title</div>
              <div style={{ width: 120 }}>Status</div>
              <div style={{ width: 100 }}>Priority</div>
              <div style={{ width: 100 }}>Assignee</div>
            </div>
            {tasks.map(task => (
              <div key={task.id} onClick={() => setSelectedTask(task)} style={{ display: "flex", padding: "12px 16px", borderBottom: `1px solid ${COLORS.border}`, alignItems: "center", fontSize: 13, cursor: "pointer" }} className="bento-card">
                <div style={{ width: 80, fontFamily: "var(--font-mono)", color: COLORS.textMuted }}>{task.id}</div>
                <div style={{ flex: 1, fontWeight: 500, color: COLORS.text }}>{task.title}</div>
                <div style={{ width: 120 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.textDim }} /> {task.status}
                  </span>
                </div>
                <div style={{ width: 100, display: "flex", alignItems: "center", gap: 6, color: task.priority === "High" ? COLORS.text : COLORS.textMuted }}>
                  {task.priority === "High" && <Icons.High />}
                  {task.priority === "Medium" && <Icons.Medium />}
                  {task.priority === "Low" && <Icons.Low />}
                  {task.priority}
                </div>
                <div style={{ width: 100 }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {task.assignees.map(a => (
                      <div key={a} style={{ width: 22, height: 22, borderRadius: "50%", background: COLORS.text, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 600, border: `2px solid ${COLORS.surfaceSolid}`, marginLeft: -4 }}>{a}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {selectedTask && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelectedTask(null)}
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)", zIndex: 100 }}
              />
              <motion.div
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 440, background: COLORS.surfaceSolid, borderLeft: `1px solid ${COLORS.border}`, zIndex: 101, display: "flex", flexDirection: "column", boxShadow: "-20px 0 40px rgba(0,0,0,0.1)" }}
              >
                <div style={{ padding: "16px 24px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: COLORS.bg }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: COLORS.textMuted, background: COLORS.surfaceSolid, padding: "2px 8px", borderRadius: 4, border: `1px solid ${COLORS.border}` }}>{selectedTask.id}</div>
                    <div style={{ fontSize: 13, color: COLORS.textMuted }}>in <span style={{ color: COLORS.text, fontWeight: 500 }}>{selectedTask.sprint}</span></div>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button style={{ background: "transparent", border: "none", cursor: "pointer", color: COLORS.textMuted }}><Icons.Play /></button>
                    <button onClick={() => setSelectedTask(null)} style={{ background: "transparent", border: "none", cursor: "pointer", fontSize: 20, color: COLORS.textMuted }}>&times;</button>
                  </div>
                </div>
                
                <div style={{ padding: 32, flex: 1, overflowY: "auto" }}>
                  <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24, letterSpacing: "-0.02em" }}>{selectedTask.title}</h2>
                  
                  {/* Meta Grid */}
                  <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "16px 0", fontSize: 13, marginBottom: 32 }}>
                    <div style={{ color: COLORS.textMuted, display: "flex", alignItems: "center" }}>Assignee</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {selectedTask.assignees.map(a => (
                        <div key={a} style={{ width: 24, height: 24, borderRadius: "50%", background: COLORS.text, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>{a}</div>
                      ))}
                    </div>
                    
                    <div style={{ color: COLORS.textMuted, display: "flex", alignItems: "center" }}>Status</div>
                    <div><span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: "4px 8px", borderRadius: 6, fontWeight: 500 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.textDim }} /> {selectedTask.status}</span></div>

                    <div style={{ color: COLORS.textMuted, display: "flex", alignItems: "center" }}>Priority</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500, color: selectedTask.priority === "High" ? COLORS.text : COLORS.textMuted }}>
                      {selectedTask.priority === "High" && <Icons.High />}
                      {selectedTask.priority === "Medium" && <Icons.Medium />}
                      {selectedTask.priority === "Low" && <Icons.Low />}
                      {selectedTask.priority}
                    </div>

                    <div style={{ color: COLORS.textMuted, display: "flex", alignItems: "center" }}>Estimate</div>
                    <div style={{ fontFamily: "var(--font-mono)" }}>{selectedTask.points} <span style={{ color: COLORS.textMuted }}>pts</span></div>

                    <div style={{ color: COLORS.textMuted, display: "flex", alignItems: "center" }}>Due Date</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, color: COLORS.text }}><Icons.Calendar /> {selectedTask.deadline}</div>
                  </div>
                  
                  <div style={{ height: 1, background: COLORS.border, margin: "32px -32px" }} />
                  
                  <div style={{ fontSize: 15, color: COLORS.text, lineHeight: 1.6 }}>
                    {selectedTask.desc}
                  </div>
                  
                  {selectedTask.subtasks && (
                    <div style={{ marginTop: 32 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textMuted, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>Subtasks</div>
                      <div style={{ border: `1px solid ${COLORS.border}`, borderRadius: 8, overflow: "hidden" }}>
                        {Array.from({length: selectedTask.subtasks.total}).map((_, i) => (
                           <div key={i} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: i < selectedTask.subtasks.total - 1 ? `1px solid ${COLORS.border}` : 'none', background: COLORS.surfaceSolid }}>
                             <input type="checkbox" checked={i < selectedTask.subtasks.done} readOnly style={{ width: 16, height: 16, accentColor: COLORS.text }} />
                             <span style={{ fontSize: 13, color: i < selectedTask.subtasks.done ? COLORS.textDim : COLORS.text, textDecoration: i < selectedTask.subtasks.done ? "line-through" : "none" }}>Subtask placeholder {i + 1}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderHome = () => (
    <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: "flex", flexDirection: "column", gap: 32, paddingBottom: 60, height: "100%" }}>
      {/* Hero Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 16, marginTop: 20 }}>
        <EditableText 
          path="home.heroTitle" 
          as="h1" 
          style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.04em", color: COLORS.text, margin: 0 }} 
        />
        <EditableText 
          path="home.heroDesc" 
          as="p" 
          style={{ fontSize: 18, color: COLORS.textMuted, lineHeight: 1.6, maxWidth: 800, margin: 0 }} 
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32 }}>
        
        {/* Bento Grid Navegacao */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {data.home.cards.map((card, idx) => {
            const navMap = {
              core_proposta: { main: "core", sub: "proposta", icon: Icons.Play },
              core_bmc: { main: "core", sub: "bmc", icon: Icons.System },
              sprints_board: { main: "sprints", sub: "board", icon: Icons.Sprints },
              growth_partners: { main: "growth", sub: "partners", icon: Icons.Growth },
              core_diferencial: { main: "core", sub: "diferencial", icon: Icons.Book }
            };
            const nav = navMap[card.id] || { main: "home", sub: null, icon: Icons.System };
            const Icon = nav.icon;
            return (
            <motion.div 
              key={card.id}
              onClick={(e) => { 
                if (isEditMode) e.stopPropagation();
                else { setActiveMain(nav.main); setActiveSub(nav.sub); }
              }}
              className="bento-card"
              style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, background: COLORS.surfaceSolid, height: "100%", cursor: isEditMode ? 'default' : 'pointer' }}
              whileHover={{ y: isEditMode ? 0 : -4, borderColor: isEditMode ? COLORS.border : COLORS.textDim }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.bg, border: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.text, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <Icon />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <EditableText path={`home.cards.${idx}.title`} as="h3" style={{ fontSize: 16, fontWeight: 600, color: COLORS.text, letterSpacing: "-0.01em", margin: 0 }} />
                <EditableText path={`home.cards.${idx}.desc`} as="p" style={{ fontSize: 14, color: COLORS.textMuted, lineHeight: 1.5, margin: 0 }} />
              </div>
              <div style={{ marginTop: "auto", paddingTop: 16, display: "flex", alignItems: "center", color: COLORS.textDim, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-mono)" }}>
                [Acessar Módulo] <span style={{ marginLeft: 6 }}><Icons.ArrowRight /></span>
              </div>
            </motion.div>
          )})}
        </div>

        {/* Status Widget Lateral */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Milestone */}
          <div className="bento-card" style={{ padding: 24, background: "#FFF", display: "flex", flexDirection: "column", gap: 16, cursor: "default" }}>
            <EditableText path="home.milestone.title" as="div" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: COLORS.textMuted, textTransform: "uppercase" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(0,102,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.highlight, border: `1px solid rgba(0,102,255,0.15)` }}>
                <Icons.Calendar />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <EditableText path="home.milestone.event" as="div" style={{ fontSize: 15, fontWeight: 600, color: COLORS.text }} />
                <EditableText path="home.milestone.time" as="div" style={{ fontSize: 13, color: COLORS.textMuted }} />
              </div>
            </div>
          </div>

          {/* Sprint Progress */}
          <div className="bento-card" style={{ padding: 24, background: "#FFF", display: "flex", flexDirection: "column", gap: 16, cursor: "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: COLORS.textMuted, textTransform: "uppercase" }}>Sprint Progress</div>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: COLORS.text }}>45%</div>
            </div>
            <div style={{ width: "100%", height: 6, background: COLORS.bg, borderRadius: 3, overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "45%" }} transition={{ duration: 1, delay: 0.2 }} style={{ height: "100%", background: COLORS.text }} />
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}><b>Sprint 01</b> - Modelagem (Em progresso)</div>
          </div>

          {/* Lead Counter */}
          <div className="bento-card" style={{ padding: 24, background: COLORS.slate, color: "#FFF", display: "flex", flexDirection: "column", gap: 16, cursor: "default", boxShadow: "0 12px 24px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.05em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green || "#22C55E" }} />
              Telemetry Pulse
            </div>
            <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-0.04em", fontFamily: "var(--font-mono)" }}>142</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>Talentos mapeados e injetados em database. Pronto para simulação.</div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div style={{ marginTop: "auto", paddingTop: 32, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 13, color: COLORS.textMuted }}>Dúvidas sobre os fluxos? Consulte a documentação base ou acesse o repositório.</div>
        <div style={{ display: "flex", gap: 24 }}>
          <button style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: COLORS.textDim, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.color = COLORS.text} onMouseLeave={e => e.currentTarget.style.color = COLORS.textDim}>
            <Icons.Book /> GitBook Docs
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: 8, background: "transparent", border: "none", color: COLORS.textDim, fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.color = COLORS.text} onMouseLeave={e => e.currentTarget.style.color = COLORS.textDim}>
            <Icons.Github /> GitHub Repository
          </button>
        </div>
      </div>

    </motion.div>
  );

  return (
    <>
      <EditModeFAB />
      <style>{css}</style>
      <div className="mesh-bg" />
      <div style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
        <header className="glass-nav" style={{ position: "sticky", top: 0, zIndex: 50, padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 28, height: 28, background: COLORS.text, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 700, fontSize: 14 }}>S</div>
            <div style={{ fontWeight: 600, fontSize: 15, letterSpacing: "-0.02em" }}>ServLink WorkOS</div>
            <div style={{ width: 1, height: 16, background: COLORS.border, marginLeft: 8 }} />
            <div style={{ display: "flex", gap: 4, marginLeft: 8 }}>
              <NavTab id="home" label="Hub Station" icon={Icons.Home} active={activeMain === "home"} set={(id) => { setActiveMain(id); setActiveSub(null); }} />
              <NavTab id="core" label="The Engine" icon={Icons.System} active={activeMain === "core"} set={(id) => { setActiveMain(id); setActiveSub("bmc"); }} />
              <NavTab id="growth" label="Strategy Lab" icon={Icons.Growth} active={activeMain === "growth"} set={(id) => { setActiveMain(id); setActiveSub("branding"); }} />
              <NavTab id="tech" label="Technical Stack" icon={Icons.Tech} active={activeMain === "tech"} set={(id) => { setActiveMain(id); setActiveSub("archi"); }} />
              <div style={{ width: 1, height: 16, background: COLORS.border, margin: "0 8px" }} />
              <NavTab id="sprints" label="Ops & Sprints" icon={Icons.Sprints} active={activeMain === "sprints"} set={(id) => { setActiveMain(id); setActiveSub("board"); }} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <SyncIndicator />
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "var(--font-mono)", letterSpacing: "0.05em" }}>PMI 2026.1</div>
          </div>
        </header>

        {activeMain === "core" && (
          <div style={{ padding: "20px 40px 0", maxWidth: 1200, margin: "0 auto 16px", display: "flex", gap: 24, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "16px", width: "100%" }}>
            {[{id: "bmc", label: "Business Model Canvas"}, {id: "proposta", label: "Proposta de Valor"}, {id: "diferencial", label: "Diferencial Competitivo"}, {id: "pitch", label: "Pitch Studio"}].map(t => (
              <div key={t.id} onClick={() => setActiveSub(t.id)} style={{ fontSize: 13, fontWeight: activeSub === t.id ? 600 : 500, color: activeSub === t.id ? COLORS.text : COLORS.textMuted, cursor: "pointer", position: "relative" }}>
                {t.label}
                {activeSub === t.id && <div style={{ position: "absolute", bottom: -17, left: 0, right: 0, height: 2, background: COLORS.text }} />}
              </div>
            ))}
          </div>
        )}

        {activeMain === "growth" && (
          <div style={{ padding: "20px 40px 0", maxWidth: 1200, margin: "0 auto 16px", display: "flex", gap: 24, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "16px", width: "100%" }}>
            {[
              {id: "branding", label: "Branding Canvas"}, 
              {id: "roi", label: "ROI Calculator"},
              {id: "blog", label: "Blog Engine"},
              {id: "partners", label: "Partnerships Board"}
            ].map(t => (
              <div key={t.id} onClick={() => setActiveSub(t.id)} style={{ fontSize: 13, fontWeight: activeSub === t.id ? 600 : 500, color: activeSub === t.id ? COLORS.text : COLORS.textMuted, cursor: "pointer", position: "relative" }}>
                {t.label}
                {activeSub === t.id && <div style={{ position: "absolute", bottom: -17, left: 0, right: 0, height: 2, background: COLORS.text }} />}
              </div>
            ))}
          </div>
        )}

        {activeMain === "sprints" && (
          <div style={{ padding: "20px 40px 0", maxWidth: 1200, margin: "0 auto 16px", display: "flex", gap: 24, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: "16px", width: "100%" }}>
            {[{id: "board", label: "Sprint Board"}].map(t => (
              <div key={t.id} onClick={() => setActiveSub(t.id)} style={{ fontSize: 13, fontWeight: activeSub === t.id ? 600 : 500, color: activeSub === t.id ? COLORS.text : COLORS.textMuted, cursor: "pointer", position: "relative" }}>
                {t.label}
                {activeSub === t.id && <div style={{ position: "absolute", bottom: -17, left: 0, right: 0, height: 2, background: COLORS.text }} />}
              </div>
            ))}
          </div>
        )}

        <main style={{ flex: 1, padding: "40px 60px", maxWidth: 1200, width: "100%", margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            {activeMain === "home" ? renderHome() : null}
            {activeMain === "core" && activeSub === "bmc" ? renderCoreBMC() : null}
            {activeMain === "core" && activeSub === "proposta" ? renderCoreProposta() : null}
            {activeMain === "core" && activeSub === "diferencial" ? renderCoreDiferencial() : null}
            {activeMain === "core" && activeSub === "pitch" ? renderCorePitch() : null}
            
            {activeMain === "growth" && activeSub === "branding" ? renderGrowthBranding() : null}
            {activeMain === "growth" && activeSub === "roi" ? renderGrowthROI() : null}
            {activeMain === "growth" && activeSub === "blog" ? renderGrowthBlog() : null}
            {activeMain === "growth" && activeSub === "partners" ? renderGrowthPartners() : null}

            {activeMain === "tech" ? renderArchitecture() : null}
            {activeMain === "sprints" ? renderSprintsBoard() : null}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}