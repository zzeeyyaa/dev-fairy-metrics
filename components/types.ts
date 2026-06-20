export interface GitHubData {
  user: {
    login: string;
    name: string | null;
    avatarUrl: string;
    bio: string | null;
    publicRepos: number;
    followers: number;
    following: number;
    createdAt: string;
    profileUrl: string;
    location: string | null;
  };
  stats: {
    totalRepos: number;
    totalStars: number;
    totalForks: number;
    totalLanguages: number;
    totalCommits?: number;
  };
  languages: {
    name: string;
    bytes: number;
    percentage: number;
  }[];
  topRepos: {
    name: string;
    description: string | null;
    stars: number;
    forks: number;
    language: string | null;
    url: string;
  }[];
}
