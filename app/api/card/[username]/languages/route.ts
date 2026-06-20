import { type NextRequest } from "next/server";
import {
  getTheme,
  fetchGitHubStats,
  svgResponse,
  errorSvg,
  getLangColor,
  escapeXml,
  type CardTheme,
} from "../../shared";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const theme = getTheme(request.nextUrl.searchParams);
  const layout = request.nextUrl.searchParams.get("layout") || "donut";
  const hideTitle = request.nextUrl.searchParams.get("hide_title") === "true";
  const hideBorder = request.nextUrl.searchParams.get("hide_border") === "true";
  const count = Math.min(
    parseInt(request.nextUrl.searchParams.get("langs_count") || "8", 10),
    12
  );

  try {
    const stats = await fetchGitHubStats(username);
    const langs = stats.languages.slice(0, count);

    if (langs.length === 0) {
      return svgResponse(errorSvg("No language data found", theme));
    }

    let svg: string;

    if (layout === "donut") {
      svg = fairyBars(langs, theme, username, hideTitle, hideBorder);
    } else if (layout === "compact") {
      svg = renderCompact(langs, theme, username, hideTitle, hideBorder);
    } else if (layout === "affinity") {
      svg = renderAffinity(langs, theme, username, hideTitle, hideBorder);
    } else {
      svg = renderBars(langs, theme, username, hideTitle, hideBorder);
    }

    return svgResponse(svg);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return svgResponse(errorSvg(message, theme));
  }
}

/* ═══════════════════════════════════════════════════
   Shared SVG helpers
   ═══════════════════════════════════════════════════ */

