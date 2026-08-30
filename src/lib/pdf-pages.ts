import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";
import { isPdfFile } from "@/lib/upload-files";

const MAX_PAGES = 20;
const MAX_EDGE = 1200;

function ensureWorker() {
  if (GlobalWorkerOptions.workerSrc) {
    return;
  }
  GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
}

async function canvasToJpeg(canvas: HTMLCanvasElement) {
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.72),
  );
  return blob;
}

export async function pdfToJpegPages(file: File): Promise<File[]> {
  ensureWorker();
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await getDocument({ data }).promise;
  const pageCount = Math.min(doc.numPages, MAX_PAGES);
  const pages: File[] = [];
  const base = file.name.replace(/\.pdf$/i, "") || "fatura";

  for (let index = 1; index <= pageCount; index += 1) {
    const page = await doc.getPage(index);
    const baseViewport = page.getViewport({ scale: 1 });
    const scale = Math.min(
      1.4,
      MAX_EDGE / Math.max(baseViewport.width, baseViewport.height),
    );
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(viewport.width));
    canvas.height = Math.max(1, Math.round(viewport.height));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      continue;
    }
    await page.render({ canvas, canvasContext: ctx, viewport }).promise;
    const blob = await canvasToJpeg(canvas);
    if (!blob) {
      continue;
    }
    pages.push(
      new File([blob], `${base}-s${index}.jpg`, { type: "image/jpeg" }),
    );
  }

  return pages;
}

export async function prepareUploadFiles(files: File[]) {
  const prepared: File[] = [];

  for (const file of files) {
    if (!isPdfFile(file)) {
      prepared.push(file);
      continue;
    }
    prepared.push(...(await pdfToJpegPages(file)));
  }

  return prepared.slice(0, MAX_PAGES);
}
