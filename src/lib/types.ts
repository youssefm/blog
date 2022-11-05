export interface PostFrontmatter {
  title: string;
  description: string;
  publishedOn: string;
  draft?: boolean;
}

export interface Post {
  url: string;
  frontmatter: PostFrontmatter;
}
