"use client";

import { use } from "react";
import Link from "next/link";
import { BoardDetail } from "@/components/creative/BoardDetail";

export default function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/creative"
          className="font-accent text-[10px] uppercase tracking-widest text-ink/50 hover:text-wine mb-2 inline-block"
        >
          ← Terug naar werkruimte
        </Link>
      </div>
      <BoardDetail boardId={id} />
    </div>
  );
}
