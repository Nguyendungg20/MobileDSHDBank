"use client";

import { useState } from "react";
import { ListItem } from "@/components/ui/list-item";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";

export default function ListItemDevPage() {
  const [radioValue, setRadioValue] = useState("a");
  const [checked, setChecked] = useState(false);
  const [switchOn, setSwitchOn] = useState(true);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">List Item — variants × states</h1>
      <p className="text-caption1 text-neutral-6">
        &quot;Pressing&quot; is plain CSS <code>:active</code> — click and hold a
        row (or force `:active` in devtools) to see it. Rows below sit inside a
        16px-padded card, mirroring the Figma guideline that the parent List
        supplies the row&apos;s left/right padding.
      </p>

      {/* radio-button — composes the real <Radio> control */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          radio-button — composes &lt;Radio&gt;
        </h2>
        <div className="rounded-12 bg-neutral-1 px-16">
          {(["a", "b", "c"] as const).map((id) => (
            <ListItem
              key={id}
              variant="radio-button"
              label={`Option ${id.toUpperCase()}`}
              subText={id === "b" ? "With a sub-text line" : undefined}
              control={
                <Radio
                  name="dev-radio"
                  showLabel={false}
                  checked={radioValue === id}
                  onChange={() => setRadioValue(id)}
                  aria-label={`Option ${id.toUpperCase()}`}
                />
              }
            />
          ))}
          <ListItem
            variant="radio-button"
            label="Disabled option"
            disabled
            control={<Radio showLabel={false} disabled aria-label="Disabled option" />}
          />
        </div>
      </section>

      {/* checkbox — composes the real <Checkbox> control */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          checkbox — composes &lt;Checkbox&gt;
        </h2>
        <div className="rounded-12 bg-neutral-1 px-16">
          <ListItem
            variant="checkbox"
            header="Notifications"
            label="Email me about updates"
            subText="Sent at most once a week"
            required
            control={
              <Checkbox
                showLabel={false}
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                aria-label="Email me about updates"
              />
            }
          />
          <ListItem
            variant="checkbox"
            label="Disabled, checked"
            disabled
            control={<Checkbox showLabel={false} disabled defaultChecked aria-label="Disabled, checked" />}
          />
        </div>
      </section>

      {/* switchers — composes the real <Switch> control */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          switchers — composes &lt;Switch&gt;
        </h2>
        <div className="rounded-12 bg-neutral-1 px-16">
          <ListItem
            variant="switchers"
            label="Face ID"
            subText="Use Face ID to unlock the app"
            showInfo
            control={
              <Switch
                checked={switchOn}
                onCheckedChange={setSwitchOn}
                aria-label="Face ID"
              />
            }
          />
          <ListItem
            variant="switchers"
            label="Disabled, on"
            disabled
            control={<Switch disabled defaultChecked aria-label="Disabled, on" />}
          />
        </div>
      </section>

      {/* navigation — built-in chevron */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          navigation — built-in chevron
        </h2>
        <div className="rounded-12 bg-neutral-1 px-16">
          <ListItem variant="navigation" label="Personal information" />
          <ListItem
            variant="navigation"
            label="Security"
            subText="Password, 2FA, devices"
            showInfo
          />
          <ListItem variant="navigation" label="Disabled" disabled />
          <ListItem variant="navigation" label="No chevron" showChevron={false} />
        </div>
      </section>

      {/* input — two-column label/value row */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          input — label / value / chevron
        </h2>
        <div className="rounded-12 bg-neutral-1 px-16">
          <ListItem
            variant="input"
            label="Amount"
            value="2,000,000₫"
            valueSubText="≈ 79.2 USD"
          />
          <ListItem
            variant="input"
            label="From account"
            required
            value="Select account"
            valueSubText="Required"
          />
          <ListItem
            variant="input"
            label="Disabled field"
            value="—"
            disabled
          />
        </div>
      </section>

      {/* leading icon slot */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Leading icon slot (small 24 / large 40)
        </h2>
        <div className="rounded-12 bg-neutral-1 px-16">
          <ListItem
            variant="navigation"
            label="Small leading icon"
            leadingIcon={
              <svg className="size-20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
          />
          <ListItem
            variant="navigation"
            label="Large leading icon"
            leadingIconSize="large"
            leadingIcon={
              <svg className="size-32" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            }
          />
        </div>
      </section>
    </main>
  );
}
