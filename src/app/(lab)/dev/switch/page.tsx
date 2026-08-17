"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function SwitchDevPage() {
  const [controlled, setControlled] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Switch — On? × Disabled?</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Every state
        </h2>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <label className="flex flex-col items-center gap-8 text-caption1 text-neutral-6">
            Off
            <Switch aria-label="Off, enabled" />
          </label>
          <label className="flex flex-col items-center gap-8 text-caption1 text-neutral-6">
            On
            <Switch defaultChecked aria-label="On, enabled" />
          </label>
          <label className="flex flex-col items-center gap-8 text-caption1 text-neutral-6">
            Off, disabled
            <Switch disabled aria-label="Off, disabled" />
          </label>
          <label className="flex flex-col items-center gap-8 text-caption1 text-neutral-6">
            On, disabled
            <Switch disabled defaultChecked aria-label="On, disabled" />
          </label>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled
        </h2>
        <div className="flex flex-wrap items-center gap-12 rounded-12 bg-neutral-1 p-16">
          <Switch
            checked={controlled}
            onCheckedChange={setControlled}
            aria-label="Controlled switch"
          />
          <span className="text-body text-brand-black">
            {controlled ? "On" : "Off"}
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Inside a List Item (the Figma-documented usage)
        </h2>
        <div className="flex flex-col gap-1 rounded-12 bg-neutral-1 p-16">
          <div className="flex items-center justify-between gap-16 py-8">
            <span className="text-body text-brand-black">
              Push notifications
            </span>
            <Switch defaultChecked aria-label="Push notifications" />
          </div>
          <div className="flex items-center justify-between gap-16 py-8">
            <span className="text-body text-brand-black">Biometric login</span>
            <Switch aria-label="Biometric login" />
          </div>
          <div className="flex items-center justify-between gap-16 py-8">
            <span className="text-body text-neutral-5">
              Locked feature (disabled)
            </span>
            <Switch disabled aria-label="Locked feature" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the switch below, then press Space to toggle it.
        </p>
        <div className="flex flex-wrap items-center gap-24 rounded-12 bg-neutral-1 p-16">
          <Switch aria-label="Focus me" />
        </div>
      </section>
    </main>
  );
}
