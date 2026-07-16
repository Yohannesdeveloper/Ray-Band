"use client";

import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

export function FeaturedVideo() {
  return (
    <section id="featured-video" className="py-24 bg-surface">
      <Container>
        <SectionHeading
          badge="Featured Performance"
          title="Experience the"
          highlighted="Magic"
          description="Watch our latest live performance and feel the energy we bring to every stage."
        />

        <div className="mt-16 max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-charcoal border border-border">
            <iframe
              src="https://www.youtube.com/embed/aQiP4-mOzAY"
              title="Ray Entertainment and Promotion Live Performance"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
