export interface File {
  name: string;
  extension: string;
  content: string;
}

export interface Directory {
  type: string;
  size: number;
  name: string;
  path: string;
  content?: string;
  sha: string;
  url: string;
  git_url: string;
  html_url: string;
  download_url: string;
  _links: {
    git: string;
    html: string;
    self: string;
  };
}

export interface RepoInfo {
  owner: string;
  repo: string;
  root: Directory[];
}
