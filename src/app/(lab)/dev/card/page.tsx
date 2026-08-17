"use client";

import { Card, type CardPendingStatus } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";

const PENDING_STATUSES: CardPendingStatus[] = [
  "pending-activation",
  "delivering",
  "pending-review",
  "temporarily-locked",
  "expired",
  "pending-contract-signature",
];

/**
 * Stand-in card face — the real component takes `imageSrc` or `children`;
 * this repo has no licensed HDBank card art to embed. `label` renders at the
 * bottom like a real card's product name; omit it when the demo already
 * places its own content in that corner (e.g. the "Has Stauts?" slot below),
 * so the two don't collide.
 */
function MockFace({ label }: { label?: string }) {
  return (
    <div className="flex size-full flex-col justify-between bg-brand-gradient-h p-16 text-brand-white">
      <span className="text-subheadline font-semibold">HDBank</span>
      {label && <span className="text-caption1 font-medium">{label}</span>}
    </div>
  );
}

export default function CardDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <div className="flex flex-col gap-8">
        <h1 className="text-title2 font-semibold">Card — HDBank Card</h1>
        <p className="max-w-[640px] text-subheadline text-neutral-6">
          The Figma &quot;❖ Cards&quot; page holds no generic surface/container card —
          every component on it renders the physical HDBank payment card.
          This ports the one general-purpose piece it actually has: the
          bank-card frame (orientation + blocked state). See the doc comment
          in <code className="text-caption1">card.tsx</code> for what was
          deferred (a contaminated card-picker tile, and a raw card-art
          image library).
        </p>
      </div>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Orientation — vertical (homepage default) × horizontal
        </h2>
        <div className="flex flex-wrap items-start gap-24 rounded-12 bg-neutral-1 p-16">
          <Card orientation="vertical">
            <MockFace label="HDBank Vietjet Platinum" />
          </Card>
          <Card orientation="horizontal">
            <MockFace label="HDBank Vietjet Platinum" />
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Blocked? = yes — every Pending Status overlay
        </h2>
        <div className="flex flex-wrap items-start gap-24 rounded-12 bg-neutral-1 p-16">
          {PENDING_STATUSES.map((status) => (
            <div key={status} className="flex flex-col items-center gap-8">
              <Card orientation="vertical" blocked pendingStatus={status}>
                <MockFace label="HDBank Vietjet Platinum" />
              </Card>
              <span className="text-caption1 text-neutral-6">{status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          &quot;Has Badge?&quot; / &quot;Has Stauts?&quot; slots — composed with the real
          &lt;Badge&gt;
        </h2>
        <p className="text-caption1 text-neutral-6">
          Figma pins the badge to the right edge (vertically centered) and the
          status block bottom-left (a green &quot;active&quot; Badge + expiry
          caption). Both slots are plain <code>ReactNode</code> — this reuses
          the ported <code>&lt;Badge&gt;</code> rather than redrawing it.
        </p>
        <div className="flex flex-wrap items-start gap-24 rounded-12 bg-neutral-1 p-16">
          <Card
            orientation="vertical"
            badge={
              <Badge bold variant="red">
                VIP
              </Badge>
            }
            status={
              <div className="flex flex-col items-start gap-2">
                <Badge bold variant="green">
                  Active
                </Badge>
                <span className="text-caption1 text-brand-white">
                  Ngày hết hạn: 06/2028
                </span>
              </div>
            }
          >
            <MockFace />
          </Card>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Composed in context — real Button/Tag alongside the card
        </h2>
        <div className="flex flex-wrap items-center gap-16 rounded-12 bg-neutral-1 p-16">
          <Card orientation="horizontal" blocked pendingStatus="temporarily-locked">
            <MockFace label="HDBank Visa Debit Gold" />
          </Card>
          <div className="flex flex-col items-start gap-8">
            <Tag icon="🔒">Locked</Tag>
            <Button size="small" variant="tertiary">
              Unlock card
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
