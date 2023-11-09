import { getCollection } from "astro:content";

import type { Post } from "./type";
import { sortBy } from "./util";

export async function getPublishedPosts(
  descending: boolean = false,
): Promise<Post[]> {
  let posts = await getCollection("posts");
  posts = posts.filter((post) => !post.data.draft);
  sortBy(posts, (post) => post.data.publishedOn, descending);
  return posts;
}
