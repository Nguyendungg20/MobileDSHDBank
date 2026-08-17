import Link from "next/link";
import { PROTOTYPES, STATUS_LABEL, type PrototypeStatus } from "@/prototypes/registry";

const STATUS_STYLE: Record<PrototypeStatus, string> = {
  draft: "bg-neutral-2 text-neutral-7",
  review: "bg-orange-1 text-orange-8",
  final: "bg-green-1 text-green-8",
};

function StatusTag({ status }: { status: PrototypeStatus }) {
  return (
    <span
      className={`rounded-full px-8 py-2 text-caption2 font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

export default function GalleryPage() {
  return (
    <main className="mx-auto flex w-full max-w-[880px] flex-col gap-32 px-24 py-48">
      <header className="flex flex-col gap-8">
        <p className="text-overline font-semibold text-brand-red">
          PROTOTYPE LAB
        </p>
        <h1 className="text-large-title font-semibold text-neutral-10">
          Đi-HDBank
        </h1>
        <p className="text-body text-neutral-6">
          Prototype dựng bằng design system thật. Mỗi bản có link riêng để gửi
          thẳng cho stakeholder — không cần tài khoản Figma.
        </p>
      </header>

      {PROTOTYPES.length === 0 ? (
        <div className="flex flex-col items-start gap-12 rounded-16 border border-dashed border-neutral-4 bg-neutral-1 p-24">
          <p className="text-body font-medium text-neutral-8">
            Chưa có prototype nào.
          </p>
          <p className="text-subheadline text-neutral-6">
            Chạy <code className="text-brand-red">/new-prototype</code> để tạo
            bản đầu tiên.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-12">
          {PROTOTYPES.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/p/${p.slug}`}
                className="flex flex-col gap-8 rounded-16 border border-neutral-3 p-20 transition-colors hover:bg-neutral-1"
              >
                <div className="flex items-center gap-8">
                  <h2 className="text-body font-semibold text-neutral-10">
                    {p.title}
                  </h2>
                  <StatusTag status={p.status} />
                </div>
                <p className="text-subheadline text-neutral-6">{p.summary}</p>
                <p className="text-caption2 text-neutral-5">
                  Cập nhật {p.updated}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <footer className="flex gap-16 border-t border-neutral-3 pt-24">
        <Link
          href="/tokens"
          className="text-subheadline font-medium text-brand-red hover:underline"
        >
          Design tokens
        </Link>
        <Link
          href="/dev/button"
          className="text-subheadline font-medium text-brand-red hover:underline"
        >
          Component dev
        </Link>
        <Link
          href="/playground"
          className="text-subheadline font-medium text-brand-red hover:underline"
        >
          Playground
        </Link>
      </footer>
    </main>
  );
}
