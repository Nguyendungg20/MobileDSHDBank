"use client";

import { useState } from "react";
import { OtpInput, PinInput, type OtpPinSize } from "@/components/ui/otp-input";

const SIZES: OtpPinSize[] = ["large", "small"];

export default function OtpInputDevPage() {
  const [otpDefault, setOtpDefault] = useState("");
  const [otpTyping, setOtpTyping] = useState("12");
  const [otpFilled, setOtpFilled] = useState("123456");
  const [otpError, setOtpError] = useState("");

  const [pinDefault, setPinDefault] = useState("");
  const [pinTyping, setPinTyping] = useState("12");
  const [pinFilled, setPinFilled] = useState("123456");

  const [live, setLive] = useState("");
  const [liveMask, setLiveMask] = useState(false);
  const [liveError, setLiveError] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">OTP &amp; PIN Input — states × sizes</h1>

      {SIZES.map((size) => (
        <section key={size} className="flex flex-col gap-16">
          <h2 className="text-subheadline font-semibold text-neutral-7">{size}</h2>

          <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-24">
            <div className="flex flex-col gap-8">
              <p className="text-caption1 text-neutral-6">OTP — default (empty)</p>
              <OtpInput length={6} size={size} value={otpDefault} onChange={setOtpDefault} />
            </div>
            <div className="flex flex-col gap-8">
              <p className="text-caption1 text-neutral-6">OTP — typing (partial)</p>
              <OtpInput length={6} size={size} value={otpTyping} onChange={setOtpTyping} />
            </div>
            <div className="flex flex-col gap-8">
              <p className="text-caption1 text-neutral-6">OTP — filled (complete, blurred)</p>
              <OtpInput length={6} size={size} value={otpFilled} onChange={setOtpFilled} />
            </div>
            <div className="flex flex-col gap-8">
              <p className="text-caption1 text-neutral-6">OTP — error</p>
              <OtpInput
                length={6}
                size={size}
                value={otpError}
                onChange={setOtpError}
                error
                errorText="Bạn còn 2 lần thử nữa"
              />
            </div>
          </div>

          <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-24">
            <div className="flex flex-col gap-8">
              <p className="text-caption1 text-neutral-6">PIN — default (empty)</p>
              <PinInput length={6} size={size} value={pinDefault} onChange={setPinDefault} />
            </div>
            <div className="flex flex-col gap-8">
              <p className="text-caption1 text-neutral-6">PIN — typing (partial)</p>
              <PinInput length={6} size={size} value={pinTyping} onChange={setPinTyping} />
            </div>
            <div className="flex flex-col gap-8">
              <p className="text-caption1 text-neutral-6">PIN — filled (complete, blurred)</p>
              <PinInput length={6} size={size} value={pinFilled} onChange={setPinFilled} />
            </div>
          </div>
        </section>
      ))}

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">Disabled (not in Figma — see file doc comment)</h2>
        <div className="flex flex-col gap-24 rounded-12 bg-neutral-1 p-24">
          <OtpInput length={6} value="123" onChange={() => {}} disabled />
          <PinInput length={6} value="123" onChange={() => {}} disabled />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Live &amp; interactive — type, backspace, paste a 6-digit code
        </h2>
        <p className="text-caption1 text-neutral-6">
          Current value: <span className="font-semibold">{live || "(empty)"}</span>
        </p>
        <div className="flex flex-wrap items-center gap-16 rounded-12 bg-neutral-1 p-24">
          {liveMask ? (
            <PinInput
              length={6}
              value={live}
              onChange={setLive}
              error={liveError}
              errorText="Mã OTP không đúng"
              autoFocus
            />
          ) : (
            <OtpInput
              length={6}
              value={live}
              onChange={setLive}
              error={liveError}
              errorText="Mã OTP không đúng"
              autoFocus
            />
          )}
        </div>
        <div className="flex gap-8">
          <button
            type="button"
            onClick={() => setLiveMask((m) => !m)}
            className="rounded-8 border border-neutral-3 px-16 py-8 text-caption1"
          >
            Toggle mask ({liveMask ? "PIN" : "OTP"})
          </button>
          <button
            type="button"
            onClick={() => setLiveError((v) => !v)}
            className="rounded-8 border border-neutral-3 px-16 py-8 text-caption1"
          >
            Toggle error ({liveError ? "on" : "off"})
          </button>
          <button
            type="button"
            onClick={() => setLive("")}
            className="rounded-8 border border-neutral-3 px-16 py-8 text-caption1"
          >
            Clear
          </button>
        </div>
      </section>
    </main>
  );
}
