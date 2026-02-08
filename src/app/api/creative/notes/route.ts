import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/roles";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const result = await getUserRole();
    if (!result || result.role === "customer") {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const boardId = request.nextUrl.searchParams.get("board_id");

    const supabase = createServiceRoleClient();
    let query = supabase
      .from("creative_notes")
      .select("*")
      .order("created_at", { ascending: false });

    if (boardId) {
      query = query.eq("board_id", boardId);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Er is iets misgegaan" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getUserRole();
    if (!result || result.role === "customer") {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const body = await request.json();
    const { board_id, title, content, note_type } = body;

    if (!board_id || !content?.trim()) {
      return NextResponse.json(
        { error: "board_id en content zijn verplicht" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("creative_notes")
      .insert({
        board_id,
        title: title?.trim() || null,
        content: content.trim(),
        note_type: note_type ?? "text",
        created_by: result.user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Er is iets misgegaan" },
      { status: 500 },
    );
  }
}
