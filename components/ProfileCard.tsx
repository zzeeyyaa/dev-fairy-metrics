import { motion } from "framer-motion";
import { ExternalLink, MapPin, Calendar, Users, UserPlus } from "lucide-react";
import { GitHubData } from "./types";
import { itemVariants, jellySpring } from "./constants";
import { useMemo } from "react";
import { getRPGStats } from "../lib/gameUtils";

export function ProfileCard({ data }: { data: GitHubData }) {
  const accountAge = useMemo(() => {
    if (!data || !data.user.createdAt) return "";
    const created = new Date(data.user.createdAt);
    const years = Math.floor(
      (Date.now() - created.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    );
    return years <= 0 ? "< 1 year" : `${years} years`;
  }, [data]);

  // --- LOGIKA GAMIFIKASI RPG ---
  const rpgStats = useMemo(() => {
    if (!data) return null;

    const followers = data.user.followers || 0;
    const totalStars = data.stats?.totalStars || 0;
    const totalRepos = data.stats?.totalRepos || 0;
    const totalCommits = data.stats?.totalCommits || 0;
    const topLang = data.languages?.length > 0 ? data.languages[0].name : "Unknown";

    const rpg = getRPGStats(totalCommits, totalStars, totalRepos, followers, topLang);

    return {
      level: rpg.level,
      role: rpg.role,
      exp: { value: followers, percent: rpg.expPercent },
    };
  }, [data]);

  return (
    <motion.section
      className="glass-card p-5 sm:p-7 h-full flex flex-col justify-center relative overflow-hidden w-full"
      variants={itemVariants}
      id="profile-card"
    >
      {/* --- BAGIAN ATAS: PROFIL STANDAR --- */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 relative z-10 w-full">
        <motion.img
          src={data.user.avatarUrl}
          alt={`${data.user.login}'s avatar`}
          className="w-18 h-18 sm:w-24 sm:h-24 rounded-full bg-white shrink-0"
          style={{
            border: "3px solid hsl(var(--fairy-primary))",
            boxShadow: "0 4px 20px hsla(var(--fairy-shadow), 0.3)",
          }}
          whileHover={{ scale: 1.05, rotate: 3 }}
          transition={jellySpring}
        />
        <div className="text-center sm:text-left flex-1 min-w-0 w-full">
          <h2
            className="text-lg sm:text-2xl font-bold tracking-wide truncate"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "hsl(var(--fairy-text))",
            }}
          >
            {data.user.name || data.user.login}
          </h2>
          <a
            href={data.user.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs sm:text-sm hover:underline font-medium mt-0.5"
            style={{ color: "hsl(var(--fairy-text-soft))" }}
          >
            @{data.user.login} <ExternalLink className="w-3 h-3" />
          </a>
          {data.user.bio && (
            <p
              className="mt-2 text-xs sm:text-sm max-w-md font-medium leading-relaxed break-words"
              style={{ color: "hsl(var(--fairy-text-soft))" }}
            >
              {data.user.bio}
            </p>
          )}
          <div
            className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3 text-[11px] sm:text-xs font-bold"
            style={{ color: "hsl(var(--fairy-text-soft))" }}
          >
            {data.user.location && (
              <span className="inline-flex items-center gap-1 opacity-80">
                <MapPin className="w-3 h-3" />
                {data.user.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1 opacity-80">
              <Calendar className="w-3 h-3" />
              {accountAge} on GitHub
            </span>
          </div>
        </div>
      </div>

      {/* --- DIVIDER --- */}
      {rpgStats && (
        <div
          className="w-full h-px my-4 sm:my-5 opacity-25"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--fairy-primary)), transparent)" }}
        />
      )}

      {/* --- BAGIAN BAWAH: GAMIFIKASI RPG (RAMPING & PROPOSIONAL) --- */}
      {rpgStats && (
        <div className="flex flex-row items-center gap-4 w-full relative z-10">

          {/* Badge Level & Role (Dikecilkan ukurannya) */}
          <motion.div
            className="flex flex-col items-center justify-center py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shrink-0 text-center"
            style={{
              backgroundColor: "hsla(var(--fairy-primary), 0.08)",
              border: "1px solid hsla(var(--fairy-primary), 0.2)",
              minWidth: "90px" // Menjaga agar bentuk kotaknya konsisten
            }}
            whileHover={{ y: -2 }}
          >
            <span
              className="text-lg sm:text-xl font-black leading-none"
              style={{ fontFamily: "var(--font-outfit)", color: "hsl(var(--fairy-primary))" }}
            >
              Lv.{rpgStats.level}
            </span>
            <span
              className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider opacity-80 mt-0.5"
              style={{ color: "hsl(var(--fairy-text))" }}
            >
              {rpgStats.role}
            </span>
          </motion.div>

          {/* Progress Bar (Memanjang di sebelahnya) */}
          <div className="flex-1 w-full min-w-0">
            <div className="relative w-full">
              <div className="flex justify-between items-end mb-1 text-xs sm:text-sm">
                <span className="font-bold flex items-center gap-1.5" style={{ color: "hsl(var(--fairy-text-soft))" }}>
                  <span>✨</span> EXP <span className="text-[8px] sm:text-[9px] opacity-60 font-medium">(Followers)</span>
                </span>
                <span className="font-black" style={{ fontFamily: "var(--font-outfit)", color: "hsl(var(--fairy-text))" }}>
                  {rpgStats.exp.value}
                </span>
              </div>
              <div className="w-full h-2.5 sm:h-3 rounded-full overflow-hidden" style={{ backgroundColor: "hsla(var(--fairy-text-soft), 0.12)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg, #f6d365, #fda085)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${rpgStats.exp.percent}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>

        </div>
      )}
    </motion.section>
  );
}