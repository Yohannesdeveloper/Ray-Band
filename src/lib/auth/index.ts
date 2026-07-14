import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export type UserRole = "customer" | "admin" | "instructor";

/**
 * Get the current Clerk user and sync to our database.
 * Creates a new User record if one doesn't exist.
 */
export async function getOrCreateUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const user = await db.user.upsert({
    where: { clerkId: clerkUser.id },
    create: {
      clerkId: clerkUser.id,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber,
      avatarUrl: clerkUser.imageUrl,
    },
    update: {
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      avatarUrl: clerkUser.imageUrl,
    },
  });

  return user;
}

/**
 * Get the current user's role from our database.
 */
export async function getUserRole(): Promise<UserRole> {
  const { userId } = await auth();
  if (!userId) return "customer";

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  return (user?.role as UserRole) ?? "customer";
}

/**
 * Check if the current user is an admin.
 */
export async function isAdmin(): Promise<boolean> {
  const role = await getUserRole();
  return role === "admin";
}

/**
 * Require authentication. Throws if not signed in.
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

/**
 * Require admin role. Throws if not admin.
 */
export async function requireAdmin() {
  const admin = await isAdmin();
  if (!admin) throw new Error("Forbidden: Admin access required");
  return true;
}
