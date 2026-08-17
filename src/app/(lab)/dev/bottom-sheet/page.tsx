"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Button } from "@/components/ui/button";
import { ListItem } from "@/components/ui/list-item";
import { Radio } from "@/components/ui/radio";

export default function BottomSheetDevPage() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [longOpen, setLongOpen] = useState(false);

  const [account, setAccount] = useState("checking");

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <div className="flex flex-col gap-4">
        <h1 className="text-title2 font-semibold">Bottom-sheet</h1>
        <p className="text-caption1 text-neutral-6">
          Escape and backdrop-click both close every sheet below. Body scroll
          is locked while any sheet is open. The last example forces a scroll
          to show the header staying fixed while only the body scrolls, per
          the Figma guideline &quot;Max height = cạnh dưới của Header&quot;.
        </p>
      </div>

      {/* Default — title only, real List Item navigation rows as body content */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Default — title + List Item rows
        </h2>
        <div className="flex flex-wrap gap-12 rounded-12 bg-neutral-1 p-16">
          <Button onClick={() => setBasicOpen(true)}>Open sheet</Button>
        </div>
        <BottomSheet
          open={basicOpen}
          onOpenChange={setBasicOpen}
          title="Cài đặt tài khoản"
        >
          <ListItem variant="navigation" label="Thông tin cá nhân" />
          <ListItem
            variant="navigation"
            label="Bảo mật"
            subText="Mật khẩu, xác thực 2 lớp, thiết bị"
          />
          <ListItem variant="navigation" label="Thông báo" />
          <ListItem variant="navigation" label="Trợ giúp" showChevron={false} />
        </BottomSheet>
      </section>

      {/* Subtitle + headerAction — mirrors Figma's Header "Has Action?" example */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Subtitle + header action (Đặt lại / Lưu)
        </h2>
        <div className="flex flex-wrap gap-12 rounded-12 bg-neutral-1 p-16">
          <Button onClick={() => setActionOpen(true)}>Open sheet</Button>
        </div>
        <BottomSheet
          open={actionOpen}
          onOpenChange={setActionOpen}
          title="Bộ lọc"
          subtitle="Áp dụng cho danh sách giao dịch"
          headerAction={
            <>
              <Button
                size="x-small"
                variant="secondary"
                onClick={() => setActionOpen(false)}
              >
                Đặt lại
              </Button>
              <Button
                size="x-small"
                variant="primary"
                onClick={() => setActionOpen(false)}
              >
                Lưu
              </Button>
            </>
          }
        >
          <p className="text-body text-neutral-7">
            Nội dung bộ lọc — ngày, loại giao dịch, số tiền…
          </p>
        </BottomSheet>
      </section>

      {/* Select — real Radio inside real List Item, plus a footer Button */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Select — List Item + Radio + footer Button
        </h2>
        <div className="flex flex-wrap gap-12 rounded-12 bg-neutral-1 p-16">
          <Button onClick={() => setSelectOpen(true)}>Open sheet</Button>
        </div>
        <BottomSheet
          open={selectOpen}
          onOpenChange={setSelectOpen}
          title="Chọn tài khoản nguồn"
        >
          <div className="flex flex-col">
            {(
              [
                { id: "checking", label: "Tài khoản thanh toán", sub: "•••• 4821" },
                { id: "savings", label: "Tài khoản tiết kiệm", sub: "•••• 0093" },
              ] as const
            ).map((opt) => (
              <ListItem
                key={opt.id}
                variant="radio-button"
                label={opt.label}
                subText={opt.sub}
                control={
                  <Radio
                    name="dev-bottom-sheet-account"
                    showLabel={false}
                    checked={account === opt.id}
                    onChange={() => setAccount(opt.id)}
                    aria-label={opt.label}
                  />
                }
              />
            ))}
          </div>
          <div className="pt-16">
            <Button fullWidth onClick={() => setSelectOpen(false)}>
              Xác nhận
            </Button>
          </div>
        </BottomSheet>
      </section>

      {/* Long content — proves max-h + scroll-body-not-header */}
      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          Long content — header stays fixed, body scrolls
        </h2>
        <div className="flex flex-wrap gap-12 rounded-12 bg-neutral-1 p-16">
          <Button onClick={() => setLongOpen(true)}>Open sheet</Button>
        </div>
        <BottomSheet
          open={longOpen}
          onOpenChange={setLongOpen}
          title="Điều khoản & điều kiện"
        >
          <div className="flex flex-col">
            {Array.from({ length: 20 }, (_, i) => (
              <ListItem
                key={i}
                variant="navigation"
                label={`Điều khoản ${i + 1}`}
                showChevron={false}
              />
            ))}
          </div>
        </BottomSheet>
      </section>
    </main>
  );
}
