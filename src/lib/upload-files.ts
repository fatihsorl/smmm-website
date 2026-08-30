export function isPdfFile(file: { name: string; type: string }) {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name);
}
