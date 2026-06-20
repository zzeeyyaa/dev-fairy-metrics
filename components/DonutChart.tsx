import { motion } from "framer-motion";
import * as Tooltip from "@radix-ui/react-tooltip";
import { GitHubData } from "./types";
import { getLangColor } from "../lib/utils";

export function DonutChart({
  languages,
}: {
  languages: GitHubData["languages"];
}) {
  const topLangs = languages.slice(0, 8);
  const otherPercentage = languages
    .slice(8)
    .reduce((sum, l) => sum + l.percentage, 0);

  const allSegments = [
    ...topLangs,
    ...(otherPercentage > 0
      ? [{ name: "Other", percentage: otherPercentage, bytes: 0 }]
      : []),
  ];

  // Build SVG donut segments
  const radius = 15.915;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56">
        <svg viewBox="0 0 42 42" className="w-full h-full donut-chart">
          {allSegments.map((lang, i) => {
            const dashArray = (lang.percentage / 100) * circumference;
            const dashOffset = -(offset / 100) * circumference;
            offset += lang.percentage;

            return (
              <Tooltip.Root key={lang.name}>
                <Tooltip.Trigger asChild>
                  <motion.circle
                    cx="21"
                    cy="21"
                    r={radius}
                    className="donut-segment"
                    stroke={getLangColor(lang.name)}
                    strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                    strokeDashoffset={dashOffset}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{
                      strokeDasharray: `${dashArray} ${circumference - dashArray}`,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.08,
                      ease: [0.34, 1.56, 0.64, 1],
                    }}
                    style={{ cursor: "pointer" }}
                  />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="glass-pill"
                    style={{
                      color: "hsl(var(--fairy-text))",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      padding: "6px 14px",
                    }}
                    sideOffset={5}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-1.5"
                      style={{
                        background: getLangColor(lang.name),
                        verticalAlign: "middle",
                      }}
                    />
                    {lang.name}: {lang.percentage}%
                    <Tooltip.Arrow
                      style={{ fill: "rgba(255,255,255,0.5)" }}
                    />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          })}
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-2xl sm:text-3xl font-bold"
            style={{
              fontFamily: "var(--font-outfit)",
              color: "hsl(var(--fairy-text))",
            }}
          >
            {languages.length}
          </span>
          <span
            className="text-xs"
            style={{ color: "hsl(var(--fairy-text-soft))" }}
          >
            languages
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {allSegments.map((lang) => (
          <motion.span
            key={lang.name}
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: "hsl(var(--fairy-text-soft))" }}
            whileHover={{ scale: 1.08 }}
          >
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ background: getLangColor(lang.name) }}
            />
            {lang.name}{" "}
            <span style={{ color: "hsl(var(--fairy-text))", fontWeight: 600 }}>
              {lang.percentage}%
            </span>
          </motion.span>
        ))}
      </div>
    </div>
  );
}
