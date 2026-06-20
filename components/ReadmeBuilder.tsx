import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Copy } from "lucide-react";
import { itemVariants } from "./constants";
import { getAvailableClassesForLevel, getLevelTierInfo } from "../lib/gameUtils";

interface ReadmeBuilderProps {
  cardType: "stats" | "languages";
  setCardType: (type: "stats" | "languages") => void;
  statsLayout: "classic" | "rpg";
  setStatsLayout: (layout: "classic" | "rpg") => void;
  widgetMode: "light" | "dark";
  setWidgetMode: (mode: "light" | "dark") => void;
  widgetTheme: string;
  setWidgetTheme: (theme: string) => void;
  widgetLayout: "donut" | "bars" | "compact" | "affinity";
  setWidgetLayout: (layout: "donut" | "bars" | "compact" | "affinity") => void;
  widgetHideTitle: boolean;
  setWidgetHideTitle: (hide: boolean) => void;
  widgetHideBorder: boolean;
  setWidgetHideBorder: (hide: boolean) => void;
  widgetTitle: string;
  setWidgetTitle: (title: string) => void;
  widgetLangsCount: number;
  setWidgetLangsCount: (count: number) => void;
  widgetRpgClass: string;
  setWidgetRpgClass: (c: string) => void;
  userLevel: number;
  previewUrl: string;
  markdownCode: string;
  htmlCode: string;
  handleCopy: (text: string, format: "markdown" | "html") => void;
  copiedFormat: "markdown" | "html" | null;
}

