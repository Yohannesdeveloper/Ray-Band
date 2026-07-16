import { cn } from "@/lib/utils";
import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "bordered" | "hover";
  padding?: "none" | "sm" | "md" | "lg";
  children?: ReactNode;
}

function Card({ className, variant = "default", padding = "md", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl transition-all duration-300",
        {
          "bg-surface-light": variant === "default",
          "glass": variant === "glass",
          "border border-border bg-surface": variant === "bordered",
          "bg-surface-light hover:bg-surface-lighter hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 cursor-pointer":
            variant === "hover",
        },
        {
          "p-0": padding === "none",
          "p-4": padding === "sm",
          "p-6": padding === "md",
          "p-8": padding === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card };
export type { CardProps };
