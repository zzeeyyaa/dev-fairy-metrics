export const LANGUAGE_COLORS: Record<string, string> = {
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
  Haskell: "#5e5086",
  Elixir: "#6e4a7e",
  Scala: "#c22d40",
  R: "#198CE7",
  Julia: "#a270ba",
  Zig: "#ec915c",
  Nim: "#ffc200",
  OCaml: "#3be133",
  Clojure: "#db5855",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  Jupyter: "#F37626",
  "Jupyter Notebook": "#DA5B0B",
  Markdown: "#083fa1",
  MDX: "#fcb32c",
  Astro: "#ff5a03",
  Nix: "#7e7eff",
};

export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function getLangColor(lang: string): string {
  return LANGUAGE_COLORS[lang] || `hsl(${hashString(lang) % 360}, 65%, 60%)`;
}