export function ReadmeBuilder({
  cardType,
  setCardType,
  statsLayout,
  setStatsLayout,
  widgetMode,
  setWidgetMode,
  widgetTheme,
  setWidgetTheme,
  widgetLayout,
  setWidgetLayout,
  widgetHideTitle,
  setWidgetHideTitle,
  widgetHideBorder,
  setWidgetHideBorder,
  widgetTitle,
  setWidgetTitle,
  widgetLangsCount,
  setWidgetLangsCount,
  widgetRpgClass,
  setWidgetRpgClass,
  userLevel,
  previewUrl,
  markdownCode,
  htmlCode,
  handleCopy,
  copiedFormat,
}: ReadmeBuilderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const lightThemes = [
    { id: "cotton-candy", name: "Cotton Candy", color: "#e8a0bf" },
    { id: "strawberry", name: "Strawberry", color: "#e88a9a" },
    { id: "lavender", name: "Lavender", color: "#b39ddb" },
    { id: "mint", name: "Mint", color: "#80cbc4" },
    { id: "peach", name: "Peach", color: "#f4b183" },
  ];

  const darkThemes = [
    { id: "dark-fairy", name: "Dark Fairy", color: "#7e57c2" },
    { id: "cotton-candy-dark", name: "Cotton Candy (Dark)", color: "#e8a0bf" },
    { id: "strawberry-dark", name: "Strawberry (Dark)", color: "#e88a9a" },
    { id: "lavender-dark", name: "Lavender (Dark)", color: "#b39ddb" },
    { id: "mint-dark", name: "Mint (Dark)", color: "#80cbc4" },
    { id: "peach-dark", name: "Peach (Dark)", color: "#f4b183" },
  ];

  const themesToShow = widgetMode === "light" ? lightThemes : darkThemes;
  return (
    <motion.section
      className="glass-card p-6 sm:p-8 mb-6"
      variants={itemVariants}
      id="readme-builder"
    >
      <h3
        className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2"
        style={{
          fontFamily: "var(--font-outfit)",
          color: "hsl(var(--fairy-text))",
        }}
      >
        <Sparkles
          className="w-5 h-5"
          style={{ color: "hsl(var(--fairy-primary))" }}
        />
        Profile README Cards Builder 🧚✨
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customizer controls */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Type Selection */}
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-2"
              style={{ color: "hsl(var(--fairy-text-soft))" }}
            >
              Card Template
            </label>
            <div className="flex gap-2 p-1 glass-pill bg-white/20">
              <button
                type="button"
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${cardType === "stats"
                  ? "bg-white text-pink-600 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setCardType("stats")}
              >
                📊 Stats Card
              </button>
              <button
                type="button"
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${cardType === "languages"
                  ? "bg-white text-pink-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setCardType("languages")}
              >
                🔤 Languages
              </button>
            </div>
          </div>

          {/* Widget Mode Selection */}
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-2"
              style={{ color: "hsl(var(--fairy-text-soft))" }}
            >
              Widget Mode
            </label>
            <div className="flex gap-2 p-1 glass-pill bg-white/20">
              <button
                type="button"
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${widgetMode === "light"
                  ? "bg-white text-pink-600 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setWidgetMode("light")}
              >
                ☀️ Light Mode
              </button>
              <button
                type="button"
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${widgetMode === "dark"
                  ? "bg-white text-pink-600 shadow-sm font-bold"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
                onClick={() => setWidgetMode("dark")}
              >
                🌙 Dark Mode
              </button>
            </div>
          </div>

          {/* Theme Selection */}
          <div>
            <label
              className="text-xs font-semibold uppercase tracking-wider block mb-2"
              style={{ color: "hsl(var(--fairy-text-soft))" }}
            >
              Widget Theme
            </label>
            <div className="grid grid-cols-6 gap-2">
              {themesToShow.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`h-9 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${widgetTheme === t.id
                    ? "border-pink-500 scale-105"
                    : "border-transparent opacity-85 hover:opacity-100"
                    }`}
                  style={{ background: t.color }}
                  onClick={() => setWidgetTheme(t.id)}
                  title={t.name}
                >
                  {widgetTheme === t.id && "✨"}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Options for Languages Card */}
          {cardType === "languages" && (
            <>
              {/* Layout */}
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-wider block mb-2"
                  style={{ color: "hsl(var(--fairy-text-soft))" }}
                >
                  Layout Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "donut", label: "✨ Fairy Bars" },
                    { id: "bars", label: "📊 Normal Bars" },
                    { id: "compact", label: "🍬 Compact" },
                    { id: "affinity", label: "🔮 Magic Circle" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${widgetLayout === l.id
                        ? "bg-pink-100 border-pink-300 text-pink-700 font-bold"
                        : "bg-white/40 border-slate-200 text-slate-700 hover:bg-white/60"
                        }`}
                      onClick={() => setWidgetLayout(l.id as any)}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Languages Count */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span style={{ color: "hsl(var(--fairy-text-soft))" }}>
                    Max Languages
                  </span>
                  <span style={{ color: "hsl(var(--fairy-text))" }}>
                    {widgetLangsCount}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={widgetLangsCount}
                  onChange={(e) => setWidgetLangsCount(parseInt(e.target.value))}
                  className="w-full accent-pink-500 bg-slate-200 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </>
          )}

          {/* Specific Options for Stats Card */}
          {cardType === "stats" && (
            <div className="space-y-4">
              {/* Card Style */}
              <div>
                <label
                  className="text-xs font-semibold uppercase tracking-wider block mb-2"
                  style={{ color: "hsl(var(--fairy-text-soft))" }}
                >
                  Card Style
                </label>
                <div className="flex gap-2">
                  {[
                    { id: "classic", label: "📊 Classic Stats" },
                    { id: "rpg", label: "✨ Gamified Stats" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${statsLayout === s.id
                        ? "bg-pink-100 border-pink-300 text-pink-700 font-bold"
                        : "bg-white/40 border-slate-200 text-slate-700 hover:bg-white/60"
                        }`}
                      onClick={() => setStatsLayout(s.id as any)}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {statsLayout === "rpg" && (
                <div className="space-y-2">
                  <div className="relative">
                    <label
                      className="text-xs font-semibold uppercase tracking-wider block mb-1.5"
                      style={{ color: "hsl(var(--fairy-text-soft))" }}
                    >
                      Select Role / Class 🔮
                    </label>
                    
                    {/* Custom Dropdown Trigger */}
                    <button
                      type="button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="w-full text-xs p-2.5 rounded-xl border border-pink-200/50 bg-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/80 transition-all text-slate-700 font-semibold flex items-center justify-between cursor-pointer animate-fade-in"
                    >
                      <span>{widgetRpgClass ? widgetRpgClass : "✨ Default (Auto-detect)"}</span>
                      <svg
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Custom Dropdown Menu */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <>
                          {/* Close backdrop */}
                          <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setDropdownOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute left-0 right-0 z-50 mt-1.5 rounded-xl border border-pink-100 bg-white/95 backdrop-blur-md shadow-xl max-h-60 overflow-y-auto p-1.5 space-y-0.5"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setWidgetRpgClass("");
                                setDropdownOpen(false);
                              }}
                              className={`w-full text-left text-xs p-2 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                                widgetRpgClass === ""
                                  ? "bg-pink-50 text-pink-700 font-bold"
                                  : "text-slate-600 hover:bg-pink-50/50 hover:text-slate-800"
                              }`}
                            >
                              <span>✨ Default (Auto-detect)</span>
                              {widgetRpgClass === "" && <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />}
                            </button>

                            {getAvailableClassesForLevel(userLevel).map((cls) => (
                              <button
                                key={cls}
                                type="button"
                                onClick={() => {
                                  setWidgetRpgClass(cls);
                                  setDropdownOpen(false);
                                }}
                                className={`w-full text-left text-xs p-2 rounded-lg transition-all flex items-center justify-between cursor-pointer ${
                                  widgetRpgClass === cls
                                    ? "bg-pink-50 text-pink-700 font-bold"
                                    : "text-slate-600 hover:bg-pink-50/50 hover:text-slate-800"
                                }`}
                              >
                                <span>{cls}</span>
                                {widgetRpgClass === cls && <Check className="w-3.5 h-3.5 text-pink-600 shrink-0" />}
                              </button>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Tier Description */}
                  <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100/50 text-[11px] leading-relaxed text-pink-700/80 animate-fade-in">
                    <div className="font-bold flex justify-between">
                      <span>{getLevelTierInfo(userLevel).tier}</span>
                      <span className="font-mono">{getLevelTierInfo(userLevel).range}</span>
                    </div>
                    <div className="mt-0.5 font-medium">{getLevelTierInfo(userLevel).description}</div>
                  </div>
                </div>
              )}

              {statsLayout === "classic" && (
                <div>
                  <label
                    className="text-xs font-semibold uppercase tracking-wider block mb-1"
                    style={{ color: "hsl(var(--fairy-text-soft))" }}
                  >
                    Custom Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={widgetTitle}
                    onChange={(e) => setWidgetTitle(e.target.value)}
                    placeholder="e.g. My Magical Stats"
                    className="w-full text-xs p-2.5 rounded-xl border border-pink-200/50 bg-white/50 focus:outline-none focus:border-pink-400 focus:bg-white/80 transition-all text-slate-700 placeholder-slate-400"
                  />
                </div>
              )}
            </div>
          )}

          {/* Toggle Options */}
          <div className="flex flex-col gap-2 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={widgetHideTitle}
                onChange={(e) => setWidgetHideTitle(e.target.checked)}
                className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 border-gray-300"
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "hsl(var(--fairy-text))" }}
              >
                Hide Title Header
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={widgetHideBorder}
                onChange={(e) => setWidgetHideBorder(e.target.checked)}
                className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 border-gray-300"
              />
              <span
                className="text-xs font-semibold"
                style={{ color: "hsl(var(--fairy-text))" }}
              >
                Hide Outer Border
              </span>
            </label>
          </div>
        </div>

        {/* Right: Live Preview and Code outputs */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          {/* Preview Box */}
          <div className="space-y-2">
            <span
              className="text-xs font-semibold uppercase tracking-wider block"
              style={{ color: "hsl(var(--fairy-text-soft))" }}
            >
              Live Preview
            </span>
            <div
              className="glass-card flex items-center justify-center p-6 border-2 border-dashed border-pink-200/40 relative overflow-hidden bg-white/10"
              style={{ minHeight: "260px" }}
            >
              {previewUrl ? (
                <img
                  key={previewUrl}
                  src={previewUrl}
                  alt="GitHub README Card Preview"
                  className="max-w-full h-auto rounded-xl drop-shadow-md transition-all duration-300"
                  style={{ maxHeight: "230px" }}
                />
              ) : (
                <span className="text-xs text-slate-400">Loading preview...</span>
              )}
            </div>
          </div>

          {/* Code Output Blocks */}
          <div className="space-y-4">
            {/* Markdown Output */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "hsl(var(--fairy-text-soft))" }}
                >
                  Markdown (Perfect for README.md)
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(markdownCode, "markdown")}
                  className="text-xs py-1 px-2.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedFormat === "markdown" ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </motion.button>
              </div>
              <pre className="text-xs p-3 rounded-xl bg-slate-900/90 text-slate-100 overflow-x-auto whitespace-pre font-mono max-w-full">
                {markdownCode}
              </pre>
            </div>

            {/* HTML Output */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "hsl(var(--fairy-text-soft))" }}
                >
                  HTML (For alignment/sizing control)
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(htmlCode, "html")}
                  className="text-xs py-1 px-2.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  {copiedFormat === "html" ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Code
                    </>
                  )}
                </motion.button>
              </div>
              <pre className="text-xs p-3 rounded-xl bg-slate-900/90 text-slate-100 overflow-x-auto whitespace-pre font-mono max-w-full">
                {htmlCode}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
