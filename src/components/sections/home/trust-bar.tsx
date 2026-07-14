"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/ui/container";
import {
  Music,
  Users,
  Clock,
  Star,
  Trophy,
  CalendarCheck,
} from "lucide-react";

const stats = [
  { icon: CalendarCheck, value: 500, suffix: "+", label: "Live Performances" },
  { icon: Clock, value: 10, suffix: "+", label: "Years Experience" },
  { icon: Users, value: 1000, suffix: "+", label: "Happy Clients" },
  { icon: Trophy, value: 50, suffix: "+", label: "Corporate Events" },
  { icon: Music, value: 20, suffix: "+", label: "Professional Musicians" },
  { icon: Star, value: 4.9, suffix: "★", label: "Average Rating" },
];

function AnimatedCounter({
  target,
  suffix,
}: {
  target: number;
  suffix: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(eased * target);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {target % 1 !== 0 ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

export function TrustBar() {
  return (
    <section className="py-16 bg-surface border-y border-border">
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-3">
                <stat.icon className="w-5 h-5 text-gold" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-warm-white">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-warm-white/40 mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
