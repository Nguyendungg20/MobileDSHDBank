"use client";

import { Fragment, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/ui/search-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { ListItem } from "@/components/ui/list-item";
import { Checkbox } from "@/components/ui/checkbox";
import { Radio } from "@/components/ui/radio";
import { Switch } from "@/components/ui/switch";
import { Surface } from "@/components/ui/surface";
import { Callout } from "@/components/ui/callout";
import { Banner } from "@/components/ui/banner";
import { Toast } from "@/components/ui/toast";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { Tag } from "@/components/ui/tag";
import { Avatar } from "@/components/ui/avatar";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Playground — a drag-and-drop canvas for composing screens from the DS to test
 * a design quickly. Drag a block from the palette into the phone frame; reorder
 * by dragging its grip; remove with ×. Native HTML5 drag-and-drop, no library.
 *
 * Each block renders a real DS component with sensible Vietnamese defaults — it's
 * a visual composition surface, not a prop editor, so instances are uncontrolled.
 */

type BlockGroup = "Bố cục" | "Nhập liệu" | "Hiển thị" | "Phản hồi";

interface Block {
  key: string;
  label: string;
  group: BlockGroup;
  render: () => ReactNode;
}

const BLOCKS: Block[] = [
  // ---- Bố cục ----
  {
    key: "section-header",
    label: "Section Header",
    group: "Bố cục",
    render: () => <SectionHeader title="Tài khoản của tôi" />,
  },
  {
    key: "surface",
    label: "Surface (khung)",
    group: "Bố cục",
    render: () => (
      <Surface elevation="1" padding="16" className="flex flex-col gap-8">
        <p className="text-subheadline font-semibold text-neutral-10">
          Khung nội dung
        </p>
        <p className="text-caption1 text-neutral-6">
          Kéo thêm block vào đây khi dựng thật.
        </p>
      </Surface>
    ),
  },
  {
    key: "divider",
    label: "Divider",
    group: "Bố cục",
    render: () => <div className="h-px w-full bg-neutral-3" />,
  },
  {
    key: "tabs",
    label: "Tabs",
    group: "Bố cục",
    render: () => (
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Chi tiêu</TabsTrigger>
          <TabsTrigger value="b">Tiết kiệm</TabsTrigger>
          <TabsTrigger value="c">Đầu tư</TabsTrigger>
        </TabsList>
        <TabsContent value="a" className="pt-12 text-subheadline text-neutral-7">
          Nội dung tab Chi tiêu
        </TabsContent>
        <TabsContent value="b" className="pt-12 text-subheadline text-neutral-7">
          Nội dung tab Tiết kiệm
        </TabsContent>
        <TabsContent value="c" className="pt-12 text-subheadline text-neutral-7">
          Nội dung tab Đầu tư
        </TabsContent>
      </Tabs>
    ),
  },
  {
    key: "accordion",
    label: "Accordion",
    group: "Bố cục",
    render: () => (
      <Accordion type="single" defaultValue="q1">
        <AccordionItem value="q1">
          <AccordionTrigger>Làm sao để chuyển tiền 24/7?</AccordionTrigger>
          <AccordionContent>
            Vào Chuyển tiền → nhập số tài khoản → xác nhận bằng sinh trắc học.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="q2">
          <AccordionTrigger>Phí chuyển khoản là bao nhiêu?</AccordionTrigger>
          <AccordionContent>Miễn phí chuyển khoản trong và ngoài hệ thống.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },

  // ---- Nhập liệu ----
  {
    key: "search-bar",
    label: "Search Bar",
    group: "Nhập liệu",
    render: () => <SearchBar placeholder="Tìm kiếm giao dịch" />,
  },
  {
    key: "input",
    label: "Input",
    group: "Nhập liệu",
    render: () => <Input variant="text" label="Họ và tên" />,
  },
  {
    key: "button",
    label: "Button (full)",
    group: "Nhập liệu",
    render: () => <Button fullWidth>Tiếp tục</Button>,
  },
  {
    key: "button-pair",
    label: "Button đôi",
    group: "Nhập liệu",
    render: () => (
      <div className="flex gap-12">
        <Button variant="secondary" fullWidth>
          Huỷ
        </Button>
        <Button fullWidth>Xác nhận</Button>
      </div>
    ),
  },
  {
    key: "checkbox",
    label: "Checkbox",
    group: "Nhập liệu",
    render: () => (
      <Checkbox label="Tôi đồng ý với điều khoản sử dụng" defaultChecked />
    ),
  },
  {
    key: "li-switch",
    label: "List Item + Switch",
    group: "Nhập liệu",
    render: () => (
      <ListItem
        variant="switchers"
        label="Đăng nhập bằng Face ID"
        subText="Mở khoá ứng dụng bằng khuôn mặt"
        control={<Switch defaultChecked />}
      />
    ),
  },
  {
    key: "li-radio",
    label: "List Item + Radio",
    group: "Nhập liệu",
    render: () => (
      <ListItem
        variant="radio-button"
        label="Tài khoản thanh toán"
        subText="**** 6789"
        control={<Radio showLabel={false} defaultChecked />}
      />
    ),
  },
  {
    key: "li-checkbox",
    label: "List Item + Checkbox",
    group: "Nhập liệu",
    render: () => (
      <ListItem
        variant="checkbox"
        label="Nhận thông báo khuyến mãi"
        control={<Checkbox showLabel={false} />}
      />
    ),
  },
  {
    key: "li-nav",
    label: "List Item (điều hướng)",
    group: "Nhập liệu",
    render: () => (
      <ListItem
        variant="navigation"
        label="Thông tin cá nhân"
        subText="Tên, số điện thoại, email"
      />
    ),
  },

  // ---- Hiển thị ----
  {
    key: "avatar-row",
    label: "Avatar + tên",
    group: "Hiển thị",
    render: () => (
      <div className="flex items-center gap-12">
        <Avatar variant="initials" initials="MĐ" size="medium" />
        <div className="flex flex-col">
          <span className="text-body font-semibold text-neutral-10">Minh Đức</span>
          <span className="text-caption1 text-neutral-6">Khách hàng thân thiết</span>
        </div>
      </div>
    ),
  },
  {
    key: "badge-row",
    label: "Badge",
    group: "Hiển thị",
    render: () => (
      <div className="flex flex-wrap gap-8">
        <Badge variant="green">Thành công</Badge>
        <Badge variant="yellow">Chờ xử lý</Badge>
        <Badge variant="red">Thất bại</Badge>
      </div>
    ),
  },
  {
    key: "chip-row",
    label: "Chip",
    group: "Hiển thị",
    render: () => (
      <div className="flex flex-wrap gap-8">
        <Chip selected>Tất cả</Chip>
        <Chip>Chi tiêu</Chip>
        <Chip>Nạp tiền</Chip>
      </div>
    ),
  },
  {
    key: "tag-row",
    label: "Tag",
    group: "Hiển thị",
    render: () => (
      <div className="flex flex-wrap gap-8">
        <Tag>Hà Nội</Tag>
        <Tag>Hồ Chí Minh</Tag>
        <Tag variant="new">+ Thêm</Tag>
      </div>
    ),
  },
  {
    key: "progress",
    label: "Progress bar",
    group: "Hiển thị",
    render: () => (
      <ProgressBar value={62} label="Hạn mức" valueLabel="62.000.000 đ" />
    ),
  },

  // ---- Phản hồi ----
  {
    key: "callout",
    label: "Callout",
    group: "Phản hồi",
    render: () => (
      <Callout variant="info">
        Số dư khả dụng của bạn là 12.480.000 đ.
      </Callout>
    ),
  },
  {
    key: "banner",
    label: "Banner",
    group: "Phản hồi",
    render: () => (
      <Banner variant="default">
        Mở thẻ tín dụng HDBank Petrolimex 4in1 hạn mức đến 50 triệu!
      </Banner>
    ),
  },
  {
    key: "toast",
    label: "Toast",
    group: "Phản hồi",
    render: () => <Toast variant="success">Chuyển tiền thành công.</Toast>,
  },
];

const BLOCK_MAP = new Map(BLOCKS.map((b) => [b.key, b]));
const GROUPS: BlockGroup[] = ["Bố cục", "Nhập liệu", "Hiển thị", "Phản hồi"];

let uidCounter = 0;
const uid = () => `b${++uidCounter}`;

interface Placed {
  id: string;
  key: string;
}

function GripIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-16" fill="currentColor" aria-hidden>
      <circle cx="5" cy="4" r="1.4" />
      <circle cx="11" cy="4" r="1.4" />
      <circle cx="5" cy="8" r="1.4" />
      <circle cx="11" cy="8" r="1.4" />
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="11" cy="12" r="1.4" />
    </svg>
  );
}

