"use client";

import { useState } from "react";
import { Tag } from "@/components/ui/tag";

const TagIcon = () => (
  <svg className="size-12" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M20 12.5l-7.5 7.5a1.5 1.5 0 01-2.12 0L4 13.62V4h9.62l6.38 6.38a1.5 1.5 0 010 2.12z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="9" r="1.25" fill="currentColor" />
  </svg>
);

const PlusIcon = () => (
  <svg className="size-12" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function TagDevPage() {
  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">
        Tag — &quot;New tag&quot; false × true
      </h1>
      <p className="max-w-[600px] text-caption1 text-neutral-6">
        This component set has only one axis (&quot;New tag&quot;: false/true)
        — not a colour-by-semantic label. See <code>Badge</code> for that.
        &quot;default&quot; is a removable existing-tag pill; &quot;new&quot;
        is an add-tag trigger pill.
      </p>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          variant=default (New tag=false)
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          <Tag icon={<TagIcon />}>Tag 1</Tag>
          <Tag>No icon</Tag>
          <RemovableDemo />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          variant=new (New tag=true)
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          <Tag variant="new" icon={<PlusIcon />} onClick={() => alert("add tag")}>
            New Tag
          </Tag>
          <Tag variant="new">No icon</Tag>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Both together (typical usage: tag list + add trigger)
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          <Tag icon={<TagIcon />}>Hóa đơn</Tag>
          <Tag icon={<TagIcon />}>Cá nhân</Tag>
          <Tag variant="new" icon={<PlusIcon />}>
            New Tag
          </Tag>
        </div>
      </section>
    </main>
  );
}

function RemovableDemo() {
  const [tags, setTags] = useState(["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"]);
  return (
    <>
      {tags.map((label) => (
        <Tag
          key={label}
          icon={<TagIcon />}
          onRemove={() => setTags((prev) => prev.filter((t) => t !== label))}
          removeLabel={`Xóa ${label}`}
        >
          {label}
        </Tag>
      ))}
      {tags.length === 0 && (
        <span className="text-caption1 text-neutral-6">
          All tags removed — reload to reset.
        </span>
      )}
    </>
  );
}
