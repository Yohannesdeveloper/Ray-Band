import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex items-center">
        <Container>
          <div className="text-center max-w-lg mx-auto py-20">
            <div className="text-8xl font-bold font-[family-name:var(--font-playfair)] gradient-text mb-4">
              404
            </div>
            <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
            <p className="text-warm-white/50 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Button variant="primary" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