export default function PlaygroundPage() {
  const [placed, setPlaced] = useState<Placed[]>([]);
  const [dropIndex, setDropIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const computeDropIndex = (clientY: number) => {
    const nodes = listRef.current?.querySelectorAll<HTMLElement>("[data-placed]");
    if (!nodes || nodes.length === 0) return 0;
    for (let i = 0; i < nodes.length; i++) {
      const r = nodes[i].getBoundingClientRect();
      if (clientY < r.top + r.height / 2) return i;
    }
    return nodes.length;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropIndex(computeDropIndex(e.clientY));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    // Recompute from the pointer here rather than reading `dropIndex` state,
    // which may not have committed yet if dragover→drop fire in the same tick.
    const idx = computeDropIndex(e.clientY);
    setDropIndex(null);
    if (data.startsWith("add:")) {
      const key = data.slice(4);
      if (!BLOCK_MAP.has(key)) return;
      setPlaced((p) => {
        const next = [...p];
        next.splice(idx, 0, { id: uid(), key });
        return next;
      });
    } else if (data.startsWith("move:")) {
      const id = data.slice(5);
      setPlaced((p) => {
        const from = p.findIndex((x) => x.id === id);
        if (from < 0) return p;
        const next = [...p];
        const [item] = next.splice(from, 1);
        const target = from < idx ? idx - 1 : idx;
        next.splice(target, 0, item);
        return next;
      });
    }
  };

  const addToEnd = (key: string) =>
    setPlaced((p) => [...p, { id: uid(), key }]);
  const remove = (id: string) =>
    setPlaced((p) => p.filter((x) => x.id !== id));

  const insertionLine = (
    <div className="h-2 w-full rounded-full bg-brand-red" aria-hidden />
  );

  return (
    <main className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b border-neutral-3 px-24 py-16">
        <div className="flex items-baseline gap-12">
          <Link href="/" className="text-overline font-semibold text-brand-red">
            PROTOTYPE LAB
          </Link>
          <h1 className="text-title3 font-semibold text-neutral-10">Playground</h1>
          <span className="text-caption1 text-neutral-5">
            {placed.length} block
          </span>
        </div>
        <button
          type="button"
          onClick={() => setPlaced([])}
          disabled={placed.length === 0}
          className="rounded-8 px-12 py-8 text-subheadline font-medium text-neutral-7 hover:bg-neutral-2 disabled:cursor-not-allowed disabled:text-neutral-4"
        >
          Xoá hết
        </button>
      </header>

      <div className="flex min-h-0 flex-1">
        {/* Palette */}
        <aside className="w-260 shrink-0 overflow-y-auto border-r border-neutral-3 bg-neutral-1 p-16">
          <p className="mb-12 text-caption2 text-neutral-5">
            Kéo vào khung, hoặc bấm để thêm vào cuối.
          </p>
          <div className="flex flex-col gap-16">
            {GROUPS.map((group) => (
              <div key={group} className="flex flex-col gap-6">
                <p className="px-4 text-caption2 font-medium text-neutral-5">
                  {group}
                </p>
                {BLOCKS.filter((b) => b.group === group).map((b) => (
                  <button
                    key={b.key}
                    type="button"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", "add:" + b.key);
                      e.dataTransfer.effectAllowed = "copy";
                    }}
                    onClick={() => addToEnd(b.key)}
                    className="flex cursor-grab items-center gap-8 rounded-8 border border-neutral-3 bg-brand-white px-12 py-8 text-left text-subheadline text-neutral-8 active:cursor-grabbing hover:border-neutral-5"
                  >
                    <span className="text-neutral-4">
                      <GripIcon />
                    </span>
                    {b.label}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <div className="flex min-w-0 flex-1 justify-center overflow-y-auto bg-neutral-2 p-32">
          <div className="w-390 shrink-0">
            <div className="overflow-hidden rounded-32 border-8 border-neutral-10 bg-brand-white shadow-4">
              {/* phone status bar */}
              <div className="flex h-32 items-center justify-center bg-brand-white">
                <div className="h-6 w-100 rounded-full bg-neutral-9" />
              </div>
              <div
                ref={listRef}
                onDragOver={onDragOver}
                onDragLeave={() => setDropIndex(null)}
                onDrop={onDrop}
                className="flex min-h-[560px] flex-col gap-12 p-16"
              >
                {placed.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center gap-8 rounded-16 border border-dashed border-neutral-4 py-40 text-center">
                    <p className="text-subheadline font-medium text-neutral-7">
                      Kéo block từ bên trái vào đây
                    </p>
                    <p className="text-caption1 text-neutral-5">
                      Dựng thử một màn hình bằng component thật.
                    </p>
                  </div>
                ) : (
                  placed.map((item, i) => {
                    const block = BLOCK_MAP.get(item.key);
                    return (
                      <Fragment key={item.id}>
                        {dropIndex === i && insertionLine}
                        <div data-placed className="group relative">
                          {block?.render()}
                          {/* per-item toolbar */}
                          <div className="absolute -top-8 right-0 flex gap-4 opacity-0 transition-opacity group-hover:opacity-100">
                            <span
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.setData(
                                  "text/plain",
                                  "move:" + item.id,
                                );
                                e.dataTransfer.effectAllowed = "move";
                              }}
                              className="flex size-24 cursor-grab items-center justify-center rounded-full bg-neutral-9 text-brand-white active:cursor-grabbing"
                              title="Kéo để đổi vị trí"
                            >
                              <GripIcon />
                            </span>
                            <button
                              type="button"
                              onClick={() => remove(item.id)}
                              className="flex size-24 items-center justify-center rounded-full bg-brand-red text-brand-white"
                              aria-label="Xoá block"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      </Fragment>
                    );
                  })
                )}
                {dropIndex === placed.length && placed.length > 0 && insertionLine}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
