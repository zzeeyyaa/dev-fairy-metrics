import { motion, AnimatePresence } from "framer-motion";
import { Palette } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { THEMES, jellySpring } from "./constants";
import { toast } from "sonner";

interface ThemePickerProps {
  theme: string;
  setTheme: (theme: string) => void;
  showThemePicker: boolean;
  setShowThemePicker: (show: boolean) => void;
}

export function ThemePicker({
  theme,
  setTheme,
  showThemePicker,
  setShowThemePicker,
}: ThemePickerProps) {
  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 z-50 glass-card w-12 h-12 flex items-center justify-center cursor-pointer"
        style={{ borderRadius: "50%" }}
        onClick={() => setShowThemePicker(!showThemePicker)}
        whileHover={{ scale: 1.15, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle theme picker"
        id="theme-toggle"
      >
        <Palette
          className="w-5 h-5"
          style={{ color: "hsl(var(--fairy-primary))" }}
        />
      </motion.button>

      <AnimatePresence>
        {showThemePicker && (
          <motion.div
            className="fixed bottom-20 right-6 z-50 glass-card p-4"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={jellySpring}
            id="theme-picker"
          >
            <p
              className="text-xs font-medium mb-3"
              style={{
                fontFamily: "var(--font-outfit)",
                color: "hsl(var(--fairy-text-soft))",
              }}
            >
              ✨ Choose Theme
            </p>
            <div className="flex gap-2">
              {THEMES.map((t) => (
                <Tooltip.Root key={t.class}>
                  <Tooltip.Trigger asChild>
                    <button
                      className={`theme-dot ${theme === t.class ? "active" : ""}`}
                      style={{ background: t.color }}
                      onClick={() => {
                        setTheme(t.class);
                        toast.success(`🎨 ${t.name} theme activated!`);
                      }}
                      aria-label={`${t.name} theme`}
                    />
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="glass-pill text-xs font-medium"
                      style={{
                        color: "hsl(var(--fairy-text))",
                        fontSize: "0.75rem",
                        padding: "6px 12px",
                      }}
                      sideOffset={8}
                    >
                      {t.name}
                      <Tooltip.Arrow
                        style={{ fill: "rgba(255,255,255,0.5)" }}
                      />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
