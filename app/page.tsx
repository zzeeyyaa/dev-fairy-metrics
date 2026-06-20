"use client";

import { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Code2, Sparkles, Sun, Moon } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast } from "sonner";

import { SPARKLE_POSITIONS, jellySpring, containerVariants, itemVariants } from "../components/constants";
import { SearchHeader } from "../components/SearchHeader";
import { ThemePicker } from "../components/ThemePicker";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { ProfileCard } from "../components/ProfileCard";
import { StatsGrid } from "../components/StatsGrid";
import { LanguageBars } from "../components/LanguageBars";
import { TopRepos } from "../components/TopRepos";
import { ReadmeBuilder } from "../components/ReadmeBuilder";

import { useGitHubData } from "../hooks/useGitHubData";
import { useWidgetBuilder } from "../hooks/useWidgetBuilder";

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl animate-pulse">✨</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const { inputValue, setInputValue, data, loading, error, handleSubmit } = useGitHubData();
  const [theme, setTheme] = useState("theme-dark-fairy");
  const [lastLightTheme, setLastLightTheme] = useState("theme-cotton-candy");
  const [showThemePicker, setShowThemePicker] = useState(false);

  const builderState = useWidgetBuilder(data);

  useEffect(() => {
    const body = document.body;
    const classes = Array.from(body.classList);
    classes.forEach((c) => {
      if (c.startsWith("theme-")) {
        body.classList.remove(c);
      }
    });
    body.classList.add(theme);
  }, [theme]);

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme !== "theme-dark-fairy") {
      setLastLightTheme(newTheme);
    }
  };

  const toggleDarkMode = () => {
    if (theme === "theme-dark-fairy") {
      setTheme(lastLightTheme);
      toast.success("☀️ Light Mode theme activated!");
    } else {
      setLastLightTheme(theme);
      setTheme("theme-dark-fairy");
      toast.success("🔮 Dark Mode theme activated!");
    }
  };

  return (
    <Tooltip.Provider delayDuration={200}>
        <div className="min-h-screen relative">
          <div className="blob blob-1" aria-hidden="true" />
          <div className="blob blob-2" aria-hidden="true" />
          <div className="blob blob-3" aria-hidden="true" />

          {builderState.mounted && (
            <div className="sparkle-container" aria-hidden="true">
              {SPARKLE_POSITIONS.map((pos, i) => (
                <div
                  key={i}
                  className="sparkle"
                  style={{
                    left: pos.left,
                    top: pos.top,
                    animationDelay: pos.delay,
                    width: pos.size,
                    height: pos.size,
                  }}
                />
              ))}
            </div>
          )}

          <main className="relative z-10 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12 max-w-5xl mx-auto">
            <SearchHeader 
              inputValue={inputValue}
              setInputValue={setInputValue}
              handleSubmit={handleSubmit}
              loading={loading}
            />

            <ThemePicker 
              theme={theme}
              setTheme={handleThemeChange}
              showThemePicker={showThemePicker}
              setShowThemePicker={setShowThemePicker}
            />

            <motion.button
              className="fixed bottom-6 right-[84px] z-50 glass-card w-12 h-12 flex items-center justify-center cursor-pointer"
              style={{ borderRadius: "50%" }}
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode theme"
              id="dark-mode-toggle"
            >
              {theme === "theme-dark-fairy" ? (
                <Sun className="w-5 h-5" style={{ color: "hsl(var(--fairy-primary))" }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: "hsl(var(--fairy-primary))" }} />
              )}
            </motion.button>

            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  className="w-full max-w-4xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <LoadingSkeleton />
                </motion.div>
              )}

              {error && !loading && (
                <motion.div
                  key="error"
                  className="glass-card p-8 text-center max-w-md w-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={jellySpring}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <AlertCircle
                      className="w-12 h-12 mx-auto mb-4"
                      style={{ color: "hsl(var(--fairy-primary))" }}
                    />
                  </motion.div>
                  <p
                    className="text-lg font-semibold mb-2"
                    style={{
                      fontFamily: "var(--font-outfit)",
                      color: "hsl(var(--fairy-text))",
                    }}
                  >
                    Oopsie! 🥺
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "hsl(var(--fairy-text-soft))" }}
                  >
                    {error}
                  </p>
                </motion.div>
              )}

              {data && !loading && (
                <motion.div
                  key="data"
                  className="w-full max-w-4xl"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                      <ProfileCard data={data} />
                    </div>
                    <div className="lg:col-span-1">
                      <motion.section
                        className="glass-card p-6 flex flex-col h-full"
                        variants={itemVariants}
                        id="language-bars"
                      >
                        <h3
                          className="text-lg font-bold mb-4 flex items-center gap-2"
                          style={{
                            fontFamily: "var(--font-outfit)",
                            color: "hsl(var(--fairy-text))",
                          }}
                        >
                          <Sparkles
                            className="w-5 h-5"
                            style={{ color: "hsl(var(--fairy-secondary))" }}
                          />
                          Language Breakdown
                        </h3>
                        <div className="flex-1 overflow-hidden flex flex-col justify-center">
                          <LanguageBars languages={data.languages} limit={5} />
                        </div>
                      </motion.section>
                    </div>
                  </div>

                  <div className="w-full mb-6">
                    <StatsGrid data={data} />
                  </div>

                  <div className="w-full mb-6">
                    <TopRepos data={data} />
                  </div>

                  <ReadmeBuilder {...builderState} />

                  <motion.footer
                    className="text-center mt-10 mb-4"
                    variants={itemVariants}
                  >
                    <p
                      className="text-xs"
                      style={{ color: "hsl(var(--fairy-text-soft))" }}
                    >
                      made with 💖 by{" "}
                      <a
                        href="https://github.com/zzeeyyaa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                        style={{ color: "hsl(var(--fairy-primary))" }}
                      >
                        zzeeyyaa
                      </a>{" "}
                      · Dev Fairy Metrics ✨
                    </p>
                  </motion.footer>
                </motion.div>
              )}
            </AnimatePresence>

            {!data && !loading && !error && (
              <motion.div
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl mb-4"
                >
                  🧚
                </motion.div>
                <p
                  className="text-base"
                  style={{
                    fontFamily: "var(--font-outfit)",
                    color: "hsl(var(--fairy-text-soft))",
                  }}
                >
                  Enter a GitHub username to see the magic ✨
                </p>
              </motion.div>
            )}
          </main>
        </div>
      </Tooltip.Provider>
  );
}
