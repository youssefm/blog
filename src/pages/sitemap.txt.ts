import { PAGE_SIZE, getPublishedPosts } from "lib/posts";

const BASE_URL = "https://www.youssefm.com";

const URLS = [BASE_URL];
const POSTS = await getPublishedPosts();
for (const post of POSTS) {
  URLS.push(`${BASE_URL}/posts/${post.slug}`);
}
const PAGE_COUNT = Math.ceil(POSTS.length / PAGE_SIZE);
for (let i = 0; i < PAGE_COUNT; i++) {
  URLS.push(`${BASE_URL}/blog/${i + 1}`);
}

export async function GET() {
  return new Response(URLS.join("\n"));
}
