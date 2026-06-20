import { motion } from "framer-motion";
import { Sparkles, Trophy, GitCommit, Star, FolderGit2, Users, BookOpen } from "lucide-react";
import { itemVariants } from "./constants";

export function LevelGuide() {
  const formulas = [
    { icon: GitCommit, label: "Commits", points: "+0.3 XP", desc: "Steady coding practice", color: "#f472b6" },
    { icon: Star, label: "Stars", points: "+3.0 XP", desc: "Community appreciation", color: "#f6d365" },
    { icon: FolderGit2, label: "Repos", points: "+2.0 XP", desc: "Creation of magic items", color: "#c084fc" },
    { icon: Users, label: "Followers", points: "+1.5 XP", desc: "Guild members recruited", color: "#818cf8" },
  ];

  const ranks = [
    { range: "Lv. 1 - 4", title: "Apprentice / Sprite", desc: "Learning the basics of elemental magic." },
    { range: "Lv. 5 - 14", title: "Sorceress / Witch / Fairy", desc: "Casting spells and managing repository wards." },
    { range: "Lv. 15 - 29", title: "Grandmaster / Alchemist", desc: "Mastering concurrent flows and layout transformations." },
    { range: "Lv. 30 - 99", title: "Lord of Script / Archmage", desc: "Legendary status, weaver of the ultimate digital fabrics." },
  ];

  return (
    <motion.section
      className="glass-card p-6 sm:p-8 mb-6 relative overflow-hidden"
      variants={itemVariants}
      id="level-guide"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <h3
        className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2"
        style={{
          fontFamily: "var(--font-outfit)",
          color: "hsl(var(--fairy-text))",
        }}
      >
        <BookOpen
          className="w-5 h-5"
          style={{ color: "hsl(var(--fairy-primary))" }}
        />
        Grimoire of Leveling Tiers
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
        {/* Left: Formula Breakdown */}
        <div className="md:col-span-5 space-y-4">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: "hsl(var(--fairy-text-soft))" }}>
              Leveling Curve
            </h4>
            <div className="text-sm font-semibold mb-3 flex items-center gap-1.5" style={{ color: "hsl(var(--fairy-text))" }}>
              <span>Formula:</span>
              <code className="px-2 py-0.5 rounded bg-black/10 font-mono text-xs">
                Level = Math.floor(Math.sqrt(XP / 15))
              </code>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "hsl(var(--fairy-text-soft))" }}>
              Your level progress uses a quadratic scale, making higher levels significantly more challenging to unlock.
            </p>
          </div>

          <div className="space-y-2.5">
            {formulas.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/20 border border-white/10"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${f.color}15` }}
                >
                  <f.icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold" style={{ color: "hsl(var(--fairy-text))" }}>{f.label}</span>
                    <span className="text-xs font-extrabold" style={{ color: f.color }}>{f.points}</span>
                  </div>
                  <p className="text-[10px]" style={{ color: "hsl(var(--fairy-text-soft))" }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Rank Progression Tiers */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider block" style={{ color: "hsl(var(--fairy-text-soft))" }}>
            Class Tiers & Mastery Progression
          </h4>
          
          <div className="space-y-3">
            {ranks.map((r, index) => (
              <div
                key={r.range}
                className="flex gap-4 p-3 rounded-2xl bg-white/30 border border-white/20 hover:bg-white/40 transition-colors"
              >
                {/* Level range badge */}
                <div
                  className="px-2.5 py-1 rounded-xl font-black text-xs h-fit shrink-0 text-center"
                  style={{
                    backgroundColor: "hsla(var(--fairy-primary), 0.12)",
                    color: "hsl(var(--fairy-primary))",
                    fontFamily: "var(--font-outfit)",
                    minWidth: "70px"
                  }}
                >
                  {r.range}
                </div>

                {/* Rank Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold" style={{ color: "hsl(var(--fairy-text))" }}>
                      {r.title}
                    </span>
                    {index === 3 && (
                      <Trophy className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-[10px] leading-normal" style={{ color: "hsl(var(--fairy-text-soft))" }}>
                    {r.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
