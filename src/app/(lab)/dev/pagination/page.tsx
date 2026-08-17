"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui/pagination";

export default function PaginationDevPage() {
  const [expandedPage, setExpandedPage] = useState(2);
  const [middlePage, setMiddlePage] = useState(6);
  const [collapsedPage, setCollapsedPage] = useState(1);
  const [compactPage, setCompactPage] = useState(7);
  const [pageSize, setPageSize] = useState(10);

  return (
    <main className="mx-auto flex w-full max-w-[900px] flex-col gap-40 px-24 py-40">
      <h1 className="text-title2 font-semibold">Pagination — numbered × compact</h1>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          numbered, expanded — matches the read Figma example (page 2 of 10)
        </h2>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <Pagination
            variant="numbered"
            page={expandedPage}
            totalPages={10}
            totalResults={186}
            onPageChange={setExpandedPage}
          />
          <p className="text-caption1 text-neutral-6">Current page: {expandedPage}</p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          numbered, expanded — current page in the middle (leading + trailing ellipsis)
        </h2>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <Pagination
            variant="numbered"
            page={middlePage}
            totalPages={12}
            totalResults={224}
            onPageChange={setMiddlePage}
          />
          <p className="text-caption1 text-neutral-6">Current page: {middlePage}</p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          numbered, expanded — boundary states (prev/next disabled)
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <Pagination
            variant="numbered"
            page={1}
            totalPages={5}
            totalResults={92}
            onPageChange={() => {}}
          />
          <Pagination
            variant="numbered"
            page={5}
            totalPages={5}
            totalResults={92}
            onPageChange={() => {}}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          numbered, collapsed — Figma &quot;Expand=false&quot;
        </h2>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <Pagination
            variant="numbered"
            expanded={false}
            page={collapsedPage}
            totalPages={10}
            totalResults={186}
            onPageChange={setCollapsedPage}
          />
          <p className="text-caption1 text-neutral-6">Current page: {collapsedPage}</p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          compact — Figma &quot;page=true&quot;, page-size dropdown + « ‹ n/N › »
        </h2>
        <div className="flex flex-col gap-8 rounded-12 bg-neutral-1 p-16">
          <Pagination
            variant="compact"
            page={compactPage}
            totalPages={12}
            pageSize={pageSize}
            onPageChange={setCompactPage}
            onPageSizeChange={setPageSize}
          />
          <p className="text-caption1 text-neutral-6">
            Page {compactPage} of 12 · {pageSize} / trang
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          compact — boundary states (first/prev vs next/last disabled)
        </h2>
        <div className="flex flex-col gap-16 rounded-12 bg-neutral-1 p-16">
          <Pagination
            variant="compact"
            page={1}
            totalPages={5}
            pageSize={10}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
          <Pagination
            variant="compact"
            page={5}
            totalPages={5}
            pageSize={10}
            onPageChange={() => {}}
            onPageSizeChange={() => {}}
          />
        </div>
      </section>

      <section className="flex flex-col gap-12">
        <h2 className="text-subheadline font-semibold text-neutral-7">
          numbered — single page (no controls to disable into)
        </h2>
        <div className="rounded-12 bg-neutral-1 p-16">
          <Pagination
            variant="numbered"
            page={1}
            totalPages={1}
            totalResults={4}
            onPageChange={() => {}}
          />
        </div>
      </section>
    </main>
  );
}
