import { getPublishedPosts } from "../lib/posts";

const BASE_URL = "https://www.youssefm.com";

const URLS = [BASE_URL];
const POSTS = await getPublishedPosts();
for (const post of POSTS) {
  URLS.push(`${BASE_URL}/posts/${post.slug}`);
}

export async function GET() {
  return new Response(URLS.join("\n"));
}
