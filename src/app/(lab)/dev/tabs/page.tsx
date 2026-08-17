"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TabsDevPage() {
  const [controlled, setControlled] = useState("second");

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Tabs — variants x states</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Underlined — full width (Figma &quot;Has Maximum?=no&quot;)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Tabs variant="underlined" defaultValue="one">
            <TabsList aria-label="Underlined full width demo">
              <TabsTrigger value="one">Label</TabsTrigger>
              <TabsTrigger value="two">Label</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Underlined — natural width + scroll (Figma &quot;Has Maximum?=yes&quot;)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Tabs variant="underlined" defaultValue="a">
            <TabsList aria-label="Underlined scrollable demo" fullWidth={false}>
              <TabsTrigger value="a">Label</TabsTrigger>
              <TabsTrigger value="b">Label</TabsTrigger>
              <TabsTrigger value="c">Label</TabsTrigger>
              <TabsTrigger value="d">Label</TabsTrigger>
              <TabsTrigger value="e">Label</TabsTrigger>
              <TabsTrigger value="f">A much longer label</TabsTrigger>
              <TabsTrigger value="g">Another long one</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Underlined — disabled + dot (dot is inferred from Figma&apos;s &quot;Show
          Dot&quot; property; disabled styling is inferred — see tabs.tsx doc comment)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Tabs variant="underlined" defaultValue="dot">
            <TabsList aria-label="Underlined disabled + dot demo">
              <TabsTrigger value="dot" dot>
                With dot
              </TabsTrigger>
              <TabsTrigger value="mid">Label</TabsTrigger>
              <TabsTrigger value="off" disabled>
                Disabled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Solid — full width (segmented control)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Tabs variant="solid" defaultValue="week">
            <TabsList aria-label="Solid full width demo">
              <TabsTrigger value="week">Label</TabsTrigger>
              <TabsTrigger value="month">Label</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Solid — three items + disabled
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Tabs variant="solid" defaultValue="s1">
            <TabsList aria-label="Solid three item demo">
              <TabsTrigger value="s1">Label</TabsTrigger>
              <TabsTrigger value="s2">Label</TabsTrigger>
              <TabsTrigger value="s3" disabled>
                Disabled
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled + TabsContent switching
        </h2>
        <div className="flex flex-col gap-12 rounded-12 bg-neutral-1 p-16">
          <Tabs variant="underlined" value={controlled} onValueChange={setControlled}>
            <TabsList aria-label="Controlled demo">
              <TabsTrigger value="first">First</TabsTrigger>
              <TabsTrigger value="second">Second</TabsTrigger>
              <TabsTrigger value="third">Third</TabsTrigger>
            </TabsList>
            <TabsContent value="first" className="text-body text-neutral-7">
              First panel content.
            </TabsContent>
            <TabsContent value="second" className="text-body text-neutral-7">
              Second panel content — this is the one showing by default
              (controlled value = &quot;second&quot;).
            </TabsContent>
            <TabsContent value="third" className="text-body text-neutral-7">
              Third panel content.
            </TabsContent>
          </Tabs>
          <p className="text-caption1 text-neutral-6">
            Click a trigger, or focus the tab list and use Arrow Left / Right / Home
            / End to move and activate — external state updates to &quot;
            {controlled}&quot;.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the list below, then use the arrow keys — Figma draws no focus ring
          for this component, so the only visible affordance on move is the
          selected-tab indicator itself (matches AGENTS.md: no invented focus rings).
        </p>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Tabs variant="underlined" defaultValue="k1">
            <TabsList aria-label="Keyboard focus demo">
              <TabsTrigger value="k1">Label</TabsTrigger>
              <TabsTrigger value="k2">Label</TabsTrigger>
              <TabsTrigger value="k3">Label</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>
    </main>
  );
}
