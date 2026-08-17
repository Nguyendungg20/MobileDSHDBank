"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  type DropdownMenuItemVariant,
} from "@/components/ui/dropdown-menu";

const VARIANTS: DropdownMenuItemVariant[] = ["default", "danger"];

const PersonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 20l1-4L16 5l3 3L8 19l-4 1z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M12 16V4m0 0l-4 4m4-4l4 4M5 14v4a2 2 0 002 2h10a2 2 0 002-2v-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-8 0l1 13a1 1 0 001 1h6a1 1 0 001-1l1-13"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MoreIcon = () => (
  <svg className="size-20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

/** Static swatch — renders a single Item with content forced open, laid out
 * in normal flow instead of `absolute`, for the states × variants spec grid. */
function ItemSwatch({
  variant,
  state,
  selected,
}: {
  variant: DropdownMenuItemVariant;
  state: "enabled" | "pressing" | "disabled";
  selected?: boolean;
}) {
  return (
    <DropdownMenu open>
      <DropdownMenuTrigger className="sr-only">open</DropdownMenuTrigger>
      <DropdownMenuContent className="static w-[231px] shadow-none">
        <DropdownMenuItem
          variant={variant}
          disabled={state === "disabled"}
          selected={selected}
          icon={<PersonIcon />}
          // "pressing" only exists as a hover/active look — this class is a
          // demo-only override to preview it without a mouse, not part of
          // the component's own API.
          className={
            state === "pressing"
              ? variant === "danger"
                ? "bg-red-1"
                : "bg-neutral-2"
              : undefined
          }
        >
          Label
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DropdownMenuDevPage() {
  const [liveOpen, setLiveOpen] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Dropdown Menu</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Live demo — trigger + menu, keyboard nav, click-outside/Escape to close
        </h2>
        <DropdownMenu open={liveOpen} onOpenChange={setLiveOpen}>
          <DropdownMenuTrigger
            aria-label="Mở menu"
            className="flex size-44 items-center justify-center rounded-full bg-neutral-2 text-brand-black hover:bg-neutral-3"
          >
            <MoreIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem icon={<EditIcon />} onSelect={() => console.log("edit")}>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem icon={<ShareIcon />} onSelect={() => console.log("share")}>
              Chia sẻ
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="danger"
              icon={<TrashIcon />}
              onSelect={() => console.log("delete")}
            >
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          States × variants — Item
        </h2>
        <div className="grid grid-cols-3 gap-24 rounded-12 bg-neutral-1 p-16">
          {(["enabled", "pressing", "disabled"] as const).map((state) => (
            <div key={state} className="flex flex-col gap-12">
              <span className="text-caption1 font-medium text-neutral-6 capitalize">
                {state}
              </span>
              {VARIANTS.map((variant) => (
                <ItemSwatch key={variant} variant={variant} state={state} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Selected (check-mark)
        </h2>
        <DropdownMenu open>
          <DropdownMenuTrigger className="sr-only">open</DropdownMenuTrigger>
          <DropdownMenuContent className="static">
            <DropdownMenuItem icon={<PersonIcon />} selected>
              VND — Vietnamese Dong
            </DropdownMenuItem>
            <DropdownMenuItem icon={<PersonIcon />} selected={false}>
              USD — US Dollar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Accordion item (simplified: inline expand, not overlay)
        </h2>
        <DropdownMenu open>
          <DropdownMenuTrigger className="sr-only">open</DropdownMenuTrigger>
          <DropdownMenuContent className="static">
            <DropdownMenuItem icon={<EditIcon />}>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem
              icon={<PersonIcon />}
              hasAccordion
              subItems={
                <>
                  <DropdownMenuItem className="pl-40">Thành viên 1</DropdownMenuItem>
                  <DropdownMenuItem className="pl-40">Thành viên 2</DropdownMenuItem>
                </>
              }
            >
              Quản lý nhóm
            </DropdownMenuItem>
            <DropdownMenuItem variant="danger" icon={<TrashIcon />}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Composed menu (Figma “Dropdown Menu” component: Chỉnh sửa / Chia sẻ /
          Xóa)
        </h2>
        <DropdownMenu open>
          <DropdownMenuTrigger className="sr-only">open</DropdownMenuTrigger>
          <DropdownMenuContent className="static">
            <DropdownMenuItem icon={<EditIcon />}>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem icon={<ShareIcon />}>Chia sẻ</DropdownMenuItem>
            <DropdownMenuItem variant="danger" icon={<TrashIcon />}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
    </main>
  );
}
