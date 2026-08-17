import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "tertiary",
  "underline-white",
  "underline-gradient",
];
const SIZES: ButtonSize[] = ["large", "medium", "small", "x-small"];

const ChevronRight = () => (
  <svg className="size-20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ButtonDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Button — states × variants</h1>

      {VARIANTS.map((variant) => {
        const onGradient = variant === "underline-gradient";
        return (
          <section key={variant} className="flex flex-col gap-12">
            <h2 className="text-subheadline font-semibold text-neutral-7">
              {variant}
            </h2>
            <div
              className={cnRow(onGradient)}
              data-variant={variant}
            >
              <Button variant={variant}>Enabled</Button>
              <Button variant={variant} disabled>
                Disabled
              </Button>
              <Button variant={variant} loading>
                Loading
              </Button>
              <Button variant={variant} iconRight={<ChevronRight />}>
                Icon &gt;
              </Button>
              <Button variant={variant} iconOnly aria-label="Tiếp tục">
                <ChevronRight />
              </Button>
            </div>
          </section>
        );
      })}

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Sizes (primary) — 56 / 48 / 44 / 32
        </h2>
        <div className="flex flex-wrap items-center gap-12">
          {SIZES.map((size) => (
            <Button key={size} size={size}>
              {size}
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          fullWidth
        </h2>
        <Button fullWidth>Tiếp tục</Button>
      </section>
    </main>
  );
}

function cnRow(onGradient: boolean) {
  return [
    "flex flex-wrap items-center gap-12 rounded-12 p-16",
    onGradient ? "bg-brand-gradient-h" : "bg-neutral-1",
  ].join(" ");
}
