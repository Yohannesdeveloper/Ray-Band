"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, Upload, Save, FileImage, X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const typeOptions = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "document", label: "Document" },
  { value: "audio", label: "Audio" },
  { value: "logo", label: "Logo" },
  { value: "press_kit", label: "Press Kit" },
  { value: "brand_guide", label: "Brand Guide" },
];

const categoryOptions = [
  { value: "brand", label: "Brand" },
  { value: "portfolio", label: "Portfolio" },
  { value: "promotional", label: "Promotional" },
  { value: "performance", label: "Performance" },
  { value: "press", label: "Press" },
  { value: "other", label: "Other" },
];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function UploadMediaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("image");
  const [category, setCategory] = useState("brand");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [uploadedInfo, setUploadedInfo] = useState<{
    fileName: string;
    fileSize: number;
    mimeType: string;
  } | null>(null);

  const handleFileSelect = (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large (max 50MB)");
      return;
    }
    setSelectedFile(file);
    setFileUrl("");
    setUploadedInfo(null);
    setError("");
    if (!title) {
      setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return fileUrl || null;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", "media");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setFileUrl(data.url);
      setUploadedInfo({
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      });
      return data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError("Title is required");
      return;
    }
    if (!selectedFile && !fileUrl) {
      setError("Please select a file to upload");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let url = fileUrl;
      if (selectedFile && !fileUrl) {
        url = (await uploadFile()) || "";
        if (!url) {
          setLoading(false);
          return;
        }
      }

      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          category,
          description: description || null,
          fileUrl: url,
          fileName: uploadedInfo?.fileName || selectedFile?.name || null,
          fileSize: uploadedInfo?.fileSize || selectedFile?.size || null,
          mimeType: uploadedInfo?.mimeType || selectedFile?.type || null,
          tags: tags
            ? tags.split(",").map((t) => t.trim()).filter(Boolean)
            : null,
          featured,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save asset");
      }

      router.push("/admin/media");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/media"
          className="p-2 rounded-lg hover:bg-surface-light transition-colors text-warm-white/60 hover:text-warm-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Upload Media Asset
          </h1>
          <p className="text-warm-white/40 mt-1">
            Add a new asset to the brand library
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-gold" />
            Asset Information
          </h2>
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="e.g. Ray Entertainment Logo 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Type
                </label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-warm-white/80 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-warm-white/80 mb-2">
                Description
              </label>
              <textarea
                placeholder="Brief description of this asset..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 resize-none"
              />
            </div>

            <Input
              label="Tags (comma separated)"
              placeholder="e.g. logo, brand, official"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-warm-white mb-4 flex items-center gap-2">
            <FileImage className="w-5 h-5 text-gold" />
            File Upload
          </h2>

          {selectedFile ? (
            <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-light border border-border">
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
                <FileImage className="w-6 h-6 text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-warm-white truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-warm-white/40 mt-0.5">
                  {formatFileSize(selectedFile.size)} &middot; {selectedFile.type}
                </p>
                {uploadedInfo && (
                  <p className="text-xs text-green-400 mt-0.5">Uploaded</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setFileUrl("");
                  setUploadedInfo(null);
                }}
                className="p-1.5 rounded-lg hover:bg-white/5 text-warm-white/40 hover:text-warm-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/30 hover:bg-surface-light"
              }`}
            >
              <Upload className="w-10 h-10 text-warm-white/20 mx-auto mb-3" />
              <p className="text-sm text-warm-white/60">
                Drag & drop a file here, or{" "}
                <span className="text-gold font-medium">browse</span>
              </p>
              <p className="text-xs text-warm-white/30 mt-2">
                Images, videos, documents up to 50MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,.pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
              e.target.value = "";
            }}
          />
        </Card>

        <Card variant="glass" className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-warm-white">Featured Asset</p>
              <p className="text-xs text-warm-white/40 mt-0.5">
                Mark this asset as featured in the library
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFeatured(!featured)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                featured ? "bg-gold" : "bg-surface"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-warm-white shadow transition-transform duration-200 ${
                  featured ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </Card>

        <div className="flex items-center gap-3 justify-end">
          <Link href="/admin/media">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading || uploading}>
            {loading || uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {uploading ? "Uploading..." : "Upload Asset"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
