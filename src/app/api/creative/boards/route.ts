import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/supabase/roles";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await getUserRole();
    if (!result || result.role === "customer") {
      return NextResponse.json({ error: "Geen toegang" }, { status: 403 });
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("creative_boards")
      .select("*")
      .eq("is_archived", false)
      .order("position", { ascending: true });

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
    const { title, description, color } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Titel is verplicht" },
        { status: 400 },
      );
    }

    const supabase = createServiceRoleClient();
    const { data, error } = await supabase
      .from("creative_boards")
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        color: color ?? "#722F37",
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
