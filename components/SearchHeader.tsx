import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Search, Heart, Loader2, X } from "lucide-react";
import { jellySpring } from "./constants";
import React from "react";

interface SearchHeaderProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  onClear: () => void;
}

export function SearchHeader({
  inputValue,
  setInputValue,
  handleSubmit,
  loading,
  onClear,
}: SearchHeaderProps) {
  return (
    <>
      <motion.header
        className="text-center mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={jellySpring}
      >
        <motion.div
          className="inline-flex items-center gap-2 mb-3"
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles
            className="w-7 h-7 sm:w-9 sm:h-9"
            style={{ color: "hsl(var(--fairy-primary))" }}
          />
          <h1
            className="fairy-heading text-3xl sm:text-4xl md:text-5xl"
            id="app-title"
          >
            Dev Fairy Metrics
          </h1>
          <Sparkles
            className="w-7 h-7 sm:w-9 sm:h-9"
            style={{ color: "hsl(var(--fairy-secondary))" }}
          />
        </motion.div>
        <p
          className="text-sm sm:text-base"
          style={{ color: "hsl(var(--fairy-text-soft))" }}
        >
          ✨ your magical GitHub stats dashboard ✨
        </p>
      </motion.header>

      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-lg mb-8 sm:mb-12 flex gap-3"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ ...jellySpring, delay: 0.15 }}
        id="search-form"
      >
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
            style={{ color: "hsl(var(--fairy-text-soft))" }}
          />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="enter github username..."
            className="fairy-input pl-12 pr-4"
            id="username-input"
            aria-label="GitHub username"
            disabled={loading}
          />
          <AnimatePresence>
            {inputValue.length > 0 && (
              <motion.button
                type="button" // Wajib agar tidak memicu submit form
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setInputValue("");
                  onClear();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-500/10 transition-colors cursor-pointer"
                aria-label="Clear input"
                disabled={loading}
              >
                <X
                  className="w-4 h-4"
                  style={{ color: "hsl(var(--fairy-text-soft))" }}
                />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          type="submit"
          className="fairy-btn flex items-center gap-2 whitespace-nowrap"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading || !inputValue.trim()}
          id="search-button"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Heart className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">
            {loading ? "Loading..." : "Fetch ✨"}
          </span>
        </motion.button>
      </motion.form>
    </>
  );
}
