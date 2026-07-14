import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/services",
  "/courses",
  "/courses/(.*)",
  "/band",
  "/gallery",
  "/music",
  "/shop",
  "/blog",
  "/blog/(.*)",
  "/testimonials",
  "/contact",
  "/faq",
  "/book",
  "/payment/(.*)",
  "/api/payment/(.*)",
  "/api/contact",
  "/api/bookings",
  "/api/webhook(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
