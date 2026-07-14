"use client";

import Link from "next/link";
import { ArrowRight, Clock, BookOpen, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const courses = [
  {
    title: "Guitar Mastery",
    category: "Guitar",
    level: "Beginner to Advanced",
    duration: "12 weeks",
    lessons: 48,
    rating: 4.9,
    students: 2340,
    instructor: "David Mehari",
  },
  {
    title: "Piano Foundations",
    category: "Piano",
    level: "Beginner",
    duration: "8 weeks",
    lessons: 32,
    rating: 4.8,
    students: 1890,
    instructor: "Sarah Tesfaye",
  },
  {
    title: "Vocal Performance",
    category: "Vocals",
    level: "Intermediate",
    duration: "10 weeks",
    lessons: 40,
    rating: 4.9,
    students: 1560,
    instructor: "David Mehari",
  },
];

export function CoursesPreview() {
  return (
    <section className="py-24 bg-background">
      <Container>
        <div className="flex items-end justify-between mb-16">
          <FadeUp>
            <SectionHeading
              badge="Music Academy"
              title="Learn From the"
              highlighted="Best"
              description="Professional courses designed to transform your musical journey."
              align="left"
            />
          </FadeUp>
          <Link
            href="/courses"
            className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium"
          >
            All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StaggerChildren>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <StaggerItem key={course.title}>
                <Link href={`/courses/${course.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Card variant="hover" padding="none" className="group overflow-hidden h-full">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-charcoal relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-deep-red/5" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6 text-gold" />
                        </div>
                      </div>
                      <Badge variant="gold" className="absolute top-3 left-3">
                        {course.category}
                      </Badge>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] group-hover:text-gold transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-warm-white/40 mt-1">
                        by {course.instructor}
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-xs text-warm-white/40">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {course.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                          {course.rating}
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <Badge variant="outline" size="sm">{course.level}</Badge>
                        <span className="text-xs text-warm-white/30">
                          {course.students.toLocaleString()} students
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </div>
        </StaggerChildren>

        <div className="mt-10 text-center md:hidden">
          <Button variant="outline" asChild>
            <Link href="/courses">
              View All Courses <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
