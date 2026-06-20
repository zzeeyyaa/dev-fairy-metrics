import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { GitHubData } from "../components/types";

export function useWidgetBuilder(data: GitHubData | null) {
  const [cardType, setCardType] = useState<"stats" | "languages">("stats");
  const [statsLayout, setStatsLayout] = useState<"classic" | "rpg">("classic");
  const [widgetMode, setWidgetMode] = useState<"light" | "dark">("light");
  const [widgetTheme, setWidgetTheme] = useState<string>("cotton-candy");
  const [widgetLayout, setWidgetLayout] = useState<"donut" | "bars" | "compact" | "affinity">("donut");
  const [widgetHideTitle, setWidgetHideTitle] = useState<boolean>(false);
  const [widgetHideBorder, setWidgetHideBorder] = useState<boolean>(false);
  const [widgetTitle, setWidgetTitle] = useState<string>("");
  const [widgetLangsCount, setWidgetLangsCount] = useState<number>(8);
  const [copiedFormat, setCopiedFormat] = useState<"markdown" | "html" | null>(null);
  
  const [origin, setOrigin] = useState("");
  const [mounted, setMounted] = useState(false);

  const handleModeChange = (mode: "light" | "dark") => {
    setWidgetMode(mode);
    if (mode === "dark") {
      const mappings: Record<string, string> = {
        "cotton-candy": "cotton-candy-dark",
        "strawberry": "strawberry-dark",
        "lavender": "lavender-dark",
        "mint": "mint-dark",
        "peach": "peach-dark",
      };
      setWidgetTheme(mappings[widgetTheme] || "dark-fairy");
    } else {
      const mappings: Record<string, string> = {
        "cotton-candy-dark": "cotton-candy",
        "strawberry-dark": "strawberry",
        "lavender-dark": "lavender",
        "mint-dark": "mint",
        "peach-dark": "peach",
        "dark-fairy": "cotton-candy",
      };
      setWidgetTheme(mappings[widgetTheme] || "cotton-candy");
    }
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const widgetQueryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("theme", widgetTheme);
    if (widgetHideTitle) params.set("hide_title", "true");
    if (widgetHideBorder) params.set("hide_border", "true");

    if (cardType === "stats") {
      if (widgetTitle.trim()) params.set("title", widgetTitle.trim());
      if (statsLayout === "rpg") params.set("rpg", "true");
      return params.toString();
    } else {
      params.set("layout", widgetLayout);
      params.set("langs_count", widgetLangsCount.toString());
      return params.toString();
    }
  }, [cardType, widgetTheme, widgetLayout, widgetHideTitle, widgetHideBorder, widgetTitle, widgetLangsCount, statsLayout]);

  const previewUrl = useMemo(() => {
    if (!data) return "";
    const username = encodeURIComponent(data.user.login);
    const suffix = cardType === "stats" ? "" : "/languages";
    const baseParams = widgetQueryString ? `${widgetQueryString}&` : "";
    const q = `?${baseParams}_t=${Date.now()}`;
    return `/api/card/${username}${suffix}${q}`;
  }, [data, cardType, widgetQueryString]);

  const widgetUrl = useMemo(() => {
    if (!data) return "";
    const base = origin || "";
    return `${base}${previewUrl}`;
  }, [data, origin, previewUrl]);

  const markdownCode = useMemo(() => {
    if (!data) return "";
    const username = data.user.login;
    const title = cardType === "stats" ? `${username}'s GitHub Stats` : `${username}'s Top Languages`;
    return `[![${title}](${widgetUrl})](https://github.com/${username})`;
  }, [data, cardType, widgetUrl]);

  const htmlCode = useMemo(() => {
    if (!data) return "";
    const username = data.user.login;
    const title = cardType === "stats" ? `${username}'s GitHub Stats` : `${username}'s Top Languages`;
    return `<a href="https://github.com/${username}">\n  <img align="center" src="${widgetUrl}" alt="${title}" />\n</a>`;
  }, [data, cardType, widgetUrl]);

  const handleCopy = (text: string, format: "markdown" | "html") => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    toast.success("✨ Copied to clipboard! Ready to paste into your GitHub README! 💖");
    
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.8 },
      colors: ["#e8a0bf", "#b39ddb", "#80cbc4", "#f4b183"],
    });

    setTimeout(() => {
      setCopiedFormat(null);
    }, 2000);
  };

  return {
    cardType, setCardType,
    statsLayout, setStatsLayout,
    widgetMode, setWidgetMode: handleModeChange,
    widgetTheme, setWidgetTheme,
    widgetLayout, setWidgetLayout,
    widgetHideTitle, setWidgetHideTitle,
    widgetHideBorder, setWidgetHideBorder,
    widgetTitle, setWidgetTitle,
    widgetLangsCount, setWidgetLangsCount,
    previewUrl,
    markdownCode,
    htmlCode,
    handleCopy,
    copiedFormat,
    mounted
  };
}
