"use client";

import Link from "next/link";
import { ArrowRight, Calendar, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FadeUp, StaggerChildren, StaggerItem } from "@/components/ui/animations";

const posts = [
  {
    title: "How to Choose the Perfect Band for Your Wedding",
    category: "Wedding Planning",
    date: "Dec 15, 2025",
    author: "David Mehari",
    excerpt: "Planning your big day? Here's everything you need to know about selecting the right live band for your wedding celebration.",
    readTime: "5 min read",
  },
  {
    title: "5 Reasons Live Music Transforms Corporate Events",
    category: "Corporate",
    date: "Dec 10, 2025",
    author: "Sarah Tesfaye",
    excerpt: "Discover why leading companies are investing in live entertainment for their corporate functions and galas.",
    readTime: "4 min read",
  },
  {
    title: "Beginner's Guide to Learning Guitar in 2026",
    category: "Music Education",
    date: "Dec 5, 2025",
    author: "David Mehari",
    excerpt: "Starting your musical journey? Here's our comprehensive guide to picking up the guitar and making real progress.",
    readTime: "7 min read",
  },
];

export function BlogPreview() {
  return (
    <section className="py-24 bg-surface">
      <Container>
        <div className="flex items-end justify-between mb-16">
          <FadeUp>
            <SectionHeading
              badge="Blog"
              title="Latest"
              highlighted="Stories"
              description="Tips, insights, and stories from the world of music and entertainment."
              align="left"
            />
          </FadeUp>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium"
          >
            All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <StaggerChildren>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <StaggerItem key={post.title}>
                <Link href={`/blog/${post.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <Card variant="hover" padding="none" className="group overflow-hidden h-full">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-charcoal relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-deep-red/5" />
                      <Badge variant="glass" className="absolute top-3 left-3">
                        {post.category}
                      </Badge>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] group-hover:text-gold transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-warm-white/40 mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-warm-white/30">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {post.date}
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
            <Link href="/blog">
              Read All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
