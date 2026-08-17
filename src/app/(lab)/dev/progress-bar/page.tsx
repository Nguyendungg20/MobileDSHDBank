"use client";

import { useEffect, useState } from "react";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ProgressBarDevPage() {
  const [live, setLive] = useState(12);

  useEffect(() => {
    const id = setInterval(() => {
      setLive((v) => (v >= 100 ? 0 : v + 4));
    }, 400);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Progress bar — default &amp; large</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          default (Figma Large=false) — bare bar, no caption
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <ProgressBar value={0} />
          <ProgressBar value={30} />
          <ProgressBar value={70.9} />
          <ProgressBar value={100} />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          default — with label / valueLabel (Figma &quot;Hạn mức&quot; example)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <ProgressBar
            value={70.9}
            label="Hạn mức"
            valueLabel="300,000,000 VND"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          large (Figma Large=true) — card with overlaid caption
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <ProgressBar size="large" value={30} />
          <ProgressBar
            size="large"
            value={66.2}
            label="Dư nợ còn lại"
            valueLabel="32,680,000 VND"
          />
          <ProgressBar size="large" value={100} label="Hoàn tất" valueLabel="100%" />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled / animating value
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <ProgressBar value={live} label="Đang tải" valueLabel={`${live}%`} />
          <ProgressBar size="large" value={live} label="Đang tải" valueLabel={`${live}%`} />
        </div>
      </section>
    </main>
  );
}
