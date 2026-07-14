import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "gold" | "red" | "outline" | "glass";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap",
        {
          "bg-charcoal-lighter text-warm-white": variant === "default",
          "bg-gold/15 text-gold border border-gold/20": variant === "gold",
          "bg-deep-red/15 text-deep-red-light border border-deep-red/20":
            variant === "red",
          "border border-border text-warm-white/70": variant === "outline",
          "glass text-warm-white": variant === "glass",
        },
        {
          "px-2.5 py-0.5 text-xs": size === "sm",
          "px-3.5 py-1 text-sm": size === "md",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
