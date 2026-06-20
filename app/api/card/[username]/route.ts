import { type NextRequest } from "next/server";
import {
  getTheme,
  fetchGitHubStats,
  svgResponse,
  errorSvg,
  escapeXml,
  getLangColor,
  type CardTheme,
} from "../shared";
import { getRPGStats } from "../../../../lib/gameUtils";

export const dynamic = "force-dynamic";

const iconColors: Record<string, { repo: string; fork: string }> = {
  "cotton-candy": { repo: "#d81b60", fork: "#7e57c2" },
  strawberry: { repo: "#c62828", fork: "#d81b60" },
  lavender: { repo: "#5e35b1", fork: "#ab47bc" },
  mint: { repo: "#00695c", fork: "#00acc1" },
  peach: { repo: "#e65100", fork: "#d84315" },
  "dark-fairy": { repo: "#f48fb1", fork: "#80deea" },
  "cotton-candy-dark": { repo: "#ff9ebd", fork: "#ce93d8" },
  "strawberry-dark": { repo: "#ff7b8b", fork: "#ef5350" },
  "lavender-dark": { repo: "#c5b3e6", fork: "#9575cd" },
  "mint-dark": { repo: "#84dbd0", fork: "#4db6ac" },
  "peach-dark": { repo: "#ffb380", fork: "#ff8a65" },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const theme = getTheme(request.nextUrl.searchParams);
  const hideTitle = request.nextUrl.searchParams.get("hide_title") === "true";
  const hideBorder = request.nextUrl.searchParams.get("hide_border") === "true";
  const customTitle = request.nextUrl.searchParams.get("title");

  try {
    const stats = await fetchGitHubStats(username);

    const displayName = escapeXml(
      customTitle || stats.user.name || stats.user.login
    );
    const topLang =
      stats.languages.length > 0 ? stats.languages[0].name : "N/A";

    const isRpg = request.nextUrl.searchParams.get("rpg") === "true";
    if (isRpg) {
      const rpgClass = request.nextUrl.searchParams.get("rpg_class");
      return svgResponse(renderGamifiedCard(stats, theme, hideBorder, rpgClass, customTitle));
    }

    const cardWidth = 495;
    const titleOffset = hideTitle ? 0 : 52;
    const rowHeight = 46;
    const padding = 28;
    const cardHeight = titleOffset + 16 + 4 * rowHeight + 28;

    const themeName = request.nextUrl.searchParams.get("theme") || "cotton-candy";
    const colors = iconColors[themeName] || iconColors["cotton-candy"];

    // Icon paths (Lucide-style, 24x24 viewBox)
    const starIcon = `M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z`;
    const repoIcon = `M3 7V5a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v2M3 7h18M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7`;
    const codeIcon = `M16 18l6-6-6-6M8 6l-6 6 6 6`;
    const forkIcon = `M6 3v6a3 3 0 0 0 6 0V3M6 3h6M9 16v-4M9 16a3 3 0 1 0 0 6 3 3 0 0 0 0-6z`;

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

    const svg = `
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

    return svgResponse(svg);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return svgResponse(errorSvg(message, theme));
  }
}


function renderGamifiedCard(
  data: any,
  theme: CardTheme,
  hideBorder: boolean,
  rpgClass?: string | null,
  customTitle?: string | null
): string {
  const displayName = escapeXml(
    customTitle || data.user.name || data.user.login
  );
  const username = `@${data.user.login}`;

  const followers = data.user.followers || 0;
  const totalStars = data.totalStars || 0;
  const totalRepos = data.totalRepos || 0;
  const totalForks = data.totalForks || 0;
  const totalCommits = data.totalCommits || 0;

  const topLang = data.languages && data.languages.length > 0 ? data.languages[0].name : "Unknown";

  const rpg = getRPGStats(totalCommits, totalStars, totalRepos, followers, topLang);
  const calcLevel = rpg.level;
  const playerClass = escapeXml(rpgClass || rpg.role);
  const expPercent = rpg.expPercent;

  const cardWidth = 490;
  const cardHeight = 190;

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
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.12"/>
      <stop offset="50%" stop-color="${theme.accentSecondary}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.02"/>
    </linearGradient>

    <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <filter id="blob-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="35"/>
    </filter>

    <clipPath id="card-clip">
      <rect width="${cardWidth}" height="${cardHeight}" rx="20"/>
    </clipPath>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&amp;family=Outfit:wght@600;700;800;900&amp;display=swap');
      
      .name-text { font-family: 'Nunito', sans-serif; font-size: 22px; font-weight: 900; fill: ${theme.title}; letter-spacing: 0.5px; }
      .user-text { font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600; fill: ${theme.textSoft}; opacity: 0.8; }
      .lvl-number { font-family: 'Outfit', sans-serif; font-size: 26px; font-weight: 900; fill: #ffffff; }
      .role-badge-text { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 800; fill: ${theme.accent}; letter-spacing: 1px; }
      .pill-text { font-family: 'Nunito', sans-serif; font-size: 10px; font-weight: 800; fill: ${theme.textSoft}; }
      .pill-val { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 800; fill: ${theme.title}; }
      .exp-label { font-family: 'Nunito', sans-serif; font-size: 11px; font-weight: 900; fill: ${theme.textSoft}; }
      .footer-text { font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 700; fill: ${theme.textSoft}; opacity: 0.4; letter-spacing: 2px; }
    </style>
  </defs>

  <rect x="10" y="10" width="470" height="170" rx="20" fill="url(#bg)" 
    ${hideBorder ? "" : `stroke="url(#accent)" stroke-width="1.2" stroke-opacity="0.6"`}/>

  <g transform="translate(10, 10)" clip-path="url(#card-clip)">
    <circle cx="110" cy="110" r="75" fill="${theme.accentSecondary}" opacity="0.22" filter="url(#blob-blur)"/>
    <circle cx="370" cy="40" r="95" fill="${theme.accent}" opacity="0.18" filter="url(#blob-blur)"/>
  </g>

  <rect x="10" y="10" width="470" height="170" rx="20" fill="url(#shimmer)" pointer-events="none"/>

  <g transform="translate(85, 75)">
    <text x="-40" y="-35" font-size="14" opacity="0.6">✨</text>
    <text x="35" y="45" font-size="12" opacity="0.5">🌟</text>

    <rect x="-38" y="-38" width="76" height="76" rx="20" fill="${theme.accent}" opacity="0.22"/>
    
    <rect x="-32" y="-32" width="64" height="64" rx="16" fill="url(#accent)" filter="url(#glow)"/>
    <text class="lvl-number" x="0" y="2" text-anchor="middle" dominant-baseline="central">Lv.${calcLevel}</text>

    <rect x="-60" y="44" width="120" height="24" rx="12" fill="url(#bg)" stroke="url(#accent)" stroke-width="1.5"/>
    <text class="role-badge-text" x="0" y="56" text-anchor="middle" dominant-baseline="central">${playerClass}</text>
  </g>

  <g transform="translate(195, 45)">
    
    <text class="name-text" x="0" y="0">${displayName}</text>
    <text class="user-text" x="0" y="18">${username}</text>

    <g transform="translate(0, 35)">
      <rect x="0" y="0" width="82" height="26" rx="8" fill="${theme.accent}" opacity="0.25"/>
      <text class="pill-text" x="6" y="13" dominant-baseline="central">⭐ Stars</text>
      <text class="pill-val" x="76" y="13" text-anchor="end" dominant-baseline="central">${totalStars}</text>

      <rect x="88" y="0" width="82" height="26" rx="8" fill="${theme.accentSecondary}" opacity="0.25"/>
      <text class="pill-text" x="94" y="13" dominant-baseline="central">🔮 Repos</text>
      <text class="pill-val" x="164" y="13" text-anchor="end" dominant-baseline="central">${totalRepos}</text>

      <rect x="176" y="0" width="84" height="26" rx="8" fill="${theme.accent}" opacity="0.25"/>
      <text class="pill-text" x="182" y="13" dominant-baseline="central">🔱 Forks</text>
      <text class="pill-val" x="254" y="13" text-anchor="end" dominant-baseline="central">${totalForks}</text>
    </g>

    <g transform="translate(0, 85)">
      <text class="exp-label" x="0" y="0">✨ EXP <tspan font-size="9" opacity="0.6" font-family="Outfit">(Followers)</tspan></text>
      <text class="pill-val" x="260" y="0" text-anchor="end">${followers}</text>
      
      <rect x="0" y="8" width="260" height="10" rx="5" fill="${theme.cardBorder}" opacity="0.28"/>
      
      <rect x="0" y="8" width="${(expPercent / 100) * 260}" height="10" rx="5" fill="${theme.title}" fill-opacity="0.85">
        <animate attributeName="width" from="0" to="${(expPercent / 100) * 260}" dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1"/>
      </rect>
    </g>

  </g>

  <text class="footer-text" x="460" y="165" text-anchor="end">DEV FAIRY METRICS</text>
</svg>`;
}