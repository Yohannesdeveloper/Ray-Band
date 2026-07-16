import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import {
  Clock, BookOpen, Star, Users, ChevronLeft,
  Guitar, Piano, Mic, Disc3, Music, Headphones,
  Play,
} from "lucide-react";

export const dynamic = "force-dynamic";

const iconMap: Record<string, React.ElementType> = {
  guitar: Guitar,
  piano: Piano,
  vocals: Mic,
  drums: Disc3,
  theory: Music,
  production: Headphones,
};

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
    /youtube\.com\/shorts\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }
  if (url.includes("youtube.com/embed/")) return url;
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await db.course.findUnique({ where: { slug } });
  return {
    title: course?.title || "Course Not Found",
    description: course?.shortDescription || course?.description,
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await db.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: "asc" } } },
  });

  if (!course) notFound();

  const Icon = iconMap[course.category!] || Music;
  const embedUrl = getYouTubeEmbedUrl(course.trailerUrl || "");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lessons = (course as any).lessons || [];

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-background min-h-screen">
        <Container>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-warm-white/50 hover:text-gold transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Courses
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {embedUrl ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-border">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-border flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-4 border border-gold/30">
                      <Icon className="w-10 h-10 text-gold" />
                    </div>
                    <p className="text-warm-white/40 text-sm">No trailer available</p>
                  </div>
                </div>
              )}

              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="gold" className="capitalize">{course.category}</Badge>
                  <Badge variant="outline" className="capitalize">{course.level}</Badge>
                  {course.featured && <Badge variant="gold">Featured</Badge>}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-playfair)] text-warm-white mb-4">
                  {course.title}
                </h1>
                <p className="text-warm-white/60 leading-relaxed">
                  {course.description || course.shortDescription || "No description available."}
                </p>
              </div>

              <Card variant="glass" className="p-6">
                <h2 className="text-lg font-bold text-warm-white mb-4 font-[family-name:var(--font-playfair)]">
                  About the Instructor
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                    <span className="text-gold font-bold text-lg">
                      {course.instructor.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-warm-white">{course.instructor}</p>
                    {course.instructorBio && (
                      <p className="text-sm text-warm-white/40 mt-1">{course.instructorBio}</p>
                    )}
                  </div>
                </div>
              </Card>

              {lessons.length > 0 && (
                <Card variant="glass" className="p-6">
                  <h2 className="text-lg font-bold text-warm-white mb-4 font-[family-name:var(--font-playfair)]">
                    Lessons ({lessons.length})
                  </h2>
                  <div className="space-y-2">
                    {lessons.map((lesson: { id: string; title: string; description?: string; isFree: boolean; durationMinutes?: number }, i: number) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-light/50 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-surface-light flex items-center justify-center text-xs text-warm-white/50 shrink-0">
                          {lesson.isFree ? (
                            <Play className="w-3.5 h-3.5 text-gold" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-warm-white/80 truncate">{lesson.title}</p>
                          {lesson.description && (
                            <p className="text-xs text-warm-white/30 truncate">{lesson.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {lesson.isFree && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/10 text-gold">Free</span>
                          )}
                          {lesson.durationMinutes && (
                            <span className="text-xs text-warm-white/30">{lesson.durationMinutes}m</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <Card variant="glass" className="p-6 sticky top-28">
                <div className="text-3xl font-bold text-gold mb-4">
                  {course.price > 0 ? `ETB ${course.price.toLocaleString()}` : "Free"}
                </div>
                <Button variant="primary" className="w-full mb-4" size="lg">
                  Enroll Now
                </Button>
                <div className="space-y-3 text-sm">
                  {course.durationHours && (
                    <div className="flex items-center gap-3 text-warm-white/60">
                      <Clock className="w-4 h-4 text-warm-white/30" />
                      <span>{course.durationHours} hours of content</span>
                    </div>
                  )}
                  {course.lessonCount && (
                    <div className="flex items-center gap-3 text-warm-white/60">
                      <BookOpen className="w-4 h-4 text-warm-white/30" />
                      <span>{course.lessonCount} lessons</span>
                    </div>
                  )}
                  {course.rating > 0 && (
                    <div className="flex items-center gap-3 text-warm-white/60">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span>{course.rating.toFixed(1)} ({course.reviewCount} reviews)</span>
                    </div>
                  )}
                  {course.enrollmentCount > 0 && (
                    <div className="flex items-center gap-3 text-warm-white/60">
                      <Users className="w-4 h-4 text-warm-white/30" />
                      <span>{course.enrollmentCount.toLocaleString()} students enrolled</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
