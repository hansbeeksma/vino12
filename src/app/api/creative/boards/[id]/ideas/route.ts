import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/roles";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const result = await getUserRole();
    if (!result || result.role === "customer") {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id: boardId } = await params;
    const body = await request.json();
    const { idea_id, position } = body;

    if (!idea_id) {
      return NextResponse.json(
        { error: "idea_id is verplicht" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("board_ideas")
      .insert({
        board_id: boardId,
        idea_id,
        position: position ?? 0,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const result = await getUserRole();
    if (!result || result.role === "customer") {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const { id: boardId } = await params;
    const { searchParams } = request.nextUrl;
    const ideaId = searchParams.get("idea_id");

    if (!ideaId) {
      return NextResponse.json(
        { error: "idea_id query parameter is verplicht" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from("board_ideas")
      .delete()
      .eq("board_id", boardId)
      .eq("idea_id", ideaId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch {
    return NextResponse.json(
      { error: "Er is iets misgegaan" },
      { status: 500 },
    );
  }
}
