"use client";

import { useState, useRef, useEffect } from "react";
import { detectFromEndpoint, Detection } from "../lib/api";

export default function ImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"symbol" | "barcode">("symbol");
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate a preview when you pick a file
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setDetections([]);
  };

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const results = await detectFromEndpoint(file, mode);
      setDetections(results);
    } catch (err) {
      console.error(err);
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <label>
          <input
            type="radio"
            name="mode"
            value="symbol"
            checked={mode === "symbol"}
            onChange={() => setMode("symbol")}
          />
          <span className="ml-2">Symbol</span>
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="barcode"
            checked={mode === "barcode"}
            onChange={() => setMode("barcode")}
          />
          <span className="ml-2">Barcode</span>
        </label>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="
          block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100
        "
      />

      {previewUrl && (
        <div className="relative inline-block border border-gray-200">
          <img
            ref={imgRef}
            src={previewUrl}
            alt="Upload preview"
            className="max-w-full h-auto block"
          />

          {detections.map((d, i) => {
            if (!imgRef.current) return null;
            const { width: dispW, height: dispH } = imgRef.current.getBoundingClientRect();
            const { naturalWidth: natW, naturalHeight: natH } = imgRef.current;
            const [x1, y1, x2, y2] = d.bbox;
            const scaleX = dispW / natW;
            const scaleY = dispH / natH;

            const left = x1 * scaleX;
            const top = y1 * scaleY;
            const w = (x2 - x1) * scaleX;
            const h = (y2 - y1) * scaleY;

            return (
              <div
                key={i}
                className="absolute border-2 border-red-500 pointer-events-none"
                style={{ left, top, width: w, height: h }}
              >
                <span className="absolute -top-5 left-0 bg-red-500 text-white text-xs px-1">
                  {d.class} ({(d.confidence * 100).toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={handleDetect}
        disabled={!file || loading}
        className="
          px-4 py-2 bg-blue-600 text-white rounded
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        {loading ? "Detecting…" : "Run Detection"}
      </button>
    </div>
  );
}