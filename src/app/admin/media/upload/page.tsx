"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, Upload, Save,
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

export default function UploadMediaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("image");
  const [category, setCategory] = useState("brand");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [mimeType, setMimeType] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) {
      setError("Title and file URL are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          type,
          category,
          description: description || null,
          fileUrl,
          fileName: fileName || null,
          fileSize: fileSize ? Number(fileSize) : null,
          mimeType: mimeType || null,
          thumbnailUrl: thumbnailUrl || null,
          tags: tags
            ? tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
            : null,
          featured,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload asset");
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
              placeholder="e.g. Ray Entertainment and Promotion Logo 2024"
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
            <Upload className="w-5 h-5 text-gold" />
            File Details
          </h2>
          <div className="space-y-4">
            <Input
              label="File URL"
              placeholder="https://..."
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              required
            />

            <Input
              label="Thumbnail URL"
              placeholder="https://... (optional preview image)"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="File Name"
                placeholder="logo.png"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <Input
                label="File Size (bytes)"
                type="number"
                placeholder="1024000"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
              />
              <Input
                label="MIME Type"
                placeholder="image/png"
                value={mimeType}
                onChange={(e) => setMimeType(e.target.value)}
              />
            </div>
          </div>
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
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Upload Asset
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
