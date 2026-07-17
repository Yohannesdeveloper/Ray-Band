"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { FadeUp } from "@/components/ui/animations";

const bandPhotos = [
  "/Bands/Guitarist.jpg",
  "/Bands/PIANO.jpg",
  "/Bands/saxphonist.jpg",
  "/Bands/masinko.jpg",
  "/Bands/photo_4_2026-07-15_09-36-54.jpg",
  "/Bands/photo_5_2026-07-15_09-36-54.jpg",
  "/Bands/photo_6_2026-07-15_09-36-54.jpg",
  "/Bands/photo_7_2026-07-15_09-36-54.jpg",
  "/Bands/photo_10_2026-07-15_09-36-54.jpg",
  "/Bands/photo_11_2026-07-15_09-36-54.jpg",
  "/Bands/photo_12_2026-07-15_09-36-54.jpg",
  "/Bands/photo_2026-07-15_22-10-31.jpg",
  "/Bands/photo_2026-07-16_19-50-17.jpg",
  "/Bands/Cloth 1  (1).jpg",
  "/Bands/Cloth 1  (2).jpg",
  "/Bands/Cloth 1  (3).jpg",
];

export function MeetBand() {
  return (
    <section className="py-24 bg-surface overflow-hidden">
      <Container>
        <div className="flex items-end justify-between mb-16">
          <FadeUp>
            <SectionHeading
              badge="Our Musicians"
              title="Meet the"
              highlighted="Band"
              description="World-class musicians united by passion and excellence."
              align="left"
            />
          </FadeUp>
          <Link
            href="/band"
            className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Container>

      {/* Marquee - Right to Left */}
      <div className="relative">
        <div className="flex w-max animate-marquee-right-to-left">
          {[...bandPhotos, ...bandPhotos].map((src, i) => (
            <div key={i} className="flex-shrink-0 w-48 h-64 mx-2 rounded-xl overflow-hidden group">
              <img
                src={src}
                alt={`Band member ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </div>

      <Container>
        <div className="mt-8 text-center md:hidden">
          <Link href="/band" className="text-gold hover:text-gold-light transition-colors text-sm font-medium">
            View All Musicians <ArrowRight className="w-4 h-4 inline" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
