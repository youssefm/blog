export interface PostFrontmatter {
  title: string;
  description: string;
  publishedOn: string;
}

export interface Post {
  url: string;
  frontmatter: PostFrontmatter;
}
