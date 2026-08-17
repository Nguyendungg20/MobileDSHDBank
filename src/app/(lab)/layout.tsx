import Link from "next/link";
import { COMPONENTS } from "@/components/registry";
import { LabNavLink } from "./nav-link";

/**
 * Shell for the working surfaces — tokens and the component bench. The gallery
 * at `/` deliberately sits outside this group: it is what stakeholders open, and
 * it should not carry an internal nav.
 *
 * `(lab)` is a route group, so it adds no path segment — /tokens and /dev/button
 * keep their URLs.
 *
 * Two shapes, one markup: a vertical sidebar from `md` up, and a horizontally
 * scrolling tab strip below it. Stacking the full list above the content on a
 * phone would push the component itself a whole screen down — which matters here,
 * since this is a mobile design system and its components get checked on a phone.
 */
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col md:flex-row">
      <aside className="shrink-0 border-b border-neutral-3 bg-neutral-1 md:sticky md:top-0 md:h-screen md:w-240 md:overflow-y-auto md:border-r md:border-b-0">
        <nav className="flex items-center gap-16 overflow-x-auto p-12 md:flex-col md:items-stretch md:gap-24 md:overflow-x-visible md:p-20">
          <Link href="/" className="hidden md:flex md:flex-col md:gap-2">
            <span className="text-overline font-semibold text-brand-red">
              PROTOTYPE LAB
            </span>
            <span className="text-body font-semibold text-neutral-10">
              DS Đi-HDBank
            </span>
          </Link>

          <Section title="Foundations">
            <LabNavLink href="/tokens" label="Design tokens" />
          </Section>

          <Section title={`Components · ${COMPONENTS.length}`}>
            {COMPONENTS.map((c) => (
              <LabNavLink
                key={c.slug}
                href={`/dev/${c.slug}`}
                label={c.name}
                note={c.notes}
              />
            ))}
          </Section>

          <Section title="Prototypes">
            <LabNavLink href="/" label="Gallery" />
          </Section>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex shrink-0 items-center gap-4 md:flex-col md:items-stretch">
      {/* The grouping labels only earn their space in the sidebar. */}
      <p className="hidden text-caption2 font-medium text-neutral-5 md:block md:px-8 md:pb-4">
        {title}
      </p>
      {children}
    </div>
  );
}
