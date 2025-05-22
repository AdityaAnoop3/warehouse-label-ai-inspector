export interface Detection {
  class: string;         // matching your backend key (“class” instead of “symbol”)
  confidence: number;
  bbox: [number, number, number, number];
}

/**
 * Sends an image file to FastAPI and returns
 * an array of Detection objects.
 */
export async function detectFromEndpoint(file: File, mode: "symbol" | "barcode"): Promise<Detection[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${apiUrl}/detect/${mode}/`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Detection failed: ${text}`);
  }

  const json = await res.json();
  return json.result as Detection[];
}