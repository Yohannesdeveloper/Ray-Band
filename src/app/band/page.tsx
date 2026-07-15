import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Meet the Band",
  description:
    "Meet the talented musicians behind Ray Band. World-class performers united by passion and excellence.",
};

const musicians = [
  { name: "David Mehari", role: "Lead Vocals & Guitar", bio: "With over 15 years of performing experience, David brings soulful vocals and masterful guitar work to every show.", instruments: ["Guitar", "Vocals"], experience: "15+ years", education: "Berklee College of Music", image: "/Bands/Guitarist.jpg" },
  { name: "Sarah Tesfaye", role: "Vocals & Keys", bio: "Sarah's versatile vocal range and keyboard skills have graced stages across Africa and beyond.", instruments: ["Piano", "Vocals", "Keyboard"], experience: "12+ years", education: "Royal Academy of Music", image: "/Bands/Piano.jpg" },
  { name: "Mikael Desta", role: "Saxophone & Production", bio: "Mikael's smooth saxophone tones and music production skills add a unique dimension to the band.", instruments: ["Saxophone", "Clarinet"], experience: "10+ years", education: "Berklee College of Music", image: "/Bands/saxphonist.jpg" },
  { name: "Hana Bekele", role: "Violin", bio: "Hana's classical training and contemporary flair create magical string arrangements.", instruments: ["Violin", "Viola"], experience: "14+ years", education: "Vienna Conservatory", image: "/Bands/masinko.jpg" },
  { name: "Yonatan Alem", role: "Drums & Percussion", bio: "The rhythmic backbone of Ray Band, Yonatan's energetic drumming drives every performance.", instruments: ["Drums", "Percussion"], experience: "11+ years", education: "Addis Ababa University", image: "/Bands/photo_4_2026-07-15_09-36-54.jpg" },
  { name: "Ruth Girma", role: "Bass Guitar", bio: "Ruth's deep grooves and melodic bass lines provide the foundation for Ray Band's signature sound.", instruments: ["Bass Guitar", "Double Bass"], experience: "9+ years", education: "MI College of Music", image: "/Bands/photo_5_2026-07-15_09-36-54.jpg" },
];

export default function BandPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Our Musicians</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Meet the <span className="gradient-text">Band</span>
              </h1>
              <p className="text-lg text-warm-white/60 leading-relaxed">
                A collective of world-class musicians united by passion, dedication,
                and an unwavering commitment to musical excellence.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-24 bg-surface">
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {musicians.map((m) => (
                <Card key={m.name} variant="bordered" padding="none" className="group hover:border-gold/30 transition-colors overflow-hidden">
                  <div className="aspect-[3/4] bg-charcoal relative overflow-hidden">
                    {m.image ? (
                      <img src={m.image} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-gold/50 font-[family-name:var(--font-playfair)]">
                            {m.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] group-hover:text-gold transition-colors">
                      {m.name}
                    </h3>
                    <p className="text-sm text-gold mt-1">{m.role}</p>
                    <p className="text-sm text-warm-white/50 mt-3 leading-relaxed">{m.bio}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {m.instruments.map((inst) => (
                        <Badge key={inst} variant="glass" size="sm">{inst}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-3 text-xs text-warm-white/40">
                      <div>
                        <span className="text-warm-white/60 font-medium">Experience</span>
                        <p className="mt-0.5">{m.experience}</p>
                      </div>
                      <div>
                        <span className="text-warm-white/60 font-medium">Education</span>
                        <p className="mt-0.5">{m.education}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
