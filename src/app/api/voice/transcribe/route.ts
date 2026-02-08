import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Whisper API niet geconfigureerd", fallback: true },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File | null;

    if (!audioFile) {
      return NextResponse.json(
        { error: "Audio bestand ontbreekt" },
        { status: 400 },
      );
    }

    const whisperForm = new FormData();
    whisperForm.append("file", audioFile, "audio.webm");
    whisperForm.append("model", "whisper-1");
    whisperForm.append("language", "nl");
    whisperForm.append("response_format", "json");

    const response = await fetch(
      "https://api.openai.com/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: whisperForm,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Whisper API error:", errorText);
      return NextResponse.json(
        { error: "Transcriptie mislukt", fallback: true },
        { status: 502 },
      );
    }

    const result = await response.json();

    return NextResponse.json({
      transcript: result.text,
      language: result.language ?? "nl",
    });
  } catch (error) {
    console.error("Whisper transcription error:", error);
    return NextResponse.json(
      { error: "Interne fout bij transcriptie", fallback: true },
      { status: 500 },
    );
  }
}
