import { motion } from "framer-motion";
import { FolderGit2, Star, GitFork, Code2 } from "lucide-react";
import { GitHubData } from "./types";
import { containerVariants, itemVariants, cardHover } from "./constants";

export function StatsGrid({ data }: { data: GitHubData }) {
  return (
    <motion.section
      className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4"
      variants={containerVariants}
      id="stats-grid"
    >
      {[
        {
          icon: FolderGit2,
          label: "Repos",
          value: data.stats.totalRepos,
          color: "hsl(var(--fairy-primary))",
        },
        {
          icon: Star,
          label: "Stars",
          value: data.stats.totalStars,
          color: "hsl(var(--fairy-secondary))",
        },
        {
          icon: GitFork,
          label: "Forks",
          value: data.stats.totalForks,
          color: "hsl(var(--fairy-accent))",
        },
        {
          icon: Code2,
          label: "Langs",
          value: data.stats.totalLanguages,
          color: "hsl(var(--fairy-accent-secondary))",
        },
      ].map((stat, i) => (
        <motion.div key={stat.label} variants={itemVariants} className="h-full w-full">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2, // staggered floating
            }}
            whileHover={{ scale: 1.05, y: -8 }}
            className="glass-card flex items-center gap-3 px-4 py-3 cursor-pointer hover:shadow-lg transition-shadow h-full w-full"
            style={{ borderRadius: "20px" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon
                className="w-4 h-4"
                style={{ color: stat.color }}
              />
            </div>
            <div className="flex flex-col pr-2">
              <span
                className="text-[10px] uppercase tracking-widest font-bold opacity-70 leading-none mb-1"
                style={{ color: "hsl(var(--fairy-text-soft))" }}
              >
                {stat.label}
              </span>
              <span
                className="text-xl font-black leading-none"
                style={{ color: "hsl(var(--fairy-text))", fontFamily: "var(--font-outfit)" }}
              >
                {stat.value}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </motion.section>
  );
}
