"use client";

import Link from "next/link";
import { ArrowRight, Camera, Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const images = [
  { type: "image", src: "/Bands/Cloth 1 (1).jpg", alt: "Band Cloth 1", aspect: "col-span-2 row-span-2" },
  { type: "image", src: "/Bands/Cloth 2.jpg", alt: "Band Cloth 2", aspect: "col-span-1 row-span-1" },
  { type: "image", src: null, alt: "", aspect: "col-span-1 row-span-1" },
  { type: "image", src: null, alt: "", aspect: "col-span-1 row-span-2" },
  { type: "image", src: null, alt: "", aspect: "col-span-1 row-span-1" },
  { type: "image", src: null, alt: "", aspect: "col-span-2 row-span-1" },
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
          {images.map((item, i) => (
            <StaggerItem
              key={i}
              className={`${item.aspect} rounded-xl bg-surface border border-border overflow-hidden group cursor-pointer relative`}
            >
              {item.src ? (
                <img src={item.src} alt={item.alt} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-surface-lighter" />
              )}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gold/5 flex items-center justify-center">
                {item.type === "video" ? (
                  <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center">
                    <Play className="w-5 h-5 text-gold ml-0.5" />
                  </div>
                ) : (
                  <Camera className="w-6 h-6 text-gold" />
                )}
              </div>
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
