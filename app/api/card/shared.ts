import { type NextRequest } from "next/server";

/* ═══════════════════════════════════════════════════
   Shared GitHub fetcher & theme config for SVG cards
   ═══════════════════════════════════════════════════ */

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
}

export interface CardTheme {
  name: string;
  bg: string;
  bgGradientStart: string;
  bgGradientEnd: string;
  cardBg: string;
  cardBorder: string;
  title: string;
  text: string;
  textSoft: string;
  accent: string;
  accentSecondary: string;
  glow: string;
}

export const THEMES: Record<string, CardTheme> = {
  "cotton-candy": {
    name: "Cotton Candy",
    bg: "#fff5f8",
    bgGradientStart: "#ffe3ec", // Pink pastel selembut awan
    bgGradientEnd: "#f3e8ff",   // Lilac manis
    cardBg: "rgba(255, 255, 255, 0.82)",
    cardBorder: "#fbcfe8",
    title: "#db2777",           // Kontras tinggi & berbobot
    text: "#4c1d37",
    textSoft: "#9d788e",
    accent: "#f472b6",
    accentSecondary: "#c084fc",
    glow: "#f472b6",
  },
  strawberry: {
    name: "Strawberry",
    bg: "#fff5f5",
    bgGradientStart: "#ffe4e6", // Merah muda stroberi segar
    bgGradientEnd: "#ffedd5",   // Peach hangat
    cardBg: "rgba(255, 255, 255, 0.82)",
    cardBorder: "#fecdd3",
    title: "#e11d48",
    text: "#4c0519",
    textSoft: "#9f7882",
    accent: "#fb7185",
    accentSecondary: "#fb923c",
    glow: "#fb7185",
  },
  lavender: {
    name: "Lavender",
    bg: "#f8f5ff",
    bgGradientStart: "#e0e7ff", // Perpaduan biru indigo muda
    bgGradientEnd: "#fae8ff",   // Lavender
    cardBg: "rgba(255, 255, 255, 0.82)",
    cardBorder: "#c7d2fe",
    title: "#4f46e5",
    text: "#1e1b4b",
    textSoft: "#7c729c",
    accent: "#818cf8",
    accentSecondary: "#e879f9",
    glow: "#818cf8",
  },
  mint: {
    name: "Mint",
    bg: "#f4fcf9",
    bgGradientStart: "#ccfbf1", // Hijau toska mint segar
    bgGradientEnd: "#dcfce7",   // Hijau daun pastel
    cardBg: "rgba(255, 255, 255, 0.82)",
    cardBorder: "#99f6e4",
    title: "#0d9488",
    text: "#115e59",
    textSoft: "#588f8b",
    accent: "#2dd4bf",
    accentSecondary: "#4ade80",
    glow: "#2dd4bf",
  },
  peach: {
    name: "Peach",
    bg: "#fff8f5",
    bgGradientStart: "#ffedd5", // Jingga aprikot
    bgGradientEnd: "#ffe4e6",   // Sentuhan rose pastel
    cardBg: "rgba(255, 255, 255, 0.82)",
    cardBorder: "#fed7aa",
    title: "#ea580c",
    text: "#431407",
    textSoft: "#9a7c72",
    accent: "#fb923c",
    accentSecondary: "#fb7185",
    glow: "#fb923c",
  },
  "dark-fairy": {
    name: "Dark Fairy",
    bg: "#09050d",
    bgGradientStart: "#0c081a", // Kombinasi magis andalanmu
    bgGradientEnd: "#050308",
    cardBg: "rgba(14, 12, 21, 0.72)",
    cardBorder: "#271c35",
    title: "#f48fb1",
    text: "#f2effc",
    textSoft: "#b3afc9",
    accent: "#ce93d8",
    accentSecondary: "#80deea",
    glow: "#f48fb1",
  },
  "cotton-candy-dark": {
    name: "Cotton Candy (Dark)",
    bg: "#0a040b",
    bgGradientStart: "#1e0b1c", // Deep Magenta Velvet
    bgGradientEnd: "#0c0616",   // Midnight Violet
    cardBg: "rgba(24, 11, 22, 0.65)",
    cardBorder: "rgba(244, 114, 182, 0.15)",
    title: "#ff9ebd",
    text: "#fdf2f8",
    textSoft: "#caa3b7",
    accent: "#f472b6",
    accentSecondary: "#c084fc",
    glow: "#f472b6",
  },
  "strawberry-dark": {
    name: "Strawberry (Dark)",
    bg: "#0a0204",
    bgGradientStart: "#230510", // Crimson Rose yang sangat gelap
    bgGradientEnd: "#0a0304",
    cardBg: "rgba(28, 9, 14, 0.65)",
    cardBorder: "rgba(251, 113, 133, 0.15)",
    title: "#ff7b8b",
    text: "#fff1f2",
    textSoft: "#c99fa8",
    accent: "#fb7185",
    accentSecondary: "#fb923c",
    glow: "#fb7185",
  },
  "lavender-dark": {
    name: "Lavender (Dark)",
    bg: "#03020c",
    bgGradientStart: "#0b0b26", // Deep Twilight Blue
    bgGradientEnd: "#040209",
    cardBg: "rgba(13, 12, 31, 0.65)",
    cardBorder: "rgba(129, 140, 248, 0.15)",
    title: "#c5b3e6",
    text: "#eef2ff",
    textSoft: "#a19ebb",
    accent: "#818cf8",
    accentSecondary: "#e879f9",
    glow: "#818cf8",
  },
  "mint-dark": {
    name: "Mint (Dark)",
    bg: "#010605",
    bgGradientStart: "#041b18", // Emerald/Teal Malam
    bgGradientEnd: "#010504",
    cardBg: "rgba(6, 21, 19, 0.65)",
    cardBorder: "rgba(45, 212, 191, 0.15)",
    title: "#84dbd0",
    text: "#f0fdfa",
    textSoft: "#9cb5b1",
    accent: "#2dd4bf",
    accentSecondary: "#4ade80",
    glow: "#2dd4bf",
  },
  "peach-dark": {
    name: "Peach (Dark)",
    bg: "#060301",
    bgGradientStart: "#1c0d02", // Burnt Amber / Jingga Kegelapan
    bgGradientEnd: "#050201",
    cardBg: "rgba(24, 13, 7, 0.65)",
    cardBorder: "rgba(251, 146, 60, 0.15)",
    title: "#ffb380",
    text: "#fff7ed",
    textSoft: "#c7a69b",
    accent: "#fb923c",
    accentSecondary: "#fb7185",
    glow: "#fb923c",
  },
};

