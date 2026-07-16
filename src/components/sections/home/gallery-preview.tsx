"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, Play, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const videos = [
  { id: "GsvWWqfYU4M", title: "Ray Entertainment and Promotion Performance", aspect: "col-span-2 row-span-2" },
  { id: "asnw3y0gSlA", title: "Live Session", aspect: "col-span-1 row-span-1" },
  { id: "aAYYhReLVJM", title: "Ray Entertainment and Promotion Live", aspect: "col-span-1 row-span-1" },
  { id: "0SddRr2gPxI", title: "Concert Highlights", aspect: "col-span-1 row-span-2" },
  { id: "yis15gjdgzg", title: "Event Performance", aspect: "col-span-1 row-span-1" },
  { id: "jBAdj_3O90k", title: "Behind the Scenes", aspect: "col-span-1 row-span-1" },
  { id: "Bbz3wqSId24", title: "Band Rehearsal", aspect: "col-span-2 row-span-1" },
  { id: "StRppIvYL5Y", title: "Short Clip", aspect: "col-span-1 row-span-1" },
  { id: "_jbtpZOogmQ", title: "Short Clip", aspect: "col-span-1 row-span-1" },
  { id: "lDhYV9rZjxY", title: "Short Clip", aspect: "col-span-1 row-span-1" },
  { id: "MB7BCNB6NDk", title: "Short Clip", aspect: "col-span-1 row-span-2" },
  { id: "LlpgwuFPVz4", title: "Short Clip", aspect: "col-span-1 row-span-1" },
  { id: "3kn1RVHuH6s", title: "Short Clip", aspect: "col-span-1 row-span-1" },
  { id: "rdDRsHP8c6g", title: "Short Clip", aspect: "col-span-2 row-span-1" },
  { id: "za793xM6zK0", title: "Short Clip", aspect: "col-span-1 row-span-1" },
  { id: "ZhikoQaMiPU", title: "Short Clip", aspect: "col-span-1 row-span-1" },
];

export function GalleryPreview() {
  const [activeVideo, setActiveVideo] = useState<{ id: string; title: string } | null>(null);

  const close = useCallback(() => setActiveVideo(null), []);

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [activeVideo]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [close]);

  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="flex items-end justify-between mb-16">
          <FadeUp>
            <SectionHeading
              badge="Gallery"
              title="Moments"
              highlighted="Captured"
              description="A glimpse into our performances, events, and behind-the-scenes magic."
              align="left"
            />
          </FadeUp>
          <Link
            href="/gallery"
            className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium"
          >
            Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px] md:auto-rows-[200px]">
          {videos.map((item, i) => (
            <StaggerItem
              key={i}
              className={`${item.aspect} rounded-xl bg-surface border border-border overflow-hidden group cursor-pointer relative`}
            >
              <button
                onClick={() => setActiveVideo({ id: item.id, title: item.title })}
                className="absolute inset-0 w-full h-full text-left"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-surface to-charcoal" />
                <img
                  src={`https://img.youtube.com/vi/${item.id}/hqdefault.jpg`}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                    <Play className="w-5 h-5 text-gold ml-0.5" />
                  </div>
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerChildren>

        <div className="mt-8 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/gallery">
              View Full Gallery <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>

      {activeVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-4xl bg-surface rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <h3 className="text-warm-white font-semibold truncate pr-4">{activeVideo.title}</h3>
              <button
                onClick={close}
                className="p-1.5 rounded-full hover:bg-charcoal-light transition-colors"
              >
                <X className="w-5 h-5 text-warm-white/70" />
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
