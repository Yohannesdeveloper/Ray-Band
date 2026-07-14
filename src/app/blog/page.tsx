import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Music tips, wedding planning advice, event planning guides, and behind-the-scenes stories from Ray Band.",
};

const posts = [
  { title: "How to Choose the Perfect Band for Your Wedding", category: "Wedding Planning", date: "Dec 15, 2025", author: "David Mehari", excerpt: "Planning your big day? Here's everything you need to know about selecting the right live band for your wedding celebration.", readTime: "5 min" },
  { title: "5 Reasons Live Music Transforms Corporate Events", category: "Corporate", date: "Dec 10, 2025", author: "Sarah Tesfaye", excerpt: "Discover why leading companies are investing in live entertainment for their corporate functions and galas.", readTime: "4 min" },
  { title: "Beginner's Guide to Learning Guitar in 2026", category: "Music Education", date: "Dec 5, 2025", author: "David Mehari", excerpt: "Starting your musical journey? Here's our comprehensive guide to picking up the guitar.", readTime: "7 min" },
  { title: "Top 10 Wedding First Dance Songs of 2025", category: "Wedding Planning", date: "Nov 28, 2025", author: "Sarah Tesfaye", excerpt: "The most popular first dance songs from our performances this year.", readTime: "3 min" },
  { title: "Behind the Scenes: Recording Our Latest Album", category: "Behind the Scenes", date: "Nov 20, 2025", author: "Mikael Desta", excerpt: "A look inside the studio during the recording of our latest album.", readTime: "6 min" },
  { title: "Essential Music Theory for Beginners", category: "Music Education", date: "Nov 15, 2025", author: "Sarah Tesfaye", excerpt: "Understanding the fundamentals of music theory is crucial for any aspiring musician.", readTime: "8 min" },
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Blog</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Stories & <span className="gradient-text">Insights</span>
              </h1>
              <p className="text-lg text-warm-white/60">
                Tips, advice, and stories from the world of music and entertainment.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-background">
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.title} href={`/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
                  <Card variant="hover" padding="none" className="group overflow-hidden h-full">
                    <div className="aspect-video bg-charcoal relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-deep-red/5" />
                      <Badge variant="glass" className="absolute top-3 left-3">{post.category}</Badge>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold font-[family-name:var(--font-playfair)] group-hover:text-gold transition-colors leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-warm-white/40 mt-2 line-clamp-2">{post.excerpt}</p>
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs text-warm-white/30">
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{post.date}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
