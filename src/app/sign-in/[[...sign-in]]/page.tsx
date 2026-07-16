import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Music } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <img src="/LOGO RAY  BAND.jpg" alt="Ray Entertainment and Promotion" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-warm-white">
              Ray Entertainment and Promotion
            </span>
          </Link>
          <p className="text-warm-white/40 text-sm">Sign in to your account</p>
        </div>
        <SignIn
          routing="path"
          path="/sign-in"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-surface-light border border-border shadow-xl",
            },
          }}
        />
      </div>
    </div>
  );
}
