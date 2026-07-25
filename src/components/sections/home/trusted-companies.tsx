"use client";

const companies = [
  { name: "EBS Arada Kidame", logo: "/Companies/arada-kedame-removebg-preview.png" },
  { name: "NBC Talent Show", logo: "/Companies/Nbc-removebg-preview.png" },
  { name: "AMN Talent Show", logo: "/Companies/amn-removebg-preview.png" },
  { name: "FANA Kelemat", logo: "/Companies/fana-removebg-preview.png" },
  { name: "FANA Holiday Program", logo: "/Companies/fana-removebg-preview.png" },
  { name: "Ray Entertainment and Promotion", logo: "/LOGO RAY  BAND.jpg" },
  { name: "EBS", logo: "/Companies/ebs logo.png" },
];

function LogoSet() {
  return (
    <>
      {companies.map((company, i) => (
        <div
          key={`${company.name}-${i}`}
          className="flex items-center justify-center shrink-0 px-8 opacity-40 hover:opacity-80 transition-opacity duration-300"
        >
          <img
            src={company.logo}
            alt={company.name}
            className="h-14 md:h-20 w-auto object-contain"
          />
        </div>
      ))}
    </>
  );
}

export function TrustedCompanies() {
  return (
    <section className="py-12 bg-background border-b border-border overflow-hidden">
      <p className="text-center text-xs uppercase tracking-[0.2em] text-warm-white/30 mb-8">
        Trusted By
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex flex-nowrap items-center w-max animate-marquee">
          <LogoSet />
          <LogoSet />
          <LogoSet />
        </div>
      </div>
    </section>
  );
}
