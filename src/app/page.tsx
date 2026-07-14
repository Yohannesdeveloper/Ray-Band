import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/home/hero";
import { TrustBar } from "@/components/sections/home/trust-bar";
import { ServicesGrid } from "@/components/sections/home/services-grid";
import { FeaturedVideo } from "@/components/sections/home/featured-video";
import { AboutPreview } from "@/components/sections/home/about-preview";
import { MeetBand } from "@/components/sections/home/meet-band";
import { CoursesPreview } from "@/components/sections/home/courses-preview";
import { Testimonials } from "@/components/sections/home/testimonials";
import { GalleryPreview } from "@/components/sections/home/gallery-preview";
import { BlogPreview } from "@/components/sections/home/blog-preview";
import { CtaBanner } from "@/components/sections/home/cta-banner";
import { Newsletter } from "@/components/sections/home/newsletter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <ServicesGrid />
        <FeaturedVideo />
        <AboutPreview />
        <MeetBand />
        <CoursesPreview />
        <Testimonials />
        <GalleryPreview />
        <BlogPreview />
        <CtaBanner />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