export function getTheme(searchParams: URLSearchParams): CardTheme {
  const themeName = searchParams.get("theme") || "cotton-candy";
  return THEMES[themeName] || THEMES["cotton-candy"];
}

export async function githubFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "dev-fairy-metrics",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers, next: { revalidate: 300 } });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    if (res.status === 403) throw new Error("Rate limit exceeded");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

export interface FetchedStats {
  user: GitHubUser;
  totalStars: number;
  totalForks: number;
  totalRepos: number;
  languages: { name: string; percentage: number }[];
  totalCommits: number;
}

export async function fetchGitHubStats(username: string): Promise<FetchedStats> {
  const user: GitHubUser = await githubFetch(
    `https://api.github.com/users/${encodeURIComponent(username)}`
  );

  const allRepos: GitHubRepo[] = [];
  let page = 1;
  while (page <= 2) {
    const repos: GitHubRepo[] = await githubFetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&page=${page}&sort=updated`
    );
    allRepos.push(...repos);
    if (repos.length < 100) break;
    page++;
  }

  const ownRepos = allRepos.filter((r) => !r.fork);
  const topRepos = ownRepos.slice(0, 30);

  const langResults = await Promise.all(
    topRepos.map((repo) =>
      githubFetch(
        `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/languages`
      ).catch(() => ({}))
    )
  );

  const langBytes: Record<string, number> = {};
  for (const langs of langResults) {
    for (const [lang, bytes] of Object.entries(langs as Record<string, number>)) {
      langBytes[lang] = (langBytes[lang] || 0) + bytes;
    }
  }

  const totalBytes = Object.values(langBytes).reduce((a, b) => a + b, 0);
  const languages = Object.entries(langBytes)
    .map(([name, bytes]) => ({
      name,
      percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  // Fetch total commits using Search Commits API
  let totalCommits = 0;
  try {
    const searchRes = await githubFetch(
      `https://api.github.com/search/commits?q=author:${encodeURIComponent(username)}`
    );
    totalCommits = searchRes.total_count || 0;
  } catch (e) {
    console.warn("Failed to fetch commit count from search API:", e);
  }

  return {
    user,
    totalStars: allRepos.reduce((s, r) => s + r.stargazers_count, 0),
    totalForks: allRepos.reduce((s, r) => s + r.forks_count, 0),
    totalRepos: allRepos.length,
    languages,
    totalCommits,
  };
}

/* ═══════════════════════════════════════════════════
   Language color map
   ═══════════════════════════════════════════════════ */

export const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  C: "#555555",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
  Shell: "#89e051",
  HTML: "#e34c26",
  CSS: "#563d7c",
  SCSS: "#c6538c",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Lua: "#000080",
  R: "#198CE7",
  Dockerfile: "#384d54",
  Markdown: "#083fa1",
  Astro: "#ff5a03",
  "Jupyter Notebook": "#DA5B0B",
};

export function getLangColor(lang: string): string {
  if (LANG_COLORS[lang]) return LANG_COLORS[lang];
  let hash = 0;
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 55%)`;
}

/* ═══════════════════════════════════════════════════
   SVG helpers
   ═══════════════════════════════════════════════════ */

export function svgResponse(svg: string): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=600",
    },
  });
}

export function errorSvg(message: string, theme: CardTheme): string {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bgGradientStart}"/>
      <stop offset="100%" stop-color="${theme.bgGradientEnd}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="120" rx="18" fill="url(#bg)" stroke="${theme.cardBorder}" stroke-width="1.5"/>
  <text x="200" y="55" text-anchor="middle" font-family="'Segoe UI','Helvetica Neue',sans-serif" font-size="16" font-weight="600" fill="${theme.title}">🥺 Oopsie!</text>
  <text x="200" y="80" text-anchor="middle" font-family="'Segoe UI','Helvetica Neue',sans-serif" font-size="12" fill="${theme.textSoft}">${escapeXml(message)}</text>
</svg>`;
}

export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
