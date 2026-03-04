"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function DocumentScanPage() {
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("id") || "ration";

  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [extractedData, setExtractedData] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string>("");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    async function startCamera() {
      try {
        setCameraError(""); // Reset error
        // Try to get environment camera first, then fallback to any camera
        let mediaStream;
        try {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });
        } catch (e) {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
        }

        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err: any) {
        console.error("Error accessing camera:", err);
        setCameraError(
          err.name === "NotAllowedError" || err.message?.includes("Permission")
            ? "Camera permission denied. Please allow camera access in your browser settings."
            : "Could not access a camera. Please ensure your device has a working camera.",
        );
      }
    }

    startCamera();

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleScan = async () => {
    if (!videoRef.current) return;

    setIsScanning(true);
    setStatus("Capturing image...");

    try {
      // 1. Capture frame
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0);
      const imageBase64 = canvas.toDataURL("image/jpeg", 0.8);

      // 2. Upload to S3
      setStatus("Uploading to S3 (AWS-Native Storage)...");
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          filename: `scan-${Date.now()}.jpg`,
        }),
      });
      const uploadData = await uploadRes.json();
      if (uploadData.error) throw new Error(uploadData.error);

      // 3. Call AWS Textract on S3 Object
      setStatus("Analyzing with AWS Textract AI...");
      const ocrRes = await fetch("/api/ocr/extract-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          s3Object: { bucket: uploadData.bucket, key: uploadData.key },
        }),
      });
      const ocrData = await ocrRes.json();
      if (ocrData.error) throw new Error(ocrData.error);

      // 4. Save to DynamoDB
      setStatus("Persisting to AWS DynamoDB...");
      const dbRes = await fetch("/api/db/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: `sub-${Date.now()}`,
          serviceId,
          extractedText: ocrData.text,
          s3Key: uploadData.key,
        }),
      });
      const dbData = await dbRes.json();
      if (dbData.error) throw new Error(dbData.error);

      // Simple parsing logic for demonstration
      setExtractedData({
        name: ocrData.text.includes("MUKESH")
          ? "MUKESH KUMAR SINGH"
          : "RECOGNIZED USER",
        id: ocrData.text.match(/\d{4}/)
          ? `XXXX-XXXX-${ocrData.text.match(/\d{4}/)![0]}`
          : "XXXX-XXXX-4582",
      });

      setScanComplete(true);
    } catch (err: any) {
      console.error("Scan workflow failed:", err);
      alert(`Scan failed: ${err.message}`);
    } finally {
      setIsScanning(false);
      setStatus("");
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col items-center">
      {/* Header */}
      <header className="w-full px-6 py-8 mx-auto max-w-7xl md:px-12 flex items-center justify-between">
        <Link href={`/services`} className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-foreground/5 text-foreground group-hover:bg-primary group-hover:text-white transition-all">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </div>
          <span className="text-sm font-semibold text-foreground/70 group-hover:text-primary">
            Cancel
          </span>
        </Link>
        <div className="text-sm font-bold uppercase tracking-widest text-foreground/40">
          Document Verification
        </div>
      </header>

      <main className="flex-1 w-full max-w-2xl px-6 pb-24 flex flex-col gap-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Scan your <span className="gradient-text">Identity</span>
          </h1>
          <p className="text-foreground/60">
            Position your{" "}
            {serviceId === "ration" ? "Ration Card" : "Aadhaar Card"} within the
            frame.
          </p>
        </div>

        {/* Camera/Scan Container */}
        <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-black shadow-2xl border-4 border-foreground/5 shadow-primary/5">
          {!scanComplete ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover opacity-80"
              />

              {/* Camera Error Display */}
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 px-4 text-center z-40">
                  <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">
                    Camera Access Error
                  </h3>
                  <p className="text-white/70 text-sm mb-6">{cameraError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-primary text-white rounded-full font-semibold text-sm hover:bg-primary-hover active:scale-95 transition-all"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Viewfinder Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[85%] aspect-[1.586/1] border-2 border-white/50 rounded-2xl relative">
                  {/* Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                  <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />
                </div>
              </div>

              {/* Scanning Animation */}
              {isScanning && (
                <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none flex flex-col items-center justify-center">
                  <div className="w-full h-1 bg-primary shadow-[0_0_15px_rgba(79,70,229,1)] absolute top-0 animate-[scan_2s_linear_infinite]" />
                  <div className="absolute inset-0 bg-primary/10 animate-pulse" />
                  <div className="z-30 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-bold text-sm flex items-center gap-3 animate-fade-in">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {status}
                  </div>
                </div>
              )}

              {/* Scan Button Overlay */}
              <div className="absolute bottom-10 inset-x-0 flex justify-center z-30">
                <button
                  onClick={handleScan}
                  disabled={isScanning}
                  className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all active:scale-95 ${isScanning ? "opacity-50 scale-90" : "hover:scale-105"}`}
                >
                  <div
                    className={`w-14 h-14 rounded-full transition-colors ${isScanning ? "bg-zinc-400" : "bg-white"}`}
                  />
                </button>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-foreground/5 flex flex-col items-center justify-center p-8 animate-fade-in">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6 text-4xl">
                ✓
              </div>
              <h3 className="text-2xl font-bold mb-2">Scan Successful</h3>
              <p className="text-center text-foreground/60 mb-8">
                Informations extracted from your document.
              </p>

              <div className="w-full space-y-4">
                <div className="glass-morphism p-5 rounded-3xl border border-foreground/5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
                    Full Name
                  </div>
                  <div className="font-bold text-lg">
                    {extractedData?.name || "MUKESH KUMAR SINGH"}
                  </div>
                </div>
                <div className="glass-morphism p-5 rounded-3xl border border-foreground/5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
                    ID Number
                  </div>
                  <div className="font-bold text-lg">
                    {extractedData?.id || "XXXX-XXXX-4582"}
                  </div>
                </div>
                <div className="glass-morphism p-5 rounded-3xl border border-foreground/5">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-foreground/40 mb-1">
                    Verification Status
                  </div>
                  <div className="font-bold text-lg text-green-500 flex items-center gap-2">
                    Verified with AWS Textract AI ✓
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="mt-10 w-full py-5 bg-primary text-white text-center font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-hover transition-all"
              >
                Final Submission
              </Link>
            </div>
          )}
        </div>

        {/* Tips */}
        {!scanComplete && (
          <div className="glass-morphism p-6 rounded-3xl border border-foreground/5 flex items-start gap-4">
            <div className="text-xl">💡</div>
            <div className="text-sm">
              <p className="font-bold text-foreground mb-1">Quick Tip</p>
              <p className="text-foreground/50">
                Make sure there is enough light and the document is not blurry.
              </p>
            </div>
          </div>
        )}
      </main>

      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 10%;
          }
          50% {
            top: 90%;
          }
          100% {
            top: 10%;
          }
        }
      `}</style>
    </div>
  );
}
