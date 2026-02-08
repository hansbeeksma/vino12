import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/roles";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const result = await getUserRole();
    if (!result || result.role === "customer") {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content } = body;

    const supabase = createServiceRoleClient();

    const updates: Record<string, unknown> = {};
    if (title !== undefined) updates.title = title?.trim() || null;
    if (content !== undefined) updates.content = content.trim();

    const { data, error } = await supabase
      .from("creative_notes")
      .update(updates)
      .eq("id", id)
      .eq("created_by", result.user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Bijwerken mislukt" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Er is iets misgegaan" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const result = await getUserRole();
    if (!result || result.role === "customer") {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id } = await params;
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("creative_notes")
      .delete()
      .eq("id", id)
      .eq("created_by", result.user.id);

    if (error) {
      return NextResponse.json(
        { error: "Verwijderen mislukt" },
        { status: 500 },
      );
    }

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json(
      { error: "Er is iets misgegaan" },
      { status: 500 },
    );
  }
}
