import { useState, useCallback, useEffect } from "react";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { GitHubData } from "../components/types";

export function useGitHubData() {
  const [usernameParam, setUsernameParam] = useQueryState("user", {
    defaultValue: "",
  });
  const [inputValue, setInputValue] = useState(usernameParam || "");
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (username: string) => {
      if (!username.trim()) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/github/${encodeURIComponent(username.trim())}`);
        const json = await res.json();

        if (json.error) {
          throw new Error(json.error);
        }

        setData(json);
        setUsernameParam(username.trim());

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#e8a0bf", "#b39ddb", "#80cbc4", "#f4b183", "#f7df1e"],
          shapes: ["circle", "star"],
          ticks: 120,
          scalar: 0.9,
        });

        toast.success(`✨ Loaded stats for ${json.user.name || username}!`);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [setUsernameParam]
  );

  useEffect(() => {
    if (usernameParam && !data) {
      fetchData(usernameParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(inputValue);
  };

  return {
    inputValue,
    setInputValue,
    data,
    loading,
    error,
    handleSubmit,
  };
}
