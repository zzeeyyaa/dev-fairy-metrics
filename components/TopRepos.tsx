import { motion } from "framer-motion";
import { Heart, ExternalLink, Star, GitFork } from "lucide-react";
import { GitHubData } from "./types";
import { containerVariants, itemVariants, cardHover } from "./constants";
import { getLangColor } from "../lib/utils";

export function TopRepos({ data }: { data: GitHubData }) {
  if (data.topRepos.length === 0) return null;

  return (
    <motion.section className="h-full flex flex-col" variants={itemVariants} id="top-repos">
      <h3
        className="text-lg font-bold mb-4 flex items-center gap-2"
        style={{
          fontFamily: "var(--font-outfit)",
          color: "hsl(var(--fairy-text))",
        }}
      >
        <Heart
          className="w-5 h-5"
          style={{ color: "hsl(var(--fairy-primary))" }}
        />
        Top Repositories
      </h3>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full"
        variants={containerVariants}
      >
        {data.topRepos.slice(0, 4).map((repo) => (
          <motion.a
            key={repo.name}
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-5 block no-underline"
            variants={itemVariants}
            whileHover={cardHover}
          >
            <div className="flex items-start justify-between mb-2">
              <h4
                className="font-semibold text-sm truncate flex-1 mr-2"
                style={{
                  fontFamily: "var(--font-outfit)",
                  color: "hsl(var(--fairy-text))",
                }}
              >
                {repo.name}
              </h4>
              <ExternalLink
                className="w-3.5 h-3.5 flex-shrink-0"
                style={{ color: "hsl(var(--fairy-text-soft))" }}
              />
            </div>
            {repo.description && (
              <p
                className="text-xs mb-3 line-clamp-2"
                style={{ color: "hsl(var(--fairy-text-soft))" }}
              >
                {repo.description}
              </p>
            )}
            <div
              className="flex items-center gap-3 text-xs"
              style={{ color: "hsl(var(--fairy-text-soft))" }}
            >
              {repo.language && (
                <span className="inline-flex items-center gap-1">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{
                      background: getLangColor(repo.language),
                    }}
                  />
                  {repo.language}
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Star className="w-3 h-3" />
                {repo.stars}
              </span>
              <span className="inline-flex items-center gap-1">
                <GitFork className="w-3 h-3" />
                {repo.forks}
              </span>
            </div>
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  );
}
