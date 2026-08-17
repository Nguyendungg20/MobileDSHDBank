"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** Figma's own demo icon for this component ("help_outline", Material
 *  Outlined, 20×20 vector in a 24×24 box) — read directly off the node's
 *  fillGeometry, evenodd (the ring and the "?" glyph are cut from solid
 *  discs). Recreated here for the preview only: `Icon` is a real Figma
 *  component property (INSTANCE_SWAP) that ships with no default in
 *  accordion.tsx, since it's a user-supplied slot, not a fixed part of the
 *  header — see accordion.tsx's file-level doc comment. */
function HelpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M9 16 L11 16 L11 14 L9 14 L9 16 Z M10 0 C4.48 0 0 4.48 0 10 C0 15.52 4.48 20 10 20 C15.52 20 20 15.52 20 10 C20 4.48 15.52 0 10 0 Z M10 18 C5.59 18 2 14.41 2 10 C2 5.59 5.59 2 10 2 C14.41 2 18 5.59 18 10 C18 14.41 14.41 18 10 18 Z M10 4 C7.79 4 6 5.79 6 8 L8 8 C8 6.9 8.9 6 10 6 C11.1 6 12 6.9 12 8 C12 10 9 9.75 9 13 L11 13 C11 10.75 14 10.5 14 8 C14 5.79 12.21 4 10 4 Z"
      />
    </svg>
  );
}

const TITLE = "Làm sao để mời người khác tham gia Quỹ nhóm của tôi?";
const CONTENT = (
  <>
    Bạn có thể mời người dùng tại HDBank tham gia quỹ của bạn bằng 1 trong các
    cách:
    <br />
    Chia sẻ QR code của quỹ đến người nhận
    <br />
    Gửi link tham gia đến người nhận
    <br />
    Truy cập trang chi tiết quỹ &gt; chọn xem danh sách thành viên &gt; chọn
    thêm thành viên thông qua số điện thoại.
  </>
);

export default function AccordionDevPage() {
  const [controlled, setControlled] = useState("second");

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Accordion — Expand × withBG</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          withBG=false — panel is its own Neutral/2 card (Figma default)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Accordion defaultValue="q1">
            <AccordionItem value="q1">
              <AccordionTrigger icon={<HelpIcon />}>{TITLE}</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          withBG=true — item itself is the Neutral/2 card
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Accordion defaultValue="q2">
            <AccordionItem value="q2" withBG>
              <AccordionTrigger icon={<HelpIcon />}>{TITLE}</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          No icon slot — chevron-only header
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Accordion defaultValue="q3">
            <AccordionItem value="q3" withBG>
              <AccordionTrigger>{TITLE}</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          type=&quot;single&quot; (default) — opening one closes the others
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Accordion defaultValue="s1">
            <AccordionItem value="s1" className="border-b border-neutral-3 pb-16">
              <AccordionTrigger icon={<HelpIcon />}>First question</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="s2" className="border-b border-neutral-3 pb-16">
              <AccordionTrigger icon={<HelpIcon />}>Second question</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="s3">
              <AccordionTrigger icon={<HelpIcon />}>Third question</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          type=&quot;multiple&quot; — several items open at once (inferred
          extension, not read off Figma — see accordion.tsx doc comment)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Accordion type="multiple" defaultValue={["m1", "m2"]}>
            <AccordionItem value="m1" withBG className="mb-8">
              <AccordionTrigger icon={<HelpIcon />}>First question</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="m2" withBG className="mb-8">
              <AccordionTrigger icon={<HelpIcon />}>Second question</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="m3" withBG>
              <AccordionTrigger icon={<HelpIcon />}>Third question</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <Accordion value={controlled} onValueChange={(v) => setControlled(v as string)}>
            <AccordionItem value="first">
              <AccordionTrigger>First panel</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="second">
              <AccordionTrigger>Second panel</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
          </Accordion>
          <p className="text-caption1 text-neutral-6">
            External state controls which panel is open — currently &quot;
            {controlled}&quot;.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the header below, then press Enter or Space to toggle — Figma
          draws no focus ring for this component (matches AGENTS.md: no
          invented focus rings).
        </p>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Accordion>
            <AccordionItem value="kb">
              <AccordionTrigger icon={<HelpIcon />}>{TITLE}</AccordionTrigger>
              <AccordionContent>{CONTENT}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
