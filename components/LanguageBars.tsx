import { motion } from "framer-motion";
import { GitHubData } from "./types";
import { jellySpring } from "./constants";
import { getLangColor } from "../lib/utils";

export function LanguageBars({
  languages,
  limit = 10,
}: {
  languages: GitHubData["languages"];
  limit?: number;
}) {
  const topLangs = languages.slice(0, limit);

  return (
    <div className="space-y-4">
      {topLangs.map((lang, i) => (
        <motion.div
          key={lang.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...jellySpring, delay: i * 0.06 }}
          className="relative"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className="text-[13px] font-semibold inline-flex items-center gap-2 tracking-wide"
              style={{ color: "hsl(var(--fairy-text))" }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
                style={{
                  background: getLangColor(lang.name),
                  boxShadow: `0 0 8px ${getLangColor(lang.name)}80`,
                }}
              />
              {lang.name}
            </span>
            <span
              className="text-xs font-bold tracking-wider"
              style={{ color: "hsl(var(--fairy-text))" }}
            >
              {lang.percentage}%
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-slate-100/50 dark:bg-slate-800/30 overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${getLangColor(lang.name)}ee, ${getLangColor(lang.name)}99)`,
                boxShadow: `0 2px 4px ${getLangColor(lang.name)}40`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(lang.percentage, 1)}%` }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
            {/* Glow dot at the end of the bar */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-md"
              style={{
                boxShadow: `0 0 6px 2px ${getLangColor(lang.name)}`,
              }}
              initial={{ left: 0, opacity: 0 }}
              animate={{
                left: `calc(${Math.max(lang.percentage, 1)}% - 6px)`,
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.34, 1.56, 0.64, 1],
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
