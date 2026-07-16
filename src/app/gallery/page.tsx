"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Play } from "lucide-react";

const videos = [
  { id: "GsvWWqfYU4M", title: "Ray Entertainment and Promotion Performance", category: "Concerts" },
  { id: "asnw3y0gSlA", title: "Live Session", category: "Concerts" },
  { id: "aAYYhReLVJM", title: "Ray Entertainment and Promotion Live", category: "Concerts" },
  { id: "0SddRr2gPxI", title: "Concert Highlights", category: "Concerts" },
  { id: "yis15gjdgzg", title: "Event Performance", category: "Events" },
  { id: "jBAdj_3O90k", title: "Behind the Scenes", category: "Behind the Scenes" },
  { id: "Bbz3wqSId24", title: "Band Rehearsal", category: "Behind the Scenes" },
  { id: "StRppIvYL5Y", title: "Short Clip", category: "Events" },
  { id: "_jbtpZOogmQ", title: "Short Clip", category: "Events" },
  { id: "lDhYV9rZjxY", title: "Short Clip", category: "Behind the Scenes" },
  { id: "MB7BCNB6NDk", title: "Short Clip", category: "Events" },
  { id: "LlpgwuFPVz4", title: "Short Clip", category: "Behind the Scenes" },
  { id: "3kn1RVHuH6s", title: "Short Clip", category: "Events" },
  { id: "rdDRsHP8c6g", title: "Short Clip", category: "Behind the Scenes" },
  { id: "za793xM6zK0", title: "Short Clip", category: "Events" },
  { id: "ZhikoQaMiPU", title: "Short Clip", category: "Behind the Scenes" },
];

const tabs = ["All", "Concerts", "Events", "Behind the Scenes"];

export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? videos : videos.filter((v) => v.category === activeTab);

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Gallery</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Moments <span className="gradient-text">Captured</span>
              </h1>
              <p className="text-lg text-warm-white/60">
                A visual journey through our performances, events, and behind-the-scenes magic.
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-24 bg-background">
          <Container>
            <div className="flex flex-wrap gap-2 mb-10">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === tab
                      ? "bg-gold/10 border border-gold/20 text-gold"
                      : "border border-border text-warm-white/60 hover:text-warm-white hover:border-gold/30"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filtered.map((video, i) => (
                <a
                  key={video.id}
                  href={`https://www.youtube.com/watch?v=${video.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`rounded-xl bg-surface border border-border overflow-hidden group cursor-pointer relative ${
                    i % 7 === 0 ? "md:col-span-2 md:row-span-2" : ""
                  } aspect-square`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-surface to-charcoal" />
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-5 h-5 text-gold ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="text-[10px] uppercase tracking-wider text-warm-white/50 bg-charcoal/60 backdrop-blur-sm px-2 py-0.5 rounded">
                      {video.category}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