function svgDefs(w: number, h: number, theme: CardTheme): string {
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0%" stop-color="${theme.bgGradientStart}"/>
      <stop offset="100%" stop-color="${theme.bgGradientEnd}"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${theme.accent}"/>
      <stop offset="100%" stop-color="${theme.accentSecondary}"/>
    </linearGradient>
    <radialGradient id="glow-orb-1" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow-orb-2" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0%" stop-color="${theme.accentSecondary}" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="${theme.accentSecondary}" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow-sm">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="inner-shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
      <feOffset dx="0" dy="1"/>
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feFlood flood-color="${theme.accent}" flood-opacity="0.08"/>
      <feComposite in2="SourceAlpha" operator="in"/>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>`;
}

function svgBackground(w: number, h: number, theme: CardTheme, hideBorder: boolean): string {
  return `
  <!-- Card -->
  <rect width="${w}" height="${h}" rx="14" fill="url(#bg)"
    ${hideBorder ? "" : `stroke="${theme.cardBorder}" stroke-width="0.8" stroke-opacity="0.6"`}/>

  <!-- Ambient glow orbs -->
  <ellipse cx="${w - 50}" cy="40" rx="70" ry="55" fill="url(#glow-orb-1)"/>
  <ellipse cx="55" cy="${h - 30}" rx="50" ry="40" fill="url(#glow-orb-2)"/>
  <circle cx="${w * 0.45}" cy="${h * 0.5}" r="30" fill="${theme.glow}" opacity="0.03"/>`;
}

function svgTitle(theme: CardTheme, username: string, hideTitle: boolean, cardWidth: number): string {
  if (hideTitle) return "";
  return `
  <text x="26" y="31" font-family="'Segoe UI','Helvetica Neue',Arial,sans-serif" font-size="13.5" font-weight="700" fill="${theme.title}">${escapeXml(username)}'s Top Languages</text>
  <line x1="26" y1="42" x2="${cardWidth - 26}" y2="42" stroke="url(#accent)" stroke-width="0.8" stroke-linecap="round" opacity="0.3"/>`;
}

function svgFooter(theme: CardTheme, cardWidth: number, cardHeight: number): string {
  return `
  <text x="${cardWidth - 18}" y="${cardHeight - 9}" text-anchor="end" font-family="'Segoe UI',sans-serif" font-size="7.5" fill="${theme.textSoft}" opacity="0.35">dev fairy metrics</text>
</svg>`;
}

/* ═══════════════════════════════════════════════════
   FAIRY BARS LAYOUT (default)
   ═══════════════════════════════════════════════════ */
function fairyBars(
  langs: { name: string; percentage: number }[],
  theme: CardTheme,
  username: string,
  hideTitle: boolean,
  hideBorder: boolean
): string {
  // Ambil 5 bahasa teratas agar porsi vertikal tetap seimbang
  const topLangs = langs.slice(0, 5);

  const cardWidth = 490;
  const pad = 28;
  const titleH = hideTitle ? 0 : 36;

  // Bar tumpuk atas tetap dipertahankan sebagai elemen global kartu
  const stackedY = titleH + 22;
  const stackedH = 12;
  const totalBarW = cardWidth - pad * 2;

  // Kalibrasi baris individu bawah (Dibuat melayang, tanpa pembungkus kaku)
  const rowH = 25;
  const rowStartY = stackedY + stackedH + 26;
  const barX = 110;
  const barW = 210;
  const barH = 5; // Dibuat lebih tipis (5px) agar terkesan sleek dan modern
  const cardH = rowStartY + topLangs.length * rowH + 22;

  const sparkles = [
    { x: cardWidth - 40, y: titleH + 20, s: 5 },
    { x: cardWidth - 75, y: cardH - 35, s: 4 },
  ];

  const sparklePath = "M0,-1 L0.3,-0.3 L1,0 L0.3,0.3 L0,1 L-0.3,0.3 L-1,0 L-0.3,-0.3Z";

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardH}" viewBox="0 0 ${cardWidth} ${cardH}">
  <defs>
    <!-- Gradasi Tema -->
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

    <filter id="blob-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30"/>
    </filter>

    <clipPath id="card-clip">
      <rect width="${cardWidth}" height="${cardH}" rx="20"/>
    </clipPath>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&amp;family=Outfit:wght@600;700;800;900&amp;display=swap');
      
      .title-text { font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 900; fill: ${theme.title}; letter-spacing: 1.5px; }
      .user-text { font-family: 'Outfit', sans-serif; font-size: 10.5px; font-weight: 600; fill: ${theme.textSoft}; opacity: 0.8; }
      .lang-label { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; fill: ${theme.title}; }
      .lang-pct { font-family: 'Outfit', sans-serif; font-size: 10.5px; font-weight: 700; fill: ${theme.textSoft}; }
      .footer-text { font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 700; fill: ${theme.textSoft}; opacity: 0.4; letter-spacing: 2px; }
    </style>
  </defs>

  <!-- ================= BASE KARTU ================= -->
  <rect x="10" y="10" width="${cardWidth - 20}" height="${cardH - 20}" rx="20" fill="url(#bg)" 
    ${hideBorder ? "" : `stroke="url(#accent)" stroke-width="1.2" stroke-opacity="0.6"`}/>

  <g clip-path="url(#card-clip)">
    <circle cx="80" cy="${cardH - 50}" r="75" fill="${theme.accentSecondary}" opacity="0.22" filter="url(#blob-blur)"/>
    <circle cx="${cardWidth - 80}" cy="50" r="85" fill="${theme.accent}" opacity="0.18" filter="url(#blob-blur)"/>
  </g>

  <rect x="10" y="10" width="${cardWidth - 20}" height="${cardH - 20}" rx="20" fill="url(#shimmer)" pointer-events="none"/>

  <!-- Header -->
  ${!hideTitle ? `
  <g transform="translate(${pad}, 32)">
    <text class="title-text" x="0" y="0">✨ DETAILED AFFINITY</text>
    <text class="user-text" x="0" y="14">Advanced element analysis for @${username}</text>
  </g>
  ` : ""}

  ${sparkles.map((sp, si) => `
  <g transform="translate(${sp.x} ${sp.y}) scale(${sp.s})" opacity="0">
    <path d="${sparklePath}" fill="${si % 2 === 0 ? theme.accent : theme.accentSecondary}" opacity="0.5"/>
    <animate attributeName="opacity" values="0;0.6;0" dur="3s" begin="${si * 0.5}s" repeatCount="indefinite"/>
  </g>`).join("")}

  <!-- Stacked Bar Atas (Liquid Strip) -->
  <g transform="translate(${pad} ${stackedY})">
    <rect width="${totalBarW}" height="${stackedH}" rx="6" fill="${theme.cardBorder}" opacity="0.15"/>
    <g clip-path="url(#card-clip)">
      ${(() => {
      let currentX = 0;
      return topLangs.map((l, i) => {
        const w = Math.max((l.percentage / 100) * totalBarW, 2);
        const c = getLangColor(l.name);
        const seg = `
      <rect x="${currentX}" y="0" width="0" height="${stackedH}" fill="${c}" rx="${i === 0 ? 6 : 0}">
        <animate attributeName="width" from="0" to="${w}" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
      </rect>`;
        currentX += w;
        return seg;
      }).join("");
    })()}
    </g>
  </g>

  <!-- ================= BOTTOM: INDIVIDUAL FLOATING LINES ================= -->
  <g transform="translate(${pad} ${rowStartY})">
    ${topLangs.map((l, i) => {
      const y = i * rowH;
      const bw = Math.max((l.percentage / 100) * barW, 4);
      const c = getLangColor(l.name);
      const d = `${(i * 0.08).toFixed(2)}s`;

      const cleanName = escapeXml(l.name);
      const displayName = cleanName.length > 12 ? `${cleanName.substring(0, 10)}..` : cleanName;

      return `
    <g transform="translate(0, ${y})" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${d}" fill="freeze"/>
      
      <!-- Titik Indikator Sederhana -->
      <circle cx="4" cy="0" r="3" fill="${c}" opacity="0.9" />
      
      <!-- Label Nama Bahasa -->
      <text class="lang-label" x="16" y="0" dominant-baseline="central">
        ${displayName.toUpperCase()}
      </text>

      <!-- Sleek Progress Bar (Track belakang dihapus total biar minimalis!) -->
      <rect x="${barX}" y="-2.5" width="0" height="${barH}" rx="${barH / 2}" fill="${c}">
        <animate attributeName="width" from="0" to="${bw}" dur="0.8s" begin="${d}" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
      </rect>

      <!-- Orb Cahaya Lembut di Ujung Bar -->
      <circle cx="${barX}" cy="0" r="1.5" fill="#ffffff" opacity="0">
        <animate attributeName="cx" from="${barX}" to="${barX + bw}" dur="0.8s" begin="${d}" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
        <animate attributeName="opacity" from="0" to="0.85" dur="0.8s" begin="${d}" fill="freeze"/>
      </circle>
      
      <!-- Angka Persentase Sejajar Rapi -->
      <text class="lang-pct" x="${barX + barW + 12}" y="0" dominant-baseline="central">${l.percentage}%</text>
    </g>`;
    }).join("")}
  </g>

  <text class="footer-text" x="${cardWidth - pad}" y="${cardH - 14}" text-anchor="end">DEV FAIRY METRICS</text>
</svg>`;
}

