import { Badge, type BadgeVariant } from "@/components/ui/badge";

const VARIANTS: BadgeVariant[] = ["grey", "green", "yellow", "red", "blue"];

const InfoIcon = () => (
  <svg className="size-12" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path
      d="M12 11v5M12 8v.01"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function BadgeDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Badge — bold × type</h1>
      <p className="max-w-[600px] text-caption1 text-neutral-6">
        Figma axes: Bold (false/true) × Type (Grey/Green/Yellow/Red/Blue).
        Note the &quot;Yellow&quot; bold variant is actually painted with
        Semantic/Orange/6 in Figma, not Yellow/6 — read verbatim.
      </p>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          bold=false (tint)
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          {VARIANTS.map((v) => (
            <Badge key={v} variant={v} icon={<InfoIcon />}>
              Label
            </Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          bold=true (solid)
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          {VARIANTS.map((v) => (
            <Badge key={v} variant={v} bold icon={<InfoIcon />}>
              Label
            </Badge>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          No icon
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          {VARIANTS.map((v) => (
            <Badge key={v} variant={v}>
              Label
            </Badge>
          ))}
        </div>
      </section>
    </main>
  );
}
