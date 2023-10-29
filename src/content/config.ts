import { z, defineCollection } from "astro:content";

export const collections = {
  posts: defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      description: z.string(),
      publishedOn: z.date(),
      draft: z.boolean().optional(),
    }),
  }),
};
