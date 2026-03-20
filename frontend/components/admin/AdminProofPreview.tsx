const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface AdminProofPreviewProps {
  filePath: string;
  contentType: string | null;
}

export function AdminProofPreview({ filePath, contentType }: AdminProofPreviewProps) {
  const url = `${API_URL}/uploads/${filePath}`;
  const isPdf = (contentType || "").includes("pdf") || filePath.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <iframe title="Payment proof PDF" src={url} className="h-[520px] w-full" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <img src={url} alt="Payment proof" className="block h-auto w-full" />
    </div>
  );
}
