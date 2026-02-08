import QRCode from "qrcode";

export async function generatePassportQR(
  wineId: string,
  baseUrl: string,
): Promise<string> {
  const verificationUrl = `${baseUrl}/verificatie/${wineId}`;

  const dataUrl = await QRCode.toDataURL(verificationUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: "#1A1A1A",
      light: "#FAF9F6",
    },
    errorCorrectionLevel: "H",
  });

  return dataUrl;
}

export async function generatePassportQRSvg(
  wineId: string,
  baseUrl: string,
): Promise<string> {
  const verificationUrl = `${baseUrl}/verificatie/${wineId}`;

  const svg = await QRCode.toString(verificationUrl, {
    type: "svg",
    width: 300,
    margin: 2,
    color: {
      dark: "#1A1A1A",
      light: "#FAF9F6",
    },
    errorCorrectionLevel: "H",
  });

  return svg;
}

export function getVerificationUrl(wineId: string, baseUrl: string): string {
  return `${baseUrl}/verificatie/${wineId}`;
}
