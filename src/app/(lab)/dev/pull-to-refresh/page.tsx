"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PullToRefresh } from "@/components/ui/pull-to-refresh";

function ListItem({ index }: { index: number }) {
  return (
    <div className="flex items-center gap-12 rounded-12 bg-neutral-1 p-16">
      <span className="flex size-32 shrink-0 items-center justify-center rounded-full bg-neutral-2 text-caption1 font-semibold text-neutral-7">
        {index}
      </span>
      <span className="text-body text-brand-black">Mục danh sách {index}</span>
    </div>
  );
}

export default function PullToRefreshDevPage() {
  const [refreshing, setRefreshing] = useState(false);

  // Simulates the "gesture ended past threshold" moment a real drag handler
  // would fire. See pull-to-refresh.tsx: this port has no drag detection of
  // its own, so this button stands in for it.
  async function simulateRefresh() {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1600));
    setRefreshing(false);
  }

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Pull to Refresh</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Idle vs refreshing
        </h2>
        <p className="text-caption1 text-neutral-6">
          Figma models only the in-progress moment — one variant, no
          pulling/armed/arrow state. Real drag-gesture physics (pull
          distance, elastic overscroll, release threshold) are not
          implemented here; the button below stands in for a gesture ending
          past the refresh threshold, toggling the same controlled{" "}
          <code>refreshing</code> prop a real handler would.
        </p>
        <div className="flex flex-wrap gap-8">
          <Button size="small" onClick={simulateRefresh} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "Simulate pull to refresh"}
          </Button>
        </div>
        <div className="overflow-hidden rounded-12 border border-neutral-3">
          <PullToRefresh refreshing={refreshing}>
            <div className="flex flex-col gap-8 bg-neutral-1 p-16">
              {[1, 2, 3, 4].map((i) => (
                <ListItem key={i} index={i} />
              ))}
            </div>
          </PullToRefresh>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Indicator alone — states side by side
        </h2>
        <div className="flex flex-wrap gap-24 rounded-12 bg-neutral-1 p-16">
          <div className="flex flex-col items-center gap-8">
            <div className="w-[390px] overflow-hidden rounded-8 border border-neutral-3">
              <PullToRefresh refreshing={false}>
                <div className="flex h-56 items-center justify-center bg-neutral-2 text-caption1 text-neutral-6">
                  (content — indicator collapsed)
                </div>
              </PullToRefresh>
            </div>
            <span className="text-caption1 text-neutral-6">idle</span>
          </div>
          <div className="flex flex-col items-center gap-8">
            <div className="w-[390px] overflow-hidden rounded-8 border border-neutral-3">
              <PullToRefresh refreshing>
                <div className="flex h-56 items-center justify-center bg-neutral-2 text-caption1 text-neutral-6">
                  (content)
                </div>
              </PullToRefresh>
            </div>
            <span className="text-caption1 text-neutral-6">refreshing</span>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Reduced motion
        </h2>
        <p className="text-caption1 text-neutral-6">
          The ring&apos;s spin respects <code>prefers-reduced-motion</code> —
          enable it at the OS level and the ring should stop animating while
          still reading as &quot;active&quot;.
        </p>
      </section>
    </main>
  );
}
