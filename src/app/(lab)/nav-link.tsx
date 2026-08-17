"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/**
 * Split out as a client component purely so the layout around it can stay a
 * server component — `usePathname` is all that needs the client boundary.
 */
export function LabNavLink({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note?: string;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex shrink-0 flex-col gap-2 whitespace-nowrap rounded-8 px-8 py-8 transition-colors",
        active ? "bg-brand-red/8" : "hover:bg-neutral-2",
      )}
    >
      <span
        className={cn(
          "text-subheadline",
          active
            ? "font-semibold text-brand-red"
            : "font-medium text-neutral-8",
        )}
      >
        {label}
      </span>
      {/* The Figma axes are useful context in the sidebar but would bloat the
          mobile tab strip into two lines. */}
      {note ? (
        <span className="hidden text-caption2 text-neutral-5 md:block">
          {note}
        </span>
      ) : null}
    </Link>
  );
}
