"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isActive: boolean;
  error: string | null;
  startCamera: (facingMode?: "user" | "environment") => Promise<void>;
  stopCamera: () => void;
  captureFrame: () => ImageData | null;
}

export function useCamera(): UseCameraReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsActive(false);
  }, [stream]);

  const startCamera = useCallback(
    async (facingMode: "user" | "environment" = "environment") => {
      setError(null);
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        setStream(mediaStream);
        setIsActive(true);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        const message =
          err instanceof DOMException && err.name === "NotAllowedError"
            ? "Camera toegang geweigerd"
            : "Camera kon niet worden gestart";
        setError(message);
        setIsActive(false);
      }
    },
    [],
  );

  const captureFrame = useCallback((): ImageData | null => {
    const video = videoRef.current;
    if (!video || !isActive) return null;

    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas");
    }
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, [isActive]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return {
    videoRef,
    stream,
    isActive,
    error,
    startCamera,
    stopCamera,
    captureFrame,
  };
}
