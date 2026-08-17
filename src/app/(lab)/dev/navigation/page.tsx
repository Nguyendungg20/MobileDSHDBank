"use client";

import { useState } from "react";
import { HeaderBar, NavigationBar, NavigationItem } from "@/components/ui/navigation";

/* Dev-page-only icon stand-ins — not part of the component, matches convention
 * of every other /dev preview page in this lab. */

function SupportIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.29c-.7.3-1 .8-1 1.5V14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  );
}

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 11.5 12 4l8 7.5M6 10v9h12v-9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="6" width="17" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 10h17" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function QrIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14.5" y="3.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3.5" y="14.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.6" />
      <path d="M14.5 14.5h3v3h-3zM20.5 17.5v3h-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function OfferIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 4.5H6.5a2 2 0 0 0-2 2V11L13 19.5a1.5 1.5 0 0 0 2.12 0l4.38-4.38a1.5 1.5 0 0 0 0-2.12L11 4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="9" r="1.25" fill="currentColor" />
    </svg>
  );
}

function AccountIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4.5 20c0-3.6 3.4-6.5 7.5-6.5s7.5 2.9 7.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/** Phone-width frame — this is a mobile DS; the bottom nav is modeled fixed
 *  to the bottom of a phone-width viewport, not a full-width web bar. */
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto h-[600px] w-[390px] overflow-hidden rounded-24 border border-neutral-3 bg-neutral-1 shadow-2">
      {children}
    </div>
  );
}

export default function NavigationDevPage() {
  const [active, setActive] = useState("home");

  const items = [
    { key: "home", label: "Trang chủ", icon: <HomeIcon /> },
    { key: "cards", label: "Thẻ", icon: <CardIcon /> },
    { key: "qr", label: "Quét QR", icon: <QrIcon /> },
    { key: "offers", label: "Ưu đãi", icon: <OfferIcon />, badge: "Sắp ra mắt" },
    { key: "account", label: "Tài khoản", icon: <AccountIcon /> },
  ];

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Navigation — Header bar & Bottom nav</h1>

      {/* ---------------- HeaderBar ---------------- */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          HeaderBar — variant × white
        </h2>

        <div className="flex flex-col gap-1 overflow-hidden rounded-12 border border-neutral-3">
          <HeaderBar
            variant="default"
            title="Chi tiết giao dịch"
            description="Hôm nay, 14:02"
            onBack={() => {}}
            primaryAction={<SupportIcon className="size-24" />}
          />
          <HeaderBar
            variant="two-actions"
            title="Sổ tiết kiệm"
            onBack={() => {}}
            primaryAction={<SupportIcon className="size-24" />}
            secondaryAction={<MoreIcon className="size-24" />}
          />
          <HeaderBar
            variant="avatar-one-action"
            title="Xin chào, Minh"
            description="Khách hàng thân thiết"
            avatar={
              <span className="flex size-40 items-center justify-center rounded-full bg-neutral-3 text-body font-semibold text-brand-black">
                M
              </span>
            }
            primaryAction={<SupportIcon className="size-24" />}
          />
          <HeaderBar
            variant="avatar-two-actions"
            title="Xin chào, Minh"
            avatar={
              <span className="flex size-40 items-center justify-center rounded-full bg-neutral-3 text-body font-semibold text-brand-black">
                M
              </span>
            }
            primaryAction={<SupportIcon className="size-24" />}
            secondaryAction={<MoreIcon className="size-24" />}
          />
          <HeaderBar variant="logo" onBack={() => {}} primaryAction={<SupportIcon className="size-24" />} />
          <HeaderBar variant="progress" onBack={() => {}} progress={{ current: 2, total: 6 }} />
        </div>

        <h3 className="text-caption1 font-semibold text-neutral-6">white = true (over imagery)</h3>
        <div className="rounded-12 bg-brand-gradient-h p-1">
          <HeaderBar
            variant="default"
            white
            title="Ưu đãi mùa hè"
            description="Đến 31/08"
            onBack={() => {}}
            primaryAction={<SupportIcon className="size-24 text-brand-white" />}
          />
        </div>
      </section>

      {/* ---------------- NavigationBar / Item ---------------- */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          NavigationBar — 5 items, one selected, one with badge
        </h2>

        <PhoneFrame>
          <div className="flex h-full flex-col">
            <HeaderBar variant="default" title="Trang chủ" />
            <div className="flex-1 p-16 text-caption1 text-neutral-6">
              Screen content goes here — the nav bar below sits fixed at the
              bottom of the phone frame.
            </div>
          </div>

          <NavigationBar className="absolute inset-x-0 bottom-0" aria-label="Điều hướng chính">
            {items.map((item) => (
              <NavigationItem
                key={item.key}
                icon={item.icon}
                label={item.label}
                active={active === item.key}
                badge={item.badge}
                onClick={() => setActive(item.key)}
              />
            ))}
          </NavigationBar>
        </PhoneFrame>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          NavigationItem — states, isolated
        </h2>
        <div className="flex max-w-390 border-t border-neutral-3 bg-brand-white">
          <NavigationItem icon={<HomeIcon />} label="Default" />
          <NavigationItem icon={<HomeIcon />} label="Selected" active />
          <NavigationItem icon={<OfferIcon />} label="With badge" badge="Sắp ra mắt" />
        </div>
      </section>
    </main>
  );
}
