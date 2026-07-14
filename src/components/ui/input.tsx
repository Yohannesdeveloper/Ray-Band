import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-warm-white/80 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-white/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full rounded-xl bg-surface-light border border-border px-4 py-3 text-warm-white placeholder:text-warm-white/30",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50",
              "hover:border-border-light",
              icon && "pl-10",
              error && "border-deep-red/50 focus:ring-deep-red/50",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-sm text-deep-red-light">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
