export async function shareARCapture(
  canvas: HTMLCanvasElement,
  wineName: string,
): Promise<boolean> {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );

  if (!blob) return false;

  const file = new File([blob], `vino12-${wineName}.png`, {
    type: "image/png",
  });

  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: `${wineName} — VINO12`,
        text: `Bekijk ${wineName} via VINO12 AR`,
        files: [file],
      });
      return true;
    } catch (err) {
      if ((err as Error).name === "AbortError") return false;
      console.error("Share failed:", err);
    }
  }

  // Fallback: download
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vino12-${wineName}.png`;
  a.click();
  URL.revokeObjectURL(url);
  return true;
}
