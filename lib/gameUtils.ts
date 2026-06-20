/**
 * Shared RPG Gamification calculation logic for Dev Fairy Metrics.
 */

export interface RPGStats {
  level: number;
  role: string;
  expValue: number;
  expPercent: number;
}

/**
 * Calculates user RPG level based on commits, stars, repos, and followers.
 */
export function calculateLevel(
  commits: number = 0,
  stars: number = 0,
  repos: number = 0,
  followers: number = 0
): number {
  const points = (commits * 0.3) + (stars * 3) + (repos * 2) + (followers * 1.5);
  return Math.min(99, Math.max(1, Math.floor(Math.sqrt(points / 15))));
}

/**
 * Determines the player class / fairy role based on their primary language and level.
 */
export function getPlayerClass(topLang: string = "Unknown", level: number = 1): string {
  const normalizedLang = topLang.trim().toLowerCase();

  if (normalizedLang === "javascript" || normalizedLang === "typescript") {
    if (level < 5) return "Apprentice";
    if (level < 15) return "Sorceress";
    if (level < 30) return "Grandmaster";
    return "Lord of Script";
  }

  if (normalizedLang === "python") {
    if (level < 5) return "Apprentice";
    if (level < 15) return "Witch";
    if (level < 30) return "Alchemist";
    return "Archmage";
  }

  if (normalizedLang === "go") {
    if (level < 5) return "Apprentice";
    if (level < 15) return "Sorceress";
    if (level < 30) return "Grandmaster";
    return "Archmage";
  }

  if (normalizedLang === "html" || normalizedLang === "css") {
    if (level < 5) return "Sprite";
    if (level < 15) return "Fairy";
    if (level < 30) return "Alchemist";
    return "Archmage";
  }

  if (normalizedLang === "java" || normalizedLang === "c#") {
    if (level < 5) return "Apprentice";
    if (level < 15) return "Sorceress";
    if (level < 30) return "Grandmaster";
    return "Archmage";
  }

  if (normalizedLang === "c" || normalizedLang === "c++" || normalizedLang === "rust") {
    if (level < 5) return "Apprentice";
    if (level < 15) return "Sorceress";
    if (level < 30) return "Grandmaster";
    return "Lord of Script";
  }

  // Default / Other languages
  if (level < 5) return "Sprite";
  if (level < 15) return "Fairy";
  if (level < 30) return "Alchemist";
  return "Archmage";
}

/**
 * Calculates experience percentage (0-100) based on followers.
 */
export function getExpPercent(followers: number = 0): number {
  return Math.min((followers / 50) * 100, 100);
}

/**
 * Helper to get all RPG stats at once.
 */
export function getRPGStats(
  commits: number = 0,
  stars: number = 0,
  repos: number = 0,
  followers: number = 0,
  topLang: string = "Unknown"
): RPGStats {
  const level = calculateLevel(commits, stars, repos, followers);
  const role = getPlayerClass(topLang, level);
  const expPercent = getExpPercent(followers);

  return {
    level,
    role,
    expValue: followers,
    expPercent,
  };
}

/**
 * Returns available character classes / roles for a given level.
 */
export function getAvailableClassesForLevel(level: number): string[] {
  return getLevelTierInfo(level).roles;
}

export interface LevelTierInfo {
  tier: string;
  range: string;
  roles: string[];
  description: string;
}

export function getLevelTierInfo(level: number): LevelTierInfo {
  if (level < 5) {
    return {
      tier: "Tier 1: Novice",
      range: "Lv. 1 - 4",
      roles: ["Apprentice", "Sprite"],
      description: "Learning the basics of elemental magic."
    };
  }
  if (level < 15) {
    return {
      tier: "Tier 2: Adept",
      range: "Lv. 5 - 14",
      roles: ["Sorceress", "Witch", "Fairy"],
      description: "Casting spells and managing repository wards."
    };
  }
  if (level < 30) {
    return {
      tier: "Tier 3: Expert",
      range: "Lv. 15 - 29",
      roles: ["Grandmaster", "Alchemist"],
      description: "Mastering concurrent flows and layout transformations."
    };
  }
  return {
    tier: "Tier 4: Master",
    range: "Lv. 30 - 99",
    roles: ["Lord of Script", "Archmage"],
    description: "Legendary status, weaver of the ultimate digital fabrics."
  };
}
