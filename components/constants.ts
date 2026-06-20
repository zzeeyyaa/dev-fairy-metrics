export const THEMES = [
  { name: "Cotton Candy", class: "theme-cotton-candy", color: "#e8a0bf" },
  { name: "Strawberry", class: "theme-strawberry", color: "#e88a9a" },
  { name: "Lavender", class: "theme-lavender", color: "#b39ddb" },
  { name: "Mint", class: "theme-mint", color: "#80cbc4" },
  { name: "Peach", class: "theme-peach", color: "#f4b183" },
  { name: "Dark Fairy 🔮", class: "theme-dark-fairy", color: "#7e57c2" },
] as const;

export const SPARKLE_POSITIONS = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 8.5 + Math.random() * 5) % 100}%`,
  top: `${(i * 7.3 + Math.random() * 8) % 100}%`,
  delay: `${i * 0.4 + Math.random() * 2}s`,
  size: `${4 + Math.random() * 4}px`,
}));

export const jellySpring = { type: "spring" as const, stiffness: 260, damping: 20 };

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.92 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: jellySpring,
  },
};

export const cardHover = {
  scale: 1.02,
  y: -4,
  transition: jellySpring,
};