/* ═══════════════════════════════════════════════════
   BARS LAYOUT
   ═══════════════════════════════════════════════════ */
function renderBars(
  langs: { name: string; percentage: number }[],
  theme: CardTheme,
  username: string,
  hideTitle: boolean,
  hideBorder: boolean
): string {
  // Ambil maksimal 4 bahasa agar pembagian 2x2 kolom sangat presisi
  const topLangs = langs.slice(0, 4);

  const cardWidth = 490;
  const pad = 28;
  const titleH = hideTitle ? 0 : 36;

  // Hitung tinggi kartu dinamis berdasarkan jumlah baris grid (2 baris untuk 4 data)
  const gridRows = Math.ceil(topLangs.length / 2);
  const rowHeight = 52;
  const startY = titleH + 32;
  const cardH = startY + gridRows * rowHeight + 20;

  // Parameter Busur Sihir Lingkaran Mini
  const radius = 16;
  const circum = 2 * Math.PI * radius; // ~100.53

  // Emojis representasi elemen magis acak untuk variasi visual
  const elementalEmojis = ["🔥", "💧", "⚡", "🍃"];

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardH}" viewBox="0 0 ${cardWidth} ${cardH}">
  <defs>
    <!-- Gradasi Tema -->
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

    <filter id="blob-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30"/>
    </filter>

    <clipPath id="card-clip">
      <rect width="${cardWidth}" height="${cardH}" rx="20"/>
    </clipPath>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&amp;family=Outfit:wght@600;700;800;900&amp;display=swap');
      
      .title-text { font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 900; fill: ${theme.title}; letter-spacing: 1.5px; }
      .user-text { font-family: 'Outfit', sans-serif; font-size: 10.5px; font-weight: 600; fill: ${theme.textSoft}; opacity: 0.8; }
      
      .node-label { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 900; letter-spacing: 0.5px; fill: ${theme.title}; }
      .node-pct { font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 800; }
      .footer-text { font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 700; fill: ${theme.textSoft}; opacity: 0.4; letter-spacing: 2px; }
    </style>
  </defs>

  <!-- ================= BASE KARTU (CLEAN NO-SHADOW) ================= -->
  <rect x="10" y="10" width="${cardWidth - 20}" height="${cardH - 20}" rx="20" fill="url(#bg)" 
    ${hideBorder ? "" : `stroke="url(#accent)" stroke-width="1.2" stroke-opacity="0.6"`}/>

  <g clip-path="url(#card-clip)">
    <circle cx="70" cy="${cardH - 40}" r="65" fill="${theme.accentSecondary}" opacity="0.22" filter="url(#blob-blur)"/>
    <circle cx="${cardWidth - 70}" cy="40" r="75" fill="${theme.accent}" opacity="0.18" filter="url(#blob-blur)"/>
  </g>

  <rect x="10" y="10" width="${cardWidth - 20}" height="${cardH - 20}" rx="20" fill="url(#shimmer)" pointer-events="none"/>

  <!-- Header -->
  ${!hideTitle ? `
  <g transform="translate(${pad}, 32)">
    <text class="title-text" x="0" y="0">✨ ELEMENTAL MATRIX</text>
    <text class="user-text" x="0" y="14">Multi-axis affinity mapping for @${username}</text>
  </g>
  ` : ""}

  <!-- ================= GRID MATRIX COMPONENT (2x2 FLOATING COLUMNS) ================= -->
  <g transform="translate(0, ${startY})">
    ${topLangs.map((l, i) => {
    // Hitung posisi kolom (0 = kiri, 1 = kanan) dan baris secara matematis
    const col = i % 2;
    const row = Math.floor(i / 2);

    const posX = col === 0 ? pad + 15 : cardWidth / 2 + 10;
    const posY = row * rowHeight + 20;

    const c = getLangColor(l.name);
    const d = `${(i * 0.08).toFixed(2)}s`;

    // Kalkulasi busur lingkaran persentase
    const strokeLength = (l.percentage / 100) * circum;
    const strokeOffset = circum - strokeLength;

    // Handling nama teks panjang (Aman hingga 11 karakter)
    const cleanName = escapeXml(l.name);
    const displayName = cleanName.length > 11 ? `${cleanName.substring(0, 9)}..` : cleanName;
    const emoji = elementalEmojis[i % elementalEmojis.length];

    return `
    <g transform="translate(${posX}, ${posY})" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${d}" fill="freeze"/>
      
      <!-- Cincin Sihir Mini (Pengganti Progress Bar Tradisional) -->
      <g transform="translate(18, 18)">
        <!-- Track lingkaran belakang -->
        <circle cx="0" cy="0" r="${radius}" fill="none" stroke="${theme.cardBorder}" stroke-width="3" opacity="0.2"/>
        
        <!-- Arc isi kemajuan (Mulai berputar dari atas jam 12 via rotate(-90)) -->
        <circle cx="0" cy="0" r="${radius}" fill="none" stroke="${c}" stroke-width="3.5"
          stroke-dasharray="${circum}"
          stroke-dashoffset="${circum}"
          stroke-linecap="round"
          transform="rotate(-90)">
          <animate attributeName="stroke-dashoffset" from="${circum}" to="${strokeOffset}" dur="0.8s" begin="${d}" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
        </circle>
        
        <!-- Emoji Elemen di Tengah Pusat Lingkaran -->
        <text x="0" y="1" font-size="12" text-anchor="middle" dominant-baseline="central" opacity="0.9">${emoji}</text>
      </g>

      <!-- Informasi Teks di Sebelah Kanan Lingkaran -->
      <g transform="translate(48, 18)">
        <text class="node-label" x="0" y="-6" dominant-baseline="central">${displayName.toUpperCase()}</text>
        <text class="node-pct" x="0" y="8" fill="${c}" dominant-baseline="central">${l.percentage}%</text>
      </g>
    </g>`;
  }).join("")}
  </g>

  <!-- Watermark / Footer -->
  <text class="footer-text" x="${cardWidth - pad}" y="${cardH - 14}" text-anchor="end">DEV FAIRY METRICS</text>
