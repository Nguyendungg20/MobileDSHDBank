/**
 * The prototype index. Adding an entry here is what makes a prototype appear on
 * the gallery at `/` — the route itself lives at `src/app/p/<slug>/page.tsx`.
 *
 * Kept as a hand-edited manifest rather than derived from the filesystem: a
 * prototype needs a human-written title, an audience and a status, and those
 * cannot be inferred from a folder name. Use the /new-prototype skill to add one.
 */

export type PrototypeStatus = "draft" | "review" | "final";

export interface Prototype {
  slug: string;
  title: string;
  /** One line a stakeholder can read — what this shows and what feedback you want. */
  summary: string;
  status: PrototypeStatus;
  /** ISO date, YYYY-MM-DD. */
  updated: string;
  /** Optional Figma URL this prototype was built from. */
  figma?: string;
}

export const PROTOTYPES: Prototype[] = [];

export const STATUS_LABEL: Record<PrototypeStatus, string> = {
  draft: "Nháp",
  review: "Đang review",
  final: "Chốt",
};
