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
  { name: "Natnael", role: "Guitar (Founder & Band Leader)", bio: "Graduate of Teferi Mekonen Music School, Jazz Amba Music School, and Siddarta Music School. Guitar and Music Arrangement instructor at Siddarta Music School. Ray Band music director. Has performed on major TV productions and at leading clubs and live music venues across Addis Ababa. Experienced in studio production, music arrangement, and professional session work.", instruments: ["Guitar", "Music Arrangement"], experience: "15+ years", education: "Siddarta Music School", image: "/Bands/Guitarist.jpg" },
  { name: "Mesgun", role: "Keyboard", bio: "Graduate of Mekane Yesus Music School. Accomplished gospel keyboardist with 20 years of professional performance experience. Has performed on major TV productions, concerts, Dubai club stages, and leading clubs across Ethiopia. Experienced in studio production and professional session recording. Regularly collaborates with various recording studios and live music projects as a session keyboardist.", instruments: ["Keyboard"], experience: "20+ years", education: "Mekane Yesus Music School", image: "/Bands/Piano.jpg" },
  { name: "Mikael Desta", role: "Saxophone & Production", bio: "Mikael's smooth saxophone tones and music production skills add a unique dimension to the band.", instruments: ["Saxophone", "Clarinet"], experience: "10+ years", education: "Berklee College of Music", image: "/Bands/saxphonist.jpg" },
  { name: "Hana Bekele", role: "Violin", bio: "Hana's classical training and contemporary flair create magical string arrangements.", instruments: ["Violin", "Viola"], experience: "14+ years", education: "Vienna Conservatory", image: "/Bands/masinko.jpg" },
  { name: "Yisak", role: "Drums", bio: "Graduate of Teferi Mekonen Music School and Siddarta Music School. Drum Instructor at Siddarta Music School. Has performed at leading clubs in Dubai and major clubs and live events across Addis Ababa.", instruments: ["Drums", "Percussion"], experience: "8+ years", education: "Siddarta Music School", image: "/Bands/photo_4_2026-07-15_09-36-54.jpg" },
  { name: "Ananiya", role: "Bass & Double Bass", bio: "Graduate of Yared Music School and currently a Music Teacher there. 9 years of professional playing experience, regularly performing at major clubs, concerts, corporate events, and private functions across Addis Ababa.", instruments: ["Bass Guitar", "Double Bass"], experience: "9+ years", education: "Yared Music School", image: "/Bands/photo_7_2026-07-15_09-36-54.jpg" },
  { name: "Biniyam", role: "Trumpet", bio: "Graduate of Teferi Mekonen Music School and Siddarta Music School. Trumpet instructor at Siddarta Music School. 9 years of professional performance experience. Regularly performs at major clubs, concerts, corporate events, and private functions across Addis Ababa.", instruments: ["Trumpet"], experience: "9+ years", education: "Siddarta Music School", image: "/Bands/photo_10_2026-07-15_09-36-54.jpg" },
  { name: "Andualem", role: "Saxophone", bio: "Trained in Saxophone at the Ethiopian National Defense Force Music School. Conductor and Instructor of the Dire Dawa Orchestra. Has performed on major TV productions, concerts, festivals, and leading clubs across Ethiopia. Experienced professional studio session saxophonist, contributing to numerous recording projects.", instruments: ["Saxophone"], experience: "15+ years", education: "Ethiopian National Defense Force Music School", image: "/Bands/photo_12_2026-07-15_09-36-54.jpg" },
  { name: "Natnael", role: "Keyboard", bio: "Graduate of Jazz Amba Music School. Keyboard and Harmony Instructor at Jazz Amba Music School. Regular performer on major TV productions, corporate events, concerts, and live shows across Addis Ababa. Serves as a Music Director for several professional bands, leading rehearsals, arrangements, and live performances.", instruments: ["Keyboard", "Harmony"], experience: "10+ years", education: "Jazz Amba Music School", image: "/Bands/photo_2026-07-15_22-10-31.jpg" },
  { name: "Naomi Fekadu", role: "Keys & Backing Vocals", bio: "Naomi's keyboard skills and harmonious backing vocals glue the band's sound together.", instruments: ["Keyboard", "Vocals"], experience: "5+ years", education: "Vienna Conservatory", image: "/Bands/photo_2026-07-16_19-50-17.jpg" },
  { name: "Nahom", role: "Trombone", bio: "Graduate of Yared School of Music. Has performed with numerous professional bands across Ethiopia. Experienced professional studio session trombonist. Serves as a Music Director for multiple bands, overseeing musical arrangements and live performances. Skilled in music production and studio recording.", instruments: ["Trombone", "Music Direction"], experience: "9+ years", education: "Yared School of Music", image: "/Bands/photo_2026-07-25_10-00-10.jpg" },
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
              {musicians.map((m, i) => (
                <Card key={i} variant="bordered" padding="none" className="group hover:border-gold/30 transition-colors overflow-hidden">
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
