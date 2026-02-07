const WHATSAPP_API_URL = "https://graph.facebook.com/v21.0";

interface WhatsAppTextMessage {
  to: string;
  type: "text";
  text: { body: string };
}

interface WhatsAppMediaInfo {
  url: string;
  mime_type: string;
  id: string;
}

function getConfig() {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error("WhatsApp credentials not configured");
  }

  return { accessToken, phoneNumberId };
}

export async function sendWhatsAppMessage(
  to: string,
  body: string,
): Promise<void> {
  const { accessToken, phoneNumberId } = getConfig();

  const message: WhatsAppTextMessage = {
    to,
    type: "text",
    text: { body },
  };

  const response = await fetch(
    `${WHATSAPP_API_URL}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        ...message,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp API error: ${response.status} - ${error}`);
  }
}

export async function downloadWhatsAppMedia(
  mediaId: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
  const { accessToken } = getConfig();

  // Step 1: Get media URL
  const metaResponse = await fetch(`${WHATSAPP_API_URL}/${mediaId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!metaResponse.ok) {
    throw new Error(`Failed to get media URL: ${metaResponse.status}`);
  }

  const mediaInfo: WhatsAppMediaInfo = await metaResponse.json();

  // Step 2: Download media
  const mediaResponse = await fetch(mediaInfo.url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!mediaResponse.ok) {
    throw new Error(`Failed to download media: ${mediaResponse.status}`);
  }

  const arrayBuffer = await mediaResponse.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType: mediaInfo.mime_type,
  };
}

export function formatIdeaReply(analysis: {
  title: string;
  category: string;
  urgency: string;
  summary: string;
  ideaId: string;
}): string {
  const urgencyEmoji: Record<string, string> = {
    low: "🟢",
    medium: "🟡",
    high: "🟠",
    urgent: "🔴",
  };

  const categoryLabels: Record<string, string> = {
    product: "Product",
    marketing: "Marketing",
    operations: "Operations",
    tech: "Technologie",
    content: "Content",
    design: "Design",
    other: "Overig",
  };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vino12.vercel.app";

  return [
    `✅ *Idee geanalyseerd!*`,
    ``,
    `*${analysis.title}*`,
    `${urgencyEmoji[analysis.urgency] ?? "🟡"} ${analysis.urgency.toUpperCase()} | ${categoryLabels[analysis.category] ?? analysis.category}`,
    ``,
    analysis.summary,
    ``,
    `📋 Bekijk volledig: ${appUrl}/admin/ideas/${analysis.ideaId}`,
  ].join("\n");
}
