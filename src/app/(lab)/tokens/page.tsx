const RAMPS = ["neutral", "red", "orange", "yellow", "green", "blue", "purple"];

const BRAND = [
  { name: "brand-red", hex: "#da2128" },
  { name: "brand-orange", hex: "#faa61a" },
  { name: "brand-yellow", hex: "#ffdd00" },
  { name: "brand-black", hex: "#333333" },
  { name: "brand-white", hex: "#ffffff" },
];

// Class names are written as literals so Tailwind's source scanner finds them.
const TYPE = [
  { token: "text-large-title", label: "Large Title", spec: "32 / 130% / -0.96" },
  { token: "text-title2", label: "Title 2", spec: "24 / 130% / -0.3" },
  { token: "text-title3", label: "Title 3", spec: "20 / 130% / -0.6" },
  { token: "text-body", label: "Body", spec: "16 / 130% / -0.2" },
  { token: "text-subheadline", label: "Subheadline", spec: "14 / 130% / -0.2" },
  { token: "text-caption1", label: "Caption 1", spec: "12 / 130% / -0.1" },
  { token: "text-caption2", label: "Caption 2", spec: "11 / 130% / -0.2" },
  { token: "text-overline", label: "Overline", spec: "12 / 18px / +1" },
];

const RADII = [4, 8, 12, 16, 20, 24, 32];
const SHADOWS = [1, 2, 3, 4, 5];

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-16">
      <div className="flex flex-col gap-4">
        <h2 className="text-title3 font-semibold text-neutral-10">{title}</h2>
        {note ? <p className="text-caption1 text-neutral-6">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

export default function TokensPage() {
  return (
    <main className="mx-auto flex w-full max-w-[960px] flex-col gap-48 px-24 py-48">
      <header className="flex flex-col gap-8">
        <p className="text-overline font-semibold text-brand-red">
          DESIGN TOKENS
        </p>
        <h1 className="text-large-title font-semibold text-neutral-10">
          DS Đi-HDBank
        </h1>
        <p className="text-body text-neutral-6">
          Sinh trực tiếp từ Paint / Text / Effect styles của file Figma. Bảng màu
          mặc định của Tailwind đã bị gỡ — chỉ token của DS tồn tại.
        </p>
      </header>

      <Section
        title="Brand"
        note="Mỗi màu brand trùng đúng bậc /6 của thang semantic tương ứng."
      >
        <div className="flex flex-wrap gap-16">
          {BRAND.map((c) => (
            <div key={c.name} className="flex flex-col gap-8">
              <div
                className="size-80 rounded-12 border border-neutral-3 shadow-1"
                style={{ background: c.hex }}
              />
              <div className="flex flex-col gap-2">
                <span className="text-caption1 font-medium text-neutral-9">
                  {c.name}
                </span>
                <span className="text-caption2 text-neutral-5">{c.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Gradient">
        <div className="flex flex-wrap gap-16">
          <div className="flex flex-col gap-8">
            <div className="h-80 w-240 rounded-12 bg-brand-gradient-h" />
            <span className="text-caption1 font-medium text-neutral-9">
              bg-brand-gradient-h
            </span>
          </div>
          <div className="flex flex-col gap-8">
            <div className="h-80 w-240 rounded-12 bg-brand-gradient-v" />
            <span className="text-caption1 font-medium text-neutral-9">
              bg-brand-gradient-v
            </span>
          </div>
        </div>
      </Section>

      <Section title="Color ramps" note="Thang 1 (nhạt nhất) → 10 (đậm nhất).">
        <div className="flex flex-col gap-24">
          {RAMPS.map((ramp) => (
            <div key={ramp} className="flex flex-col gap-8">
              <span className="text-caption1 font-medium text-neutral-9">
                {ramp}
              </span>
              <div className="flex overflow-hidden rounded-8">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <div
                    key={n}
                    className="flex h-56 flex-1 items-end justify-center pb-4"
                    style={{ background: `var(--color-${ramp}-${n})` }}
                  >
                    <span
                      className="text-caption2"
                      style={{
                        color:
                          n >= 6
                            ? "var(--color-brand-white)"
                            : "var(--color-neutral-8)",
                      }}
                    >
                      {n}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Typography"
        note="Be Vietnam Pro. 28 style trong Figma gộp còn 8 size — weight compose riêng qua font-*."
      >
        <div className="flex flex-col gap-24">
          {TYPE.map((t) => (
            <div key={t.token} className="flex flex-col gap-4">
              <div className="flex items-baseline gap-12">
                <span className="w-160 shrink-0 text-caption2 text-neutral-5">
                  {t.token}
                </span>
                <span className="text-caption2 text-neutral-4">{t.spec}</span>
              </div>
              <p className={`${t.token} font-medium text-neutral-10`}>
                Chuyển tiền nhanh 24/7 — {t.label}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Corner radius"
        note="Rule trong Figma: bội số của 4, không bao giờ dùng 0. Vì vậy rounded-none không tồn tại."
      >
        <div className="flex flex-wrap gap-16">
          {RADII.map((r) => (
            <div key={r} className="flex flex-col gap-8">
              <div
                className="size-80 border border-neutral-3 bg-neutral-1"
                style={{ borderRadius: `var(--radius-${r})` }}
              />
              <span className="text-caption2 text-neutral-6">rounded-{r}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Elevation">
        <div className="flex flex-wrap gap-24">
          {SHADOWS.map((s) => (
            <div key={s} className="flex flex-col gap-8">
              <div
                className="size-80 rounded-12 bg-brand-white"
                style={{ boxShadow: `var(--shadow-${s})` }}
              />
              <span className="text-caption2 text-neutral-6">shadow-{s}</span>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
