/**
 * ============================================================
 *  WRITING PIECES — EDIT HERE
 * ============================================================
 *
 *  To rename a piece, change its `title`.
 *  To change its URL, change its `slug` (kebab-case, no spaces).
 *  To change the small label above the title, edit `category`.
 *  To change the body copy, edit `body` (array of paragraphs).
 *
 *  The home-page teaser is derived automatically from the first
 *  paragraph of `body` via getExcerpt(), so updating the prose
 *  here also updates the teaser on `/`.
 *
 *  The slug MUST match the `writingSlug` set on the matching
 *  block in src/routes/index.tsx so the home-page link routes
 *  to the right piece.
 * ============================================================
 */

export type WritingPiece = {
  /** URL segment, e.g. /writing/getting-away */
  slug: string;
  /** Headline shown as the H1 on the piece page */
  title: string;
  /** Small uppercase label shown above the title */
  category: string;
  /** Body copy as an ordered list of paragraphs */
  body: string[];
  /** When true, featured on the landing page and excluded from /archive. */
  featured?: boolean;
};

export const writingPieces: WritingPiece[] = [
  {
    slug: "the-nature-of-design",
    featured: true,
    title: "The nature of COLLECTIVE",
    category: "Essay",
    body: [
      "Design begins long before anything is made. It begins in the way we look — the small, almost involuntary act of noticing that one thing could be otherwise. A door that opens the wrong way. A chair that asks too much of the body. A sentence that says nearly, but not quite, what it means.",
      "To design is to take that noticing seriously. It is to insist that the shape of ordinary things is not inevitable, and that the gap between what is and what could be is the only room any of us ever really work in.",
      "I think this is why design feels, at its best, less like invention and more like attention. The forms are already implied by the world. The job is to listen closely enough to hear them, and patient enough to let them arrive without forcing.",
      "Everything else — the tools, the software, the disciplines we sort ourselves into — is downstream of that first act of looking. Lose the looking and the craft turns decorative. Keep it, and even the smallest object can carry a kind of argument about how life might be lived.",
    ],
  },
  {
    slug: "creative-being",
    featured: true,
    title: "Creative being",
    category: "Reflection",
    body: [
      "There is a quiet difference between making something and being someone who makes. The first is an event; the second is a posture — a way of standing in the day that keeps the hands and the mind a little open, a little willing.",
      "Most of what I have learned about creative work has nothing to do with output. It has to do with showing up on the days when nothing arrives, and trusting that the showing up is itself the practice.",
      "The work, when it comes, is almost a by-product. What is really being made is a self — slowly, unglamorously, one small decision at a time — that can hold the next idea when it appears without flinching or grasping.",
      "I have stopped believing in inspiration as a weather system that visits the lucky. I believe in a room you keep ready. Most days it is empty. Some days something walks in. Either way, the room is the work.",
    ],
  },
  {
    slug: "getting-away",
    featured: true,
    title: "Getting Away",
    category: "Reflection",
    body: [
      "We talk about getting away as if the point were the place — a coast, a mountain, a city whose name we have been saying for years. But the place is mostly an excuse. What we are really after is a few days of being unreachable to ourselves.",
      "The version of us that runs the week is loud. It books, replies, optimises, remembers. Travel quiets it not by entertaining it but by depriving it of its tasks. Without an inbox to manage, the inner manager loses its grip, and someone older and slower steps forward.",
      "That person notices light. Walks without a destination. Eats when hungry. Is moved, sometimes, by very small things — the geometry of a window, the way a stranger speaks to a child, a kind of bread.",
      "The trip ends and we come home and the manager returns within hours, as if it had been waiting in the hallway. But something has shifted. We have been reminded that we are not only the role we play. Getting away, in the end, is mostly about coming back as a slightly larger person than the one who left.",
    ],
  },
];

/**
 * Return the opening of a piece, suitable for a home-page teaser.
 * Trims to roughly 2–3 lines (~maxChars) on a word boundary and
 * appends an ellipsis when the first paragraph is longer than that.
 */
export function getExcerpt(piece: WritingPiece, maxChars = 240): string {
  const first = piece.body[0] ?? "";
  if (first.length <= maxChars) return first;
  const slice = first.slice(0, maxChars);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > maxChars * 0.6 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[,;:\s]+$/, "")}…`;
}
