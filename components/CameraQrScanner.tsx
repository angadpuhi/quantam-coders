"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import {
  Camera,
  X,
  RefreshCw,
  ScanLine,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface CameraQrScannerProps {
  onScanSuccess?: (healthId: string) => void;
  onClose: () => void;
}

export function CameraQrScanner({ onScanSuccess, onClose }: CameraQrScannerProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const scannerRef = useRef<any | null>(null);
  const containerId = "html5qr-code-full-region";

  // Helper to extract clean portableHealthId from any QR payload
  const extractHealthId = (raw: string): string => {
    const text = raw.trim();
    // Matches KL-MH-XXXXXX format
    const match = text.match(/KL-MH-[A-Z0-9]{4,8}/i);
    if (match) return match[0].toUpperCase();

    // If it's a URL like /workers/KL-MH-829104
    if (text.includes("/workers/")) {
      const parts = text.split("/workers/");
      if (parts[1]) {
        const id = parts[1].split("/")[0].split("?")[0].trim();
        return id.toUpperCase();
      }
    }
    return text.toUpperCase();
  };

  useEffect(() => {
    let html5QrCode: any = null;

    const startScanner = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");

        // Ensure container exists
        const container = document.getElementById(containerId);
        if (!container) return;

        html5QrCode = new Html5Qrcode(containerId);
        scannerRef.current = html5QrCode;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        };

        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          (decodedText: string) => {
            const cleanId = extractHealthId(decodedText);
            setScannedResult(cleanId);

            // Play slight beep or feedback if available
            try {
              if (html5QrCode.isScanning) {
                html5QrCode.stop().catch(() => {});
              }
            } catch (err) {}

            if (onScanSuccess) {
              onScanSuccess(cleanId);
            } else {
              // Direct navigation to worker profile
              setTimeout(() => {
                router.push(`/workers/${encodeURIComponent(cleanId)}` as any);
              }, 800);
            }
          },
          () => {
            // QR scan frame error / ignore
          }
        );

        setIsInitializing(false);
      } catch (err: any) {
        console.error("Camera scanner error:", err);
        setError(
          err?.message ||
            "Unable to access device camera. Please check camera permissions or use manual search."
        );
        setIsInitializing(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => scannerRef.current.clear()).catch(() => {});
          } else {
            scannerRef.current.clear();
          }
        } catch (e) {}
      }
    };
  }, [router, onScanSuccess]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#0c1a10] border-2 border-emerald-500/60 rounded-houseboat max-w-md w-full p-6 text-white shadow-2xl space-y-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
              <Camera className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                Camera QR Scanner
              </h3>
              <p className="text-[11px] text-emerald-300">
                Point camera at Worker&apos;s Health Passport QR
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Viewport Container */}
        <div className="relative rounded-2xl overflow-hidden bg-black border border-emerald-500/40 min-h-[280px] flex items-center justify-center">
          <div id={containerId} className="w-full h-full" />

          {/* Initializing Spinner */}
          {isInitializing && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-emerald-300 text-xs space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
              <span>Starting camera video feed...</span>
            </div>
          )}

          {/* Scanned Result Banner */}
          {scannedResult && (
            <div className="absolute inset-0 bg-emerald-950/90 flex flex-col items-center justify-center text-center p-6 space-y-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
              <div>
                <p className="text-xs uppercase font-bold text-emerald-300">
                  Health ID Identified
                </p>
                <p className="font-mono text-xl font-black text-white mt-1">
                  {scannedResult}
                </p>
              </div>
              <p className="text-xs text-emerald-200">
                Opening worker clinical timeline...
              </p>
            </div>
          )}
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-3 bg-red-950/80 border border-red-500 text-red-200 rounded-xl text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Camera Access Error</p>
              <p className="text-[11px] leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Instructions & Manual Jump Button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-emerald-900/60 text-xs">
          <span className="text-[11px] text-slate-400">
            Auto-navigates directly to profile
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition text-xs"
          >
            Cancel / Close
          </button>
        </div>
      </div>
    </div>
  );
}