</svg>`;
}

/* ═══════════════════════════════════════════════════
   COMPACT LAYOUT
   ═══════════════════════════════════════════════════ */
function renderCompact(
  langs: { name: string; percentage: number }[],
  theme: CardTheme,
  username: string,
  hideTitle: boolean,
  hideBorder: boolean
): string {
  // Ambil maksimal 6 bahasa teratas agar kartu tetap kompak dan tidak kepanjangan ke bawah
  const topLangs = langs.slice(0, 6);

  const cardWidth = 490;
  const pad = 28;
  const titleH = hideTitle ? 0 : 36;
  const barY = titleH + 22; // Memberi breathing room setelah sub-header
  const barH = 12;          // Dibikin sedikit lebih tebal agar gradasi warnanya terlihat mewah
  const totalBar = cardWidth - pad * 2;

  // Kalibrasi layout grid legenda bawah
  const legendCols = 3;
  const colW = Math.floor(totalBar / legendCols);
  const legendRowH = 24; // Jarak vertikal antar baris legenda diperlonggar
  const legendRows = Math.ceil(topLangs.length / legendCols);
  const legendY = barY + barH + 24;
  const cardH = legendY + legendRows * legendRowH + 22;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardH}" viewBox="0 0 ${cardWidth} ${cardH}">
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

    <filter id="blob-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="30"/>
    </filter>

    <clipPath id="card-clip">
      <rect width="${cardWidth}" height="${cardH}" rx="20"/>
    </clipPath>

    <style>
      @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&amp;family=Outfit:wght@600;700;800;900&amp;display=swap');
      
      .title-text { font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 900; fill: ${theme.title}; letter-spacing: 1.5px; }
      .user-text { font-family: 'Outfit', sans-serif; font-size: 10.5px; font-weight: 600; fill: ${theme.textSoft}; opacity: 0.8; }
      .lang-label { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 0.3px; fill: ${theme.title}; }
      .lang-pct { font-family: 'Outfit', sans-serif; font-size: 10.5px; font-weight: 900; fill: ${theme.textSoft}; opacity: 0.8; }
      .footer-text { font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 700; fill: ${theme.textSoft}; opacity: 0.4; letter-spacing: 2px; }
    </style>
  </defs>

  <rect x="10" y="10" width="${cardWidth - 20}" height="${cardH - 20}" rx="20" fill="url(#bg)" 
    ${hideBorder ? "" : `stroke="url(#accent)" stroke-width="1.2" stroke-opacity="0.6"`}/>

  <g clip-path="url(#card-clip)">
    <circle cx="60" cy="${cardH - 40}" r="65" fill="${theme.accentSecondary}" opacity="0.22" filter="url(#blob-blur)"/>
    <circle cx="${cardWidth - 60}" cy="40" r="75" fill="${theme.accent}" opacity="0.18" filter="url(#blob-blur)"/>
  </g>

  <rect x="10" y="10" width="${cardWidth - 20}" height="${cardH - 20}" rx="20" fill="url(#shimmer)" pointer-events="none"/>

  ${!hideTitle ? `
  <g transform="translate(${pad}, 32)">
    <text class="title-text" x="0" y="0">✨ ELEMENT COMPOSITION</text>
    <text class="user-text" x="0" y="14">Compact mastery breakdown for @${username}</text>
  </g>
  ` : ""}

  <g transform="translate(${pad} ${barY})">
    <rect width="${totalBar}" height="${barH}" rx="6" fill="${theme.cardBorder}" opacity="0.15"/>
    
    <g clip-path="url(#card-clip)">
      ${(() => {
      let currentX = 0;
      return topLangs.map((l, i) => {
        const w = Math.max((l.percentage / 100) * totalBar, 2);
        const c = getLangColor(l.name);
        const seg = `
      <rect x="${currentX}" y="0" width="0" height="${barH}" fill="${c}" rx="${i === 0 ? 6 : 0}">
        <animate attributeName="width" from="0" to="${w}" dur="0.8s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
      </rect>`;
        currentX += w;
        return seg;
      }).join("");
    })()}
    </g>
  </g>

  <g transform="translate(0, 0)">
    ${topLangs.map((l, i) => {
      const col = i % legendCols;
      const row = Math.floor(i / legendCols);
      const x = pad + col * colW;
      const y = legendY + row * legendRowH;
      const c = getLangColor(l.name);

      // Proteksi teks panjang kolom legenda (Max 10 karakter agar aman dari tabrakan kesamping)
      const cleanName = escapeXml(l.name);
      const displayName = cleanName.length > 10 ? `${cleanName.substring(0, 8)}..` : cleanName;

      return `
    <g transform="translate(${x} ${y})">
      <circle cx="4" cy="5" r="3.5" fill="${c}" opacity="0.95"/>
      
      <text x="14" y="5" class="lang-label" dominant-baseline="central">
        ${displayName.toUpperCase()} 
        <tspan class="lang-pct"> ${l.percentage}%</tspan>
      </text>
    </g>`;
    }).join("")}
  </g>

  <text class="footer-text" x="${cardWidth - pad}" y="${cardH - 14}" text-anchor="end">DEV FAIRY METRICS</text>
</svg>`;
}

