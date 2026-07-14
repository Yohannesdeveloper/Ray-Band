"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search, Filter, ChevronDown, Image, Loader2, AlertCircle,
  Plus, Film, FileText, Music, Grid3X3, Star, Eye,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface MediaAsset {
  id: string;
  title: string;
  type: string;
  category: string;
  description: string | null;
  fileUrl: string;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  thumbnailUrl: string | null;
  tags: string | null;
  featured: boolean;
  downloadCount: number;
  createdAt: string;
}

const typeConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  image: { label: "Image", icon: <Image className="w-3 h-3" />, color: "text-blue-400" },
  video: { label: "Video", icon: <Film className="w-3 h-3" />, color: "text-purple-400" },
  document: { label: "Document", icon: <FileText className="w-3 h-3" />, color: "text-emerald-400" },
  audio: { label: "Audio", icon: <Music className="w-3 h-3" />, color: "text-amber-400" },
  logo: { label: "Logo", icon: <Star className="w-3 h-3" />, color: "text-gold" },
  press_kit: { label: "Press Kit", icon: <FileText className="w-3 h-3" />, color: "text-pink-400" },
  brand_guide: { label: "Brand Guide", icon: <FileText className="w-3 h-3" />, color: "text-cyan-400" },
};

const categoryLabels: Record<string, string> = {
  brand: "Brand",
  portfolio: "Portfolio",
  promotional: "Promotional",
  performance: "Performance",
  press: "Press",
  other: "Other",
};

const typeBadgeVariants: Record<string, "default" | "gold" | "red" | "outline" | "glass"> = {
  image: "default",
  video: "gold",
  document: "outline",
  audio: "glass",
  logo: "gold",
  press_kit: "default",
  brand_guide: "glass",
};

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch");
      setAssets(data.assets || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const filtered = assets.filter((asset) => {
    const matchesType = typeFilter === "All" || asset.type === typeFilter;
    const matchesCategory = categoryFilter === "All" || asset.category === categoryFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      asset.title.toLowerCase().includes(q) ||
      asset.description?.toLowerCase().includes(q) ||
      asset.fileName?.toLowerCase().includes(q);
    return matchesType && matchesCategory && matchesSearch;
  });

  const stats = {
    total: assets.length,
    images: assets.filter((a) => a.type === "image").length,
    videos: assets.filter((a) => a.type === "video").length,
    documents: assets.filter((a) => ["document", "press_kit", "brand_guide"].includes(a.type)).length,
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (d: string) => {
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gold animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-deep-red/10 border border-deep-red/20 text-sm text-deep-red-light">
        <AlertCircle className="w-4 h-4 shrink-0" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
            Media & Brand Assets
          </h1>
          <p className="text-warm-white/40 mt-1">
            Digital asset library & brand resources
          </p>
        </div>
        <Link href="/admin/media/upload">
          <Button>
            <Plus className="w-4 h-4" />
            Upload Asset
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-warm-white">{stats.total}</p>
          <p className="text-xs text-warm-white/40">Total Assets</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{stats.images}</p>
          <p className="text-xs text-warm-white/40">Images</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-purple-400">{stats.videos}</p>
          <p className="text-xs text-warm-white/40">Videos</p>
        </Card>
        <Card variant="glass" className="p-3 text-center">
          <p className="text-2xl font-bold text-emerald-400">{stats.documents}</p>
          <p className="text-xs text-warm-white/40">Documents</p>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm placeholder:text-warm-white/30 focus:outline-none focus:ring-2 focus:ring-gold/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="All">All Types</option>
            {Object.entries(typeConfig).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="pl-4 pr-8 py-2.5 rounded-lg bg-surface-light border border-border text-warm-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/50"
          >
            <option value="All">All Categories</option>
            {Object.entries(categoryLabels).map(([key, val]) => (
              <option key={key} value={key}>
                {val}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-white/30 pointer-events-none" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" className="p-12 text-center">
          <Grid3X3 className="w-12 h-12 text-warm-white/10 mx-auto mb-4" />
          <p className="text-warm-white/40 text-lg mb-2">No assets found</p>
          <p className="text-warm-white/30 text-sm">
            Upload media files to build your brand asset library.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((asset) => {
            const typeInfo = typeConfig[asset.type] || typeConfig.document;
            return (
              <Card key={asset.id} variant="hover" className="p-0 overflow-hidden">
                <div className="aspect-video bg-surface relative">
                  {asset.thumbnailUrl ? (
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className={`${typeInfo.color}`}>{typeInfo.icon}</div>
                      <span className="ml-2 text-sm text-warm-white/30 capitalize">
                        {asset.type.replace(/_/g, " ")}
                      </span>
                    </div>
                  )}
                  {asset.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="gold" size="sm">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant={typeBadgeVariants[asset.type] || "default"} size="sm">
                      <span className="flex items-center gap-1">
                        {typeInfo.icon}
                        {typeInfo.label}
                      </span>
                    </Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-warm-white text-sm line-clamp-1 mb-1">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-warm-white/40 capitalize mb-2">
                    {categoryLabels[asset.category] || asset.category}
                  </p>
                  <div className="flex items-center justify-between text-xs text-warm-white/50">
                    <span>{formatFileSize(asset.fileSize)}</span>
                    <span>{formatDate(asset.createdAt)}</span>
                  </div>
                  {asset.description && (
                    <p className="mt-2 text-xs text-warm-white/40 line-clamp-2">
                      {asset.description}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
