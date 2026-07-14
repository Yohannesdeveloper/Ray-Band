"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef, isValidElement } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild, children, ...props }, ref) => {
    const buttonClasses = cn(
      "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 cursor-pointer whitespace-nowrap",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:pointer-events-none disabled:opacity-50",
      {
        "bg-gold text-charcoal hover:bg-gold-light hover:shadow-lg hover:shadow-gold/20 active:scale-95":
          variant === "primary" || variant === "gold",
        "bg-charcoal-light text-warm-white hover:bg-charcoal-lighter border border-border":
          variant === "secondary",
        "border border-gold/30 text-gold hover:bg-gold/10 hover:border-gold":
          variant === "outline",
        "text-warm-white hover:bg-white/5": variant === "ghost",
      },
      {
        "px-4 py-2 text-sm": size === "sm",
        "px-6 py-3 text-sm": size === "md",
        "px-8 py-4 text-base": size === "lg",
      },
      className
    );

    if (asChild && isValidElement(children)) {
      const child = children as React.ReactElement<{ className?: string }>;
      return (
        <child.type
          {...child.props}
          className={cn(buttonClasses, child.props.className)}
        />
      );
    }

    return (
      <button ref={ref} className={buttonClasses} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
