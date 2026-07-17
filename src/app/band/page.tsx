import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Meet the Band",
  description:
    "Meet the talented musicians behind Ray Entertainment and Promotion. World-class performers united by passion and excellence.",
};

const musicians = [
  { name: "David Mehari", role: "Lead Vocals & Guitar", bio: "With over 15 years of performing experience, David brings soulful vocals and masterful guitar work to every show.", instruments: ["Guitar", "Vocals"], experience: "15+ years", education: "Berklee College of Music", image: "/Bands/Guitarist.jpg" },
  { name: "Sarah Tesfaye", role: "Vocals & Keys", bio: "Sarah's versatile vocal range and keyboard skills have graced stages across Africa and beyond.", instruments: ["Piano", "Vocals", "Keyboard"], experience: "12+ years", education: "Royal Academy of Music", image: "/Bands/Piano.jpg" },
  { name: "Mikael Desta", role: "Saxophone & Production", bio: "Mikael's smooth saxophone tones and music production skills add a unique dimension to the band.", instruments: ["Saxophone", "Clarinet"], experience: "10+ years", education: "Berklee College of Music", image: "/Bands/saxphonist.jpg" },
  { name: "Hana Bekele", role: "Violin", bio: "Hana's classical training and contemporary flair create magical string arrangements.", instruments: ["Violin", "Viola"], experience: "14+ years", education: "Vienna Conservatory", image: "/Bands/masinko.jpg" },
  { name: "Yonatan Alem", role: "Drums & Percussion", bio: "The rhythmic backbone of Ray Entertainment and Promotion, Yonatan's energetic drumming drives every performance.", instruments: ["Drums", "Percussion"], experience: "11+ years", education: "Addis Ababa University", image: "/Bands/photo_4_2026-07-15_09-36-54.jpg" },
  { name: "Ruth Girma", role: "Bass Guitar", bio: "Ruth's deep grooves and melodic bass lines provide the foundation for Ray Entertainment and Promotion's signature sound.", instruments: ["Bass Guitar", "Double Bass"], experience: "9+ years", education: "MI College of Music", image: "/Bands/photo_5_2026-07-15_09-36-54.jpg" },
  { name: "Samuel Tesfaye", role: "Keyboard & Synthesizer", bio: "Samuel's mastery of keys and synths brings rich harmonic textures to every arrangement.", instruments: ["Keyboard", "Synthesizer"], experience: "8+ years", education: "Addis Ababa University", image: "/Bands/photo_6_2026-07-15_09-36-54.jpg" },
  { name: "Daniel Hailu", role: "Trumpet & Brass", bio: "Daniel's powerful trumpet lines cut through any mix, adding bold brass accents to the band's sound.", instruments: ["Trumpet", "Flugelhorn"], experience: "10+ years", education: "Hans Eisler School of Music", image: "/Bands/photo_7_2026-07-15_09-36-54.jpg" },
  { name: "Tigist Abebe", role: "Vocals & Percussion", bio: "Tigist's angelic vocals and rhythmic percussion add depth and soul to the ensemble.", instruments: ["Vocals", "Tambourine"], experience: "7+ years", education: "Addis Ababa University", image: "/Bands/photo_10_2026-07-15_09-36-54.jpg" },
  { name: "Abel Mekonnen", role: "Acoustic Guitar", bio: "Abel's fingerpicking style and melodic sensibility bring warmth and intimacy to acoustic performances.", instruments: ["Acoustic Guitar", "Banjo"], experience: "9+ years", education: "Berklee College of Music", image: "/Bands/photo_11_2026-07-15_09-36-54.jpg" },
  { name: "Liya Kebede", role: "Vocals & Songwriting", bio: "Liya's poetic lyrics and emotive voice bring storytelling and depth to the band's original compositions.", instruments: ["Vocals", "Songwriting"], experience: "6+ years", education: "Royal Academy of Music", image: "/Bands/photo_12_2026-07-15_09-36-54.jpg" },
  { name: "Kidus Tadesse", role: "Bass & Arrangement", bio: "Kidus combines deep bass grooves with skilled musical arrangement to shape the band's dynamic sound.", instruments: ["Electric Bass", "Arrangement"], experience: "8+ years", education: "MI College of Music", image: "/Bands/photo_2026-07-15_22-10-31.jpg" },
  { name: "Naomi Fekadu", role: "Keys & Backing Vocals", bio: "Naomi's keyboard skills and harmonious backing vocals glue the band's sound together.", instruments: ["Keyboard", "Vocals"], experience: "5+ years", education: "Vienna Conservatory", image: "/Bands/photo_2026-07-16_19-50-17.jpg" },
  { name: "Elias Worku", role: "Percussion & Rhythm", bio: "Elias's diverse percussion techniques from traditional Ethiopian instruments add an authentic cultural dimension.", instruments: ["Kebero", "Percussion"], experience: "12+ years", education: "Addis Ababa University", image: "/Bands/Cloth 1  (2).jpg" },
  { name: "Meron Alemayehu", role: "Violin & Music Direction", bio: "Meron's classical training and leadership as music director ensure every performance is flawlessly executed.", instruments: ["Violin", "Music Direction"], experience: "13+ years", education: "Vienna Conservatory", image: "/Bands/Cloth 1  (3).jpg" },
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
