import fs from "fs";
import path from "path";

/* ═══════════════════════════════════════════════════
   Load Environmental Variables & Config
   ═══════════════════════════════════════════════════ */

// Manual .env.local loader for local execution
try {
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const key = match[1];
        let val = match[2].trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  // Ignore
}

// Load config.json
const configPath = path.join(process.cwd(), "config.json");
if (!fs.existsSync(configPath)) {
  console.error("❌ config.json not found!");
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const username = process.env.GITHUB_USERNAME || config.username;
const token = process.env.GITHUB_TOKEN;

if (!username) {
  console.error("❌ GitHub username is not set in config.json or environment!");
  process.exit(1);
}

console.log(`🧚 Generating Dev Fairy Metrics for: @${username}`);

/* ═══════════════════════════════════════════════════
   Theme Definition
   ═══════════════════════════════════════════════════ */

const THEMES = {
  "cotton-candy": {
    name: "Cotton Candy",
    bg: "#fef0f5",
    bgGradientStart: "#fce4ec",
    bgGradientEnd: "#f3e5f5",
    cardBg: "rgba(255,255,255,0.75)",
    cardBorder: "#f8bbd0",
    title: "#d81b60",
    text: "#4a2040",
    textSoft: "#9c7a8e",
    accent: "#e8a0bf",
    accentSecondary: "#ce93d8",
    glow: "#f48fb1",
  },
  strawberry: {
    name: "Strawberry",
    bg: "#fef0f0",
    bgGradientStart: "#ffebee",
    bgGradientEnd: "#fce4ec",
    cardBg: "rgba(255,255,255,0.75)",
    cardBorder: "#ef9a9a",
    title: "#c62828",
    text: "#4a2020",
    textSoft: "#9c7a7a",
    accent: "#e88a9a",
    accentSecondary: "#ef5350",
    glow: "#ef9a9a",
  },
  lavender: {
    name: "Lavender",
    bg: "#f5f0ff",
    bgGradientStart: "#ede7f6",
    bgGradientEnd: "#e8eaf6",
    cardBg: "rgba(255,255,255,0.75)",
    cardBorder: "#b39ddb",
    title: "#5e35b1",
    text: "#2a2040",
    textSoft: "#8a7a9c",
    accent: "#b39ddb",
    accentSecondary: "#9575cd",
    glow: "#b39ddb",
  },
  mint: {
    name: "Mint",
    bg: "#f0fef5",
    bgGradientStart: "#e0f2f1",
    bgGradientEnd: "#e8f5e9",
    cardBg: "rgba(255,255,255,0.75)",
    cardBorder: "#80cbc4",
    title: "#00695c",
    text: "#1a3a30",
    textSoft: "#6a9a8c",
    accent: "#80cbc4",
    accentSecondary: "#4db6ac",
    glow: "#80cbc4",
  },
  peach: {
    name: "Peach",
    bg: "#fef5f0",
    bgGradientStart: "#fff3e0",
    bgGradientEnd: "#fbe9e7",
    cardBg: "rgba(255,255,255,0.75)",
    cardBorder: "#ffcc80",
    title: "#e65100",
    text: "#3e2a1a",
    textSoft: "#9c8a7a",
    accent: "#f4b183",
    accentSecondary: "#ff8a65",
    glow: "#ffcc80",
  },
  "dark-fairy": {
    name: "Dark Fairy",
    bg: "#09050d",
    bgGradientStart: "#0c081a",
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
};

const LANG_COLORS = {
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

function getLangColor(lang) {
  if (LANG_COLORS[lang]) return LANG_COLORS[lang];
  let hash = 0;
  for (let i = 0; i < lang.length; i++) {
    hash = lang.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  return `hsl(${h}, 65%, 55%)`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ═══════════════════════════════════════════════════
   GitHub API Data Fetcher
   ═══════════════════════════════════════════════════ */

async function githubFetch(url) {
  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "dev-fairy-metrics",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (res.status === 404) throw new Error("User not found");
    if (res.status === 403) throw new Error("Rate limit exceeded");
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json();
}

async function fetchStats(username) {
  const user = await githubFetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

  const allRepos = [];
  let page = 1;
  while (page <= 2) {
    const repos = await githubFetch(
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

  const langBytes = {};
  for (const langs of langResults) {
    for (const [lang, bytes] of Object.entries(langs)) {
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

  return {
    user,
    totalStars: allRepos.reduce((s, r) => s + r.stargazers_count, 0),
    totalForks: allRepos.reduce((s, r) => s + r.forks_count, 0),
    totalRepos: allRepos.length,
    languages,
  };
}

/* ═══════════════════════════════════════════════════
   SVG Generation
   ═══════════════════════════════════════════════════ */

function generateStatsSvg(stats, theme, options) {
  const displayName = escapeXml(options.title || stats.user.name || stats.user.login);
  const topLang = stats.languages.length > 0 ? stats.languages[0].name : "N/A";
  const hideTitle = options.hide_title;
  const hideBorder = options.hide_border;

  const cardWidth = 495;
  const titleOffset = hideTitle ? 0 : 52;
  const rowHeight = 46;
  const padding = 28;
  const cardHeight = titleOffset + 16 + 4 * rowHeight + 28;

  // Icon paths (Lucide-style, 24x24 viewBox)
  const starIcon = `M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z`;
  const repoIcon = `M3 7V5a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v2M3 7h18M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7`;
  const codeIcon = `M16 18l6-6-6-6M8 6l-6 6 6 6`;
  const forkIcon = `M6 3v6a3 3 0 0 0 6 0V3M6 3h6M9 16v-4M9 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z`;

  const iconColors = {
    "cotton-candy": { repo: "#d81b60", fork: "#7e57c2" },
    strawberry: { repo: "#c62828", fork: "#d81b60" },
    lavender: { repo: "#5e35b1", fork: "#ab47bc" },
    mint: { repo: "#00695c", fork: "#00acc1" },
    peach: { repo: "#e65100", fork: "#d84315" },
    "dark-fairy": { repo: "#f48fb1", fork: "#80deea" },
  };

  const themeName = theme.name.toLowerCase().replace(" ", "-");
  const colors = iconColors[themeName] || iconColors["cotton-candy"];

  const statsRows = [
    { 
      icon: starIcon, 
      label: "Total Stars", 
      value: stats.totalStars, 
      fill: true,
      color: "#ff9800" 
    },
    { 
      icon: repoIcon, 
      label: "Total Repos", 
      value: stats.totalRepos, 
      fill: false,
      color: colors.repo 
    },
    { 
      icon: codeIcon, 
      label: "Top Language", 
      value: topLang, 
      fill: false,
      color: getLangColor(topLang) 
    },
    { 
      icon: forkIcon, 
      label: "Total Forks", 
      value: stats.totalForks, 
      fill: false,
      color: colors.fork 
    },
  ];

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bgGradientStart}"/>
      <stop offset="100%" stop-color="${theme.bgGradientEnd}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentSecondary}"/>
    </linearGradient>
    <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.15"/>
      <stop offset="50%" stop-color="${theme.accentSecondary}" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.02"/>
    </linearGradient>
    <filter id="soft-shadow">
      <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" flood-color="${theme.accent}" flood-opacity="0.15"/>
    </filter>
    <filter id="blur-filter" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="35"/>
    </filter>
    <clipPath id="card-clip">
      <rect width="${cardWidth}" height="${cardHeight}" rx="20"/>
    </clipPath>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&amp;family=Outfit:wght@500;700;800&amp;display=swap');
      
      .card-title {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 15px;
        font-weight: 700;
        fill: ${theme.title};
        letter-spacing: 0.5px;
      }
      .stat-label {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        font-weight: 500;
        fill: ${theme.textSoft};
      }
      .stat-value {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 15px;
        font-weight: 800;
        fill: ${theme.title};
      }
      .card-footer {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 9px;
        font-weight: 600;
        fill: ${theme.textSoft};
        opacity: 0.5;
        letter-spacing: 1px;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-3px); }
      }
      .floating-icon {
        animation: float 4s ease-in-out infinite;
      }
      
      .stat-row {
        transition: transform 0.2s ease;
      }
      .stat-row:hover {
        transform: translateX(4px);
      }
    </style>
  </defs>

  <!-- Card Background -->
  <rect width="${cardWidth}" height="${cardHeight}" rx="20" fill="url(#bg)"
    ${hideBorder ? "" : `stroke="url(#accent)" stroke-width="1.5"`}/>

  <!-- Blurred background blobs (Clipped to card shape) -->
  <g clip-path="url(#card-clip)">
    <circle cx="${cardWidth - 30}" cy="40" r="70" fill="${theme.accent}" opacity="0.3" filter="url(#blur-filter)"/>
    <circle cx="30" cy="${cardHeight - 30}" r="65" fill="${theme.accentSecondary}" opacity="0.25" filter="url(#blur-filter)"/>
  </g>

  <!-- Shimmer overlay -->
  <rect width="${cardWidth}" height="${cardHeight}" rx="20" fill="url(#shimmer)" pointer-events="none"/>

  ${!hideTitle ? `
  <!-- Title -->
  <text class="card-title" x="${padding}" y="33">
    ${displayName}'s GitHub Stats
  </text>
  <line x1="${padding}" y1="44" x2="${cardWidth - padding}" y2="44" stroke="url(#accent)" stroke-width="1" stroke-linecap="round" opacity="0.35"/>
  ` : ""}

  <!-- Stats Rows -->
  ${statsRows.map((stat, i) => {
      const y = titleOffset + 16 + i * rowHeight;
      return `
  <g class="stat-row" transform="translate(${padding}, ${y})">
    <!-- Icon Container Pill/Box -->
    <rect class="floating-icon" x="0" y="0" width="32" height="32" rx="10" fill="${stat.color}" opacity="0.15" style="animation-delay: ${i * 0.2}s;"/>
    <g class="floating-icon" transform="translate(6, 6) scale(0.83)" fill="${stat.fill ? stat.color : "none"}" stroke="${stat.color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" style="animation-delay: ${i * 0.2}s;">
      <path d="${stat.icon}"/>
    </g>
    <!-- Label -->
    <text class="stat-label" x="48" y="16" dominant-baseline="central">${stat.label}</text>
    <!-- Value -->
    <text class="stat-value" x="${cardWidth - padding * 2}" y="16" text-anchor="end" dominant-baseline="central">${stat.value}</text>
    <!-- Subtle separator -->
    ${i < statsRows.length - 1 ? `<line x1="0" y1="39" x2="${cardWidth - padding * 2}" y2="39" stroke="${theme.cardBorder}" stroke-width="0.5" opacity="0.25"/>` : ""}
  </g>`;
    }).join("")}

  <!-- Footer -->
  <text class="card-footer" x="${cardWidth - 20}" y="${cardHeight - 12}" text-anchor="end">DEV FAIRY METRICS ✨</text>
</svg>`;
}

function generateLangsSvg(stats, theme, options) {
  const layout = options.layout || "donut";
  const hideTitle = options.hide_title;
  const hideBorder = options.hide_border;
  const count = Math.min(options.langs_count || 8, 12);
  const langs = stats.languages.slice(0, count);

  if (langs.length === 0) {
    return `
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="120" viewBox="0 0 400 120">
  <rect width="400" height="120" rx="18" fill="${theme.bg}" stroke="${theme.cardBorder}" stroke-width="1.5"/>
  <text x="200" y="65" text-anchor="middle" font-family="sans-serif" font-size="14" fill="${theme.text}">No language data found 🥺</text>
</svg>`;
  }

  if (layout === "donut") {
    return renderDonut(langs, theme, stats.user.login, hideTitle, hideBorder);
  } else if (layout === "compact") {
    return renderCompact(langs, theme, stats.user.login, hideTitle, hideBorder);
  } else {
    return renderBars(langs, theme, stats.user.login, hideTitle, hideBorder);
  }
}

function renderDonut(langs, theme, username, hideTitle, hideBorder) {
  const cardWidth = 420;
  const legendHeight = Math.ceil(langs.length / 2) * 22 + 10;
  const cardHeight = (hideTitle ? 0 : 40) + 150 + legendHeight + 30;

  const cx = 105;
  const cy = (hideTitle ? 0 : 40) + 85;
  const r = 55;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = langs.map((lang) => {
    const dash = (lang.percentage / 100) * circumference;
    const dashOffset = -(offset / 100) * circumference;
    offset += lang.percentage;
    return { ...lang, dash, dashOffset };
  });

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bgGradientStart}"/>
      <stop offset="100%" stop-color="${theme.bgGradientEnd}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentSecondary}"/>
    </linearGradient>
  </defs>

  <rect width="${cardWidth}" height="${cardHeight}" rx="18" fill="url(#bg)"
    ${hideBorder ? "" : `stroke="${theme.cardBorder}" stroke-width="1.5"`}/>

  <circle cx="${cardWidth - 25}" cy="30" r="35" fill="${theme.accent}" opacity="0.1"/>
  <circle cx="30" cy="${cardHeight - 20}" r="25" fill="${theme.accentSecondary}" opacity="0.08"/>

  ${
    !hideTitle
      ? `
  <text x="24" y="30" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="15" font-weight="700" fill="${theme.title}">
    ✨ ${escapeXml(username)}'s Top Languages
  </text>
  <line x1="24" y1="40" x2="${cardWidth - 24}" y2="40" stroke="url(#accent)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  `
      : ""
  }

  <g transform="rotate(-90, ${cx}, ${cy})">
    ${segments
      .map(
        (seg) => `
    <circle
      cx="${cx}" cy="${cy}" r="${r}"
      fill="none"
      stroke="${getLangColor(seg.name)}"
      stroke-width="${strokeWidth}"
      stroke-dasharray="${seg.dash} ${circumference - seg.dash}"
      stroke-dashoffset="${seg.dashOffset}"
      stroke-linecap="round"
      opacity="0.85"
    />`
      )
      .join("")}
  </g>

  <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="18" font-weight="700" fill="${theme.text}">${langs.length}</text>
  <text x="${cx}" y="${cy + 12}" text-anchor="middle" font-family="'Segoe UI',sans-serif" font-size="9" fill="${theme.textSoft}">languages</text>

  ${langs
    .map((lang, i) => {
      const col = i < Math.ceil(langs.length / 2) ? 0 : 1;
      const row = col === 0 ? i : i - Math.ceil(langs.length / 2);
      const lx = col === 0 ? 220 : 320;
      const ly = (hideTitle ? 50 : 80) + row * 22;
      return `
    <g transform="translate(${lx}, ${ly})">
      <circle cx="5" cy="8" r="5" fill="${getLangColor(lang.name)}"/>
      <text x="15" y="12" font-family="'Segoe UI',sans-serif" font-size="11" fill="${theme.textSoft}">${escapeXml(lang.name)}</text>
      <text x="100" y="12" text-anchor="end" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="600" fill="${theme.text}">${lang.percentage}%</text>
    </g>`;
    })
    .join("")}

  <text x="${cardWidth - 24}" y="${cardHeight - 12}" text-anchor="end" font-family="'Segoe UI',sans-serif" font-size="9" fill="${theme.textSoft}" opacity="0.6">dev fairy metrics ✨</text>
</svg>`;
}

function renderBars(langs, theme, username, hideTitle, hideBorder) {
  const cardWidth = 420;
  const rowHeight = 32;
  const titleOffset = hideTitle ? 0 : 40;
  const cardHeight = titleOffset + 28 + langs.length * rowHeight + 24;
  const barMaxWidth = 200;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bgGradientStart}"/>
      <stop offset="100%" stop-color="${theme.bgGradientEnd}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentSecondary}"/>
    </linearGradient>
  </defs>

  <rect width="${cardWidth}" height="${cardHeight}" rx="18" fill="url(#bg)"
    ${hideBorder ? "" : `stroke="${theme.cardBorder}" stroke-width="1.5"`}/>
  
  <circle cx="${cardWidth - 25}" cy="25" r="30" fill="${theme.accent}" opacity="0.1"/>

  ${
    !hideTitle
      ? `
  <text x="24" y="30" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="15" font-weight="700" fill="${theme.title}">
    ✨ ${escapeXml(username)}'s Top Languages
  </text>
  <line x1="24" y1="40" x2="${cardWidth - 24}" y2="40" stroke="url(#accent)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  `
      : ""
  }

  ${langs
    .map((lang, i) => {
      const y = titleOffset + 20 + i * rowHeight;
      const barWidth = Math.max((lang.percentage / 100) * barMaxWidth, 4);
      return `
    <g transform="translate(24, ${y})">
      <circle cx="5" cy="8" r="4" fill="${getLangColor(lang.name)}"/>
      <text x="16" y="12" font-family="'Segoe UI',sans-serif" font-size="11.5" fill="${theme.text}" font-weight="500">${escapeXml(lang.name)}</text>
      <rect x="140" y="2" width="${barMaxWidth}" height="12" rx="6" fill="${theme.cardBorder}" opacity="0.35"/>
      <rect x="140" y="2" width="${barWidth}" height="12" rx="6" fill="${getLangColor(lang.name)}" opacity="0.8"/>
      <text x="${cardWidth - 48}" y="12" text-anchor="end" font-family="'Segoe UI',sans-serif" font-size="11" font-weight="700" fill="${theme.text}">${lang.percentage}%</text>
    </g>`;
    })
    .join("")}

  <text x="${cardWidth - 24}" y="${cardHeight - 12}" text-anchor="end" font-family="'Segoe UI',sans-serif" font-size="9" fill="${theme.textSoft}" opacity="0.6">dev fairy metrics ✨</text>
</svg>`;
}

function renderCompact(langs, theme, username, hideTitle, hideBorder) {
  const cardWidth = 420;
  const titleOffset = hideTitle ? 0 : 40;
  const legendRows = Math.ceil(langs.length / 3);
  const cardHeight = titleOffset + 30 + 18 + legendRows * 22 + 24;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.bgGradientStart}"/>
      <stop offset="100%" stop-color="${theme.bgGradientEnd}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentSecondary}"/>
    </linearGradient>
  </defs>

  <rect width="${cardWidth}" height="${cardHeight}" rx="18" fill="url(#bg)"
    ${hideBorder ? "" : `stroke="${theme.cardBorder}" stroke-width="1.5"`}/>

  ${
    !hideTitle
      ? `
  <text x="24" y="30" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="15" font-weight="700" fill="${theme.title}">
    ✨ ${escapeXml(username)}'s Top Languages
  </text>
  <line x1="24" y1="40" x2="${cardWidth - 24}" y2="40" stroke="url(#accent)" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
  `
      : ""
  }

  <g transform="translate(24, ${titleOffset + 14})">
    <rect width="${cardWidth - 48}" height="14" rx="7" fill="${theme.cardBorder}" opacity="0.3"/>
    ${(() => {
      let x = 0;
      const totalWidth = cardWidth - 48;
      return langs
        .map((lang) => {
          const w = Math.max((lang.percentage / 100) * totalWidth, 2);
          const segment = `<rect x="${x}" y="0" width="${w}" height="14" rx="${x === 0 ? "7 0 0 7" : "0"}" fill="${getLangColor(lang.name)}" opacity="0.8"/>`;
          x += w;
          return segment;
        })
        .join("");
    })()}
  </g>

  ${langs
    .map((lang, i) => {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const lx = 24 + col * 130;
      const ly = titleOffset + 40 + row * 22;
      return `
    <g transform="translate(${lx}, ${ly})">
      <circle cx="5" cy="8" r="4" fill="${getLangColor(lang.name)}"/>
      <text x="14" y="12" font-family="'Segoe UI',sans-serif" font-size="10.5" fill="${theme.textSoft}">${escapeXml(lang.name)} <tspan font-weight="600" fill="${theme.text}">${lang.percentage}%</tspan></text>
    </g>`;
    })
    .join("")}

  <text x="${cardWidth - 24}" y="${cardHeight - 10}" text-anchor="end" font-family="'Segoe UI',sans-serif" font-size="9" fill="${theme.textSoft}" opacity="0.6">dev fairy metrics ✨</text>
</svg>`;
}

/* ═══════════════════════════════════════════════════
   Main Execution flow
   ═══════════════════════════════════════════════════ */

async function main() {
  try {
    const stats = await fetchStats(username);
    
    // Get Theme
    const activeTheme = THEMES[config.theme] || THEMES["cotton-candy"];

    // Make output directory if not exists
    const outDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir);
    }

    // 1. Stats SVG File
    const statsSvg = generateStatsSvg(stats, activeTheme, config.stats || {});
    fs.writeFileSync(path.join(outDir, "github-stats.svg"), statsSvg);
    console.log("✅ Generated stats card to: output/github-stats.svg");

    // 2. Languages SVG File
    const langsSvg = generateLangsSvg(stats, activeTheme, config.languages || {});
    fs.writeFileSync(path.join(outDir, "github-top-langs.svg"), langsSvg);
    console.log("✅ Generated languages card to: output/github-top-langs.svg");

    console.log("✨ All metrics updated successfully! Have a magical day! 🧚💖");
  } catch (err) {
    console.error("❌ Execution failed:", err.message);
    process.exit(1);
  }
}

main();