function renderAffinity(
  langs: { name: string; percentage: number }[],
  theme: CardTheme,
  username: string,
  hideTitle: boolean,
  hideBorder: boolean
): string {
  const cardWidth = 490;
  const cardHeight = 190;
  const topLangs = langs.slice(0, 5);

  const r = 36;
  const circumference = 226.2; // 2 * Math.PI * r

  let currentOffset = 0;
  const circleSegments = topLangs.map((l) => {
    const strokeLength = (l.percentage / 100) * circumference;
    const strokeOffset = -currentOffset;
    currentOffset += strokeLength;
    return {
      name: l.name,
      percentage: l.percentage,
      strokeLength,
      strokeOffset,
      color: getLangColor(l.name),
    };
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
    <linearGradient id="shimmer" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.12"/>
      <stop offset="50%" stop-color="${theme.accentSecondary}" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0.02"/>
    </linearGradient>

    <filter id="glow-sm">
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
      
      .title-text { font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 900; fill: ${theme.title}; letter-spacing: 1.5px; }
      .user-text { font-family: 'Outfit', sans-serif; font-size: 10.5px; font-weight: 600; fill: ${theme.textSoft}; opacity: 0.8; }
      .lang-label { font-family: 'Outfit', sans-serif; font-size: 10px; font-weight: 800; letter-spacing: 0.5px; fill: ${theme.title}; }
      .lang-pct { font-family: 'Outfit', sans-serif; font-size: 11px; font-weight: 800; fill: ${theme.title}; }
      .footer-text { font-family: 'Outfit', sans-serif; font-size: 9px; font-weight: 700; fill: ${theme.textSoft}; opacity: 0.4; letter-spacing: 2px; }
    </style>
  </defs>

// ================= BASE KARTU (CLEAN NO MELUBER) ================= -->
  <rect x="10" y="10" width="470" height="170" rx="20" fill="url(#bg)" 
    ${hideBorder ? "" : `stroke="url(#accent)" stroke-width="1.2" stroke-opacity="0.6"`}/>

  <g clip-path="url(#card-clip)">
    <circle cx="110" cy="110" r="75" fill="${theme.accentSecondary}" opacity="0.22" filter="url(#blob-blur)"/>
    <circle cx="370" cy="40" r="95" fill="${theme.accent}" opacity="0.18" filter="url(#blob-blur)"/>
  </g>

  <rect x="10" y="10" width="470" height="170" rx="20" fill="url(#shimmer)" pointer-events="none"/>

  ${!hideTitle ? `
  <g transform="translate(30, 32)">
    <text class="title-text" x="0" y="0">✨ MAGIC AFFINITY</text>
    <text class="user-text" x="0" y="14">Element mastery of ${username}</text>
  </g>
  ` : ""}

  <g transform="translate(85, 112)">
    <circle cx="0" cy="0" r="46" fill="none" stroke="${theme.title}" stroke-width="1.2" stroke-dasharray="4,5" opacity="0.5" filter="url(#glow-sm)">
      <animateTransform 
        attributeName="transform" 
        type="rotate" 
        from="0 0 0" 
        to="360 0 0" 
        dur="25s" 
        repeatCount="indefinite" 
      />
    </circle>
    
    <circle cx="0" cy="0" r="26" fill="none" stroke="${theme.cardBorder}" stroke-width="1.5" opacity="0.3" />
    <text x="0" y="2" font-size="20" text-anchor="middle" dominant-baseline="central" opacity="0.85">🔮</text>

    <g transform="rotate(-90)">
      ${circleSegments.map((seg) => `
      <circle cx="0" cy="0" r="${r}" fill="none" stroke="${seg.color}" stroke-width="7" 
        stroke-dasharray="${seg.strokeLength} ${circumference}" 
        stroke-dashoffset="${seg.strokeOffset}" 
        stroke-linecap="round" opacity="0.95">
        <animate attributeName="stroke-dashoffset" from="${circumference}" to="${seg.strokeOffset}" dur="1s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1"/>
      </circle>`).join("")}
    </g>
  </g>

  <g transform="translate(200, 55)">
    ${topLangs.map((l, i) => {
    const y = i * 23;
    const barX = 96;
    const barW = 105;
    const fillW = Math.max((l.percentage / 100) * barW, 4);
    const c = getLangColor(l.name);
    const d = `${(i * 0.08).toFixed(2)}s`;

    const cleanName = escapeXml(l.name);
    const displayName = cleanName.length > 11 ? `${cleanName.substring(0, 9)}..` : cleanName;

    return `
    <g transform="translate(0, ${y})" opacity="0">
      <animate attributeName="opacity" from="0" to="1" dur="0.4s" begin="${d}" fill="freeze"/>
      
      <circle cx="0" cy="0" r="3.5" fill="${c}" opacity="0.95" />

      <text class="lang-label" x="10" y="0" dominant-baseline="central">
        ${displayName.toUpperCase()}
      </text>

      <rect x="${barX}" y="-3.5" width="${barW}" height="7" rx="3.5" fill="${theme.cardBorder}" opacity="0.18" />
      
      <rect x="${barX}" y="-3.5" width="0" height="7" rx="3.5" fill="${c}">
        <animate attributeName="width" from="0" to="${fillW}" dur="0.8s" begin="${d}" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
      </rect>

      <circle cx="${barX}" cy="0" r="2" fill="#ffffff" opacity="0">
        <animate attributeName="cx" from="${barX}" to="${barX + fillW}" dur="0.8s" begin="${d}" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1"/>
        <animate attributeName="opacity" from="0" to="0.9" dur="0.8s" begin="${d}" fill="freeze"/>
      </circle>
      
      <text class="lang-pct" x="${barX + barW + 12}" y="0" dominant-baseline="central">${l.percentage}%</text>
    </g>`;
  }).join("")}
  </g>

  <text class="footer-text" x="460" y="165" text-anchor="end">DEV FAIRY METRICS</text>
</svg>`;
}