import type { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Official Ray Band merchandise. T-shirts, caps, hoodies, mugs, and more.",
};

const products = [
  { name: "Classic Ray Band Tee", price: 35, category: "Apparel", rating: 4.8, reviews: 124 },
  { name: "Ray Band Hoodie", price: 65, category: "Apparel", rating: 4.9, reviews: 89 },
  { name: "Gold Logo Cap", price: 25, category: "Accessories", rating: 4.7, reviews: 201 },
  { name: "Ray Band Mug", price: 15, category: "Accessories", rating: 4.6, reviews: 156 },
  { name: "Signed Album", price: 45, category: "Music", rating: 5.0, reviews: 67 },
  { name: "Ray Band Poster", price: 20, category: "Accessories", rating: 4.5, reviews: 93 },
  { name: "Guitar Pick Set", price: 10, category: "Accessories", rating: 4.8, reviews: 234 },
  { name: "Gift Card", price: 50, category: "Gift Cards", rating: 4.9, reviews: 78 },
];

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="pt-32 pb-16 bg-background">
          <Container>
            <div className="max-w-3xl">
              <Badge variant="gold" className="mb-6">Merchandise</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-playfair)] leading-tight mb-6">
                Official <span className="gradient-text">Merch</span>
              </h1>
              <p className="text-lg text-warm-white/60">
                Rep your favorite band with official Ray Band merchandise.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-16 bg-background">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <Card key={product.name} variant="hover" padding="none" className="group overflow-hidden">
                  <div className="aspect-square bg-surface relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-surface-lighter" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-warm-white/10" />
                    </div>
                    <Badge variant="glass" className="absolute top-3 left-3">{product.category}</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm group-hover:text-gold transition-colors">{product.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-gold fill-gold" />
                      <span className="text-xs text-warm-white/50">{product.rating} ({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-gold">${product.price}</span>
                      <Button variant="primary" size="sm">Add to Cart</Button>
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
