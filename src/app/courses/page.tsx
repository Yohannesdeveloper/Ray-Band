import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import {
  Clock, BookOpen, Star, Users,
  Guitar, Piano, Mic, Disc3, Music, Headphones,
} from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Music Courses",
  description:
    "Professional online music courses. Learn guitar, piano, vocals, drums, and more from world-class musicians.",
};

const iconMap: Record<string, React.ElementType> = {
  guitar: Guitar,
  piano: Piano,
  vocals: Mic,
  drums: Disc3,
  theory: Music,
  production: Headphones,
};

function getYouTubeThumbnail(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
  }
  return null;
}

const categories = [
  { id: "all", label: "All Courses" },
  { id: "guitar", label: "Guitar" },
  { id: "piano", label: "Piano" },
  { id: "vocals", label: "Vocals" },
  { id: "drums", label: "Drums" },
  { id: "theory", label: "Music Theory" },
  { id: "production", label: "Production" },
];

export default async function CoursesPage() {
  const courses = await db.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Music Academy</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Learn from <span className="gradient-text">World-Class</span> Musicians
              </h1>
              <p className="text-lg text-warm-white/60 leading-relaxed">
                Professional courses designed to transform your musical journey.
                From beginner to advanced, we have the right course for you.
              </p>
            </div>
          </Container>
        </section>

        <section className="pb-8 bg-background">
          <Container>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-border text-warm-white/60 hover:text-warm-white hover:border-gold/30 hover:bg-gold/5 transition-all"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Container>
        </section>

        <section className="py-16 bg-background">
          <Container>
            {courses.length === 0 ? (
              <div className="text-center py-20">
                <Music className="w-16 h-16 text-warm-white/10 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-warm-white/40 mb-2">No courses yet</h2>
                <p className="text-warm-white/30">Courses will appear here once added by an admin.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const Icon = iconMap[course.category] || Music;
                  const thumbnail = getYouTubeThumbnail(course.trailerUrl || "");
                  return (
                    <Link key={course.id} href={`/courses/${course.slug}`}>
                      <Card variant="hover" padding="none" className="group overflow-hidden h-full">
                        <div className="aspect-video bg-charcoal relative">
                          {thumbnail ? (
                            <>
                              <img
                                src={thumbnail}
                                alt={course.title}
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <svg className="w-5 h-5 text-charcoal ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-deep-red/5 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Icon className="w-6 h-6 text-gold" />
                              </div>
                            </div>
                          )}
                          <Badge variant="gold" className="absolute top-3 left-3 capitalize">
                            {course.category}
                          </Badge>
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] group-hover:text-gold transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-warm-white/40 mt-1">by {course.instructor}</p>
                          <div className="mt-4 flex items-center gap-4 text-xs text-warm-white/40">
                            {course.durationHours && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />{course.durationHours}h
                              </span>
                            )}
                            {course.lessonCount && (
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3.5 h-3.5" />{course.lessonCount} lessons
                              </span>
                            )}
                            {course.rating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-gold fill-gold" />{course.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                            <Badge variant="outline" size="sm" className="capitalize">{course.level}</Badge>
                            {course.price > 0 ? (
                              <span className="text-sm font-bold text-gold">ETB {course.price.toLocaleString()}</span>
                            ) : (
                              <span className="text-sm font-bold text-emerald-400">Free</span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
