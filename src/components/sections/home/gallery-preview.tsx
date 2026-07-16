"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
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

        {/* Masonry Grid */}
        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[180px] md:auto-rows-[200px]">
          {videos.map((item, i) => (
            <StaggerItem
              key={i}
              className={`${item.aspect} rounded-xl bg-surface border border-border overflow-hidden group cursor-pointer relative`}
            >
              <a
                href={`https://www.youtube.com/watch?v=${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0"
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
              </a>
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
    </section>
  );
}
