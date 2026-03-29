# Blog Voice Guide

## Tone

Conversational, approachable, and confident without being arrogant. The writing feels like a knowledgeable friend explaining something over coffee. Casual asides and light humor appear naturally ("_cough... Safari_", "Well, not so fast", "And just like that"). The tone is warm and encouraging, never condescending. Avoid self-deprecating humor that undersells the work (e.g., "spent way too much time on this"). Section headings should acknowledge tradeoffs fairly, not sound combative ("The limits of X" over "The case against X").

## Perspective & Pronouns

- **"We"** is the default when walking through a problem or solution with the reader — it creates a sense of collaboration ("Let's see what that looks like", "we've solved our race condition").
- **"You"** addresses the reader directly, especially when describing their likely experience ("If you're running Django at scale, you're bound to run into race conditions").
- **"I"** appears sparingly for personal opinions, recommendations, and anecdotes ("my own personal recommendation is...", "I petitioned Microsoft to fix this").

## Structure

- **Problem-first**: Posts open by establishing a relatable problem or scenario before introducing any solution.
- **Incremental code examples**: Code is introduced in stages, building on previous snippets. Highlighted lines draw attention to what changed.
- **Clear section headings**: Content is broken into logical sections with descriptive headers.
- **Conclusion sections**: Posts end with a concise summary of key takeaways, often with links to additional resources or a forward-looking thought.
- **TLDR when appropriate**: For straightforward how-to posts, a code-first TLDR may appear at the top ("here's the HTML and CSS. Keep reading for an explanation").

## Technical Depth

Goes deep but never assumes the reader already knows everything. Key concepts are explained inline when they appear (e.g., transaction isolation levels, symmetric-key encryption, non-repeatable reads). The writing builds from simple to complex, ensuring the reader can follow the full reasoning chain. Bolding highlights important terms on first introduction. All numerical claims should be verified computationally. If you say "258 times more" or "year 6028", run the math. When making comparisons, be specific and fair: acknowledge what alternatives do well before explaining where they fall short.

## Personal Touches

Posts are grounded in real-world experience. References to actual work (Inflection AI, Pi), personal background (Caltech, economics), and personal projects (stream-event-source, the blog itself) give the writing authenticity. The author isn't afraid to share opinions and make concrete recommendations.

## Sentence Style

Clear and direct. Sentences are concise without feeling terse. Complexity comes from the ideas, not the sentence structure. Bold is used for emphasis on key concepts and terms. Occasional rhetorical questions guide the reader ("So how do we fix this?", "So now we're done right?").

## Opening Hooks

Posts typically open in one of two ways:

1. **Relatable scenario**: Connects with the reader's likely experience ("If you're running Django at scale...", "As you develop Python applications, one of the most common things you'll be doing is...").
2. **Intriguing observation**: Draws the reader in with something interesting about the topic ("At the end of my sophomore year at Caltech, I made the decision to forgo a career in physics...").

## Content Philosophy

- **Practical over theoretical**: Every post solves a real problem or introduces something useful. Even the more conceptual post on upgrading packages is framed around actionable decision-making.
- **Show, don't just tell**: Code examples do the heavy lifting. Explanations accompany the code rather than replacing it.
- **Multiple solutions when applicable**: When there's more than one way to solve a problem, both are presented with honest tradeoffs rather than dogmatically picking one.
- **Medium length**: Posts are thorough enough to fully cover the topic but don't pad with unnecessary content. They get to the point.
- **Back up claims**: Performance claims should include benchmarks with links to reproducible scripts.
- **Motivation before solution**: When announcing a project, establish why existing solutions aren't enough before introducing your own.

## Word Choice

Technical but accessible. Jargon is used when it's the right term for the concept, but it's always explained on first use. Analogies bridge unfamiliar concepts to familiar ones (economics applied to software decisions, database locks as "acquiring" something). Language is modern and natural — no stiff academic tone.

## Formatting Preferences

- Avoid em dashes. Use commas, periods, or parentheses instead.
- Avoid scientific notation in prose. Prefer expressions like $58^{14}$ or plain language ("about 258 times more") over $4.88 \times 10^{24}$.
- Use concrete examples and visual breakdowns when explaining structure (e.g., an annotated diagram showing which characters map to which parts of an ID).

## Post Types

The blog covers a mix of:

- Step-by-step tutorials (scroll progress bar, Python in VS Code)
- Deep technical explanations (Django race conditions, transferring cookies)
- Package/tool announcements (stream-event-source)
- Opinion and analysis pieces (upgrading packages)
