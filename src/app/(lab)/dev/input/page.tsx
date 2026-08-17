"use client";

import { useState } from "react";
import { ChevronRightIcon, Input } from "@/components/ui/input";

export default function InputDevPage() {
  const [controlled, setControlled] = useState("");

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Input — states × variants</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Type=text — full :state matrix (uncontrolled, real interaction)
        </h2>
        <p className="text-caption1 text-neutral-6">
          Click into &quot;Default&quot; and type — watch the label float and
          the border turn orange. Blur it with a value to see &quot;filled&quot;.
        </p>
        <div className="grid grid-cols-1 gap-24 rounded-12 bg-neutral-1 p-16 sm:grid-cols-2">
          <Input label="Default" helperText="Help Text" />
          <Input label="Focus me" helperText="Help Text" autoFocus />
          <Input label="Filled" defaultValue="Input Text" helperText="Help Text" />
          <Input
            label="Success"
            defaultValue="Input Text"
            status="success"
            successText="Success"
          />
          <Input
            label="Error"
            defaultValue="Input Text"
            status="error"
            errorText="Error"
          />
          <Input
            label="Error, empty + required"
            status="error"
            required
            errorText="Error"
          />
          <Input label="Disabled" defaultValue="Input Text" disabled helperText="Help Text" />
          <Input label="Disabled, empty" disabled helperText="Help Text" />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Required + counter
        </h2>
        <div className="grid grid-cols-1 gap-24 rounded-12 bg-neutral-1 p-16 sm:grid-cols-2">
          <Input label="Full name" required helperText="As shown on your ID" />
          <Input
            label="Bio"
            maxLength={80}
            showCounter
            defaultValue="Prototype lab"
            helperText="Shown on your public profile"
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Suffix icon (Figma: &quot;Show Icon &gt;&quot;, used as a Dropdown trigger)
        </h2>
        <div className="grid grid-cols-1 gap-24 rounded-12 bg-neutral-1 p-16 sm:grid-cols-2">
          <Input
            label="Select branch"
            defaultValue="Hồ Chí Minh City"
            icon={<ChevronRightIcon />}
            onIconClick={() => alert("Open bottom-sheet")}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Type=phone-number — static prefix, no floating label
        </h2>
        <div className="grid grid-cols-1 gap-24 rounded-12 bg-neutral-1 p-16 sm:grid-cols-2">
          <Input variant="phone-number" placeholder="000 000 000" helperText="Help Text" />
          <Input
            variant="phone-number"
            placeholder="000 000 000"
            defaultValue="912345678"
            status="error"
            errorText="Số điện thoại không hợp lệ"
          />
          <Input variant="phone-number" placeholder="000 000 000" disabled />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Controlled
        </h2>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <Input
            label="Controlled value"
            value={controlled}
            onChange={(e) => setControlled(e.target.value)}
            helperText={`Current value: "${controlled}"`}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Keyboard focus
        </h2>
        <p className="text-caption1 text-neutral-6">
          Tab to the field below to verify the focus-visible ring.
        </p>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <Input label="Focus me with Tab" helperText="Help Text" />
        </div>
      </section>
    </main>
  );
}
