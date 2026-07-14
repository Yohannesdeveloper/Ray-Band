import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  highlighted?: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  badge,
  title,
  highlighted,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {badge && (
        <span className="inline-flex items-center gap-2 rounded-full bg-gold/10 border border-gold/20 px-4 py-1.5 text-xs font-medium text-gold uppercase tracking-wider mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-playfair)] leading-tight">
        {title}{" "}
        {highlighted && <span className="gradient-text">{highlighted}</span>}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-warm-white/60 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
