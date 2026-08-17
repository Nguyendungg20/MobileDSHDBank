import { Spinner, type SpinnerSize } from "@/components/ui/spinner";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { Surface } from "@/components/ui/surface";

const SPINNER_SIZES: SpinnerSize[] = ["48", "32", "24", "20", "16"];

export default function LoadingDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Loading &amp; Skeleton</h1>

      {/* ---- Spinner ------------------------------------------------- */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Spinner — sizes (Figma: only 48 carries brand-red; 32/24/20/16 read Neutral/5)
        </h2>
        <div className="flex flex-wrap items-end gap-32 rounded-12 bg-neutral-1 p-16">
          {SPINNER_SIZES.map((size) => (
            <div key={size} className="flex flex-col items-center gap-8">
              <Spinner size={size} />
              <span className="text-caption2 text-neutral-6">{size}px</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Spinner — on a dark / brand surface
        </h2>
        <div className="flex items-center justify-center gap-32 rounded-12 bg-brand-black p-24">
          <Spinner size="48" />
          <Spinner size="24" />
        </div>
      </section>

      {/* ---- Skeleton primitives --------------------------------------- */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Skeleton — primitives (circle, line, rect)
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <Skeleton circle width={32} />
          <Skeleton circle width={48} />
          <Skeleton width={160} height={12} />
          <Skeleton width={96} height={96} radius="8" />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Skeleton — multiline text block (Figma: 2 full lines + 76% final line, gap 16)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <SkeletonText className="max-w-[342px]" />
        </div>
      </section>

      {/* ---- Composed skeleton screen (Figma "Skeleton 1") ------------- */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Composed — list row skeleton (Figma &quot;Skeleton 1&quot;)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Surface
            radius="16"
            padding="16"
            bordered
            className="flex max-w-[390px] gap-8"
          >
            <Skeleton circle width={32} />
            <div className="flex flex-1 flex-col gap-24">
              <Skeleton width={158} height={12} />
              <SkeletonText lines={2} lastLineWidth="76%" />
            </div>
          </Surface>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Reduced motion
        </h2>
        <p className="text-caption1 text-neutral-6">
          Both components disable their animation under
          <code className="mx-4 rounded-4 bg-neutral-2 px-4 py-2">
            prefers-reduced-motion: reduce
          </code>
          — toggle it in your OS/browser settings to verify.
        </p>
      </section>
    </main>
  );
}
