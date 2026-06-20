import { type NextRequest } from "next/server";

export const revalidate = 300; // Cache for 5 minutes

interface GitHubRepo {
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
  description: string | null;
  html_url: string;
  size: number;
}

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
  location: string | null;
}

async function githubFetch(url: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "dev-fairy-metrics",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("User not found");
    }
    if (res.status === 403) {
      throw new Error("API rate limit exceeded. Please add a GITHUB_TOKEN.");
    }
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  try {
    // Fetch user profile
    const user: GitHubUser = await githubFetch(
      `https://api.github.com/users/${encodeURIComponent(username)}`
    );

    // Fetch all repos (paginated, up to 200)
    const allRepos: GitHubRepo[] = [];
    let page = 1;
    const perPage = 100;

    while (page <= 2) {
      const repos: GitHubRepo[] = await githubFetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated`
      );
      allRepos.push(...repos);
      if (repos.length < perPage) break;
      page++;
    }

    // Filter out forks for language stats
    const ownRepos = allRepos.filter((r) => !r.fork);

    // Fetch language breakdowns for top repos (limit to avoid rate limits)
    const topRepos = ownRepos.slice(0, 30);
    const languagePromises = topRepos.map((repo) =>
      githubFetch(
        `https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/languages`
      ).catch(() => ({}))
    );
    const languageResults = await Promise.all(languagePromises);

    // Aggregate language bytes
    const languageBytes: Record<string, number> = {};
    for (const langs of languageResults) {
      for (const [lang, bytes] of Object.entries(langs as Record<string, number>)) {
        languageBytes[lang] = (languageBytes[lang] || 0) + bytes;
      }
    }

    // Calculate percentages
    const totalBytes = Object.values(languageBytes).reduce((a, b) => a + b, 0);
    const languages = Object.entries(languageBytes)
      .map(([name, bytes]) => ({
        name,
        bytes,
        percentage: totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
      }))
      .sort((a, b) => b.bytes - a.bytes);

    // Aggregate stats
    const totalStars = allRepos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const totalForks = allRepos.reduce((sum, r) => sum + r.forks_count, 0);

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

    return Response.json({
      user: {
        login: user.login,
        name: user.name,
        avatarUrl: user.avatar_url,
        bio: user.bio,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        createdAt: user.created_at,
        profileUrl: user.html_url,
        location: user.location,
      },
      stats: {
        totalRepos: allRepos.length,
        totalStars,
        totalForks,
        totalLanguages: languages.length,
        totalCommits,
      },
      languages,
      topRepos: ownRepos.slice(0, 6).map((r) => ({
        name: r.name,
        description: r.description,
        stars: r.stargazers_count,
        forks: r.forks_count,
        language: r.language,
        url: r.html_url,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return Response.json({ error: message }, { status: 400 });
  }
}
