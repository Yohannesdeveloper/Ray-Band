"use client";

import { useState } from "react";
import { Send, CheckCircle, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-24 bg-surface border-t border-border">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-7 h-7 text-gold" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold font-[family-name:var(--font-playfair)] mb-3">
            Join the <span className="gradient-text">Inner Circle</span>
          </h2>
          <p className="text-warm-white/50 mb-8">
            Get exclusive access to behind-the-scenes content, early bird
            offers, free resources, and updates on upcoming events.
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-3 text-gold">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">
                Welcome to the inner circle! Check your email.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" variant="primary">
                Subscribe <Send className="w-4 h-4" />
              </Button>
            </form>
          )}

          <p className="mt-4 text-xs text-warm-white/20">
            Join 5,000+ subscribers. Unsubscribe anytime. No spam, ever.
          </p>
        </div>
      </Container>
    </section>
  );
}
