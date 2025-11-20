import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Usuario hardcodeado
const HARDCODED_USER = {
  email: "admin@example.com",
  password: "admin123",
};

export async function login(email: string, password: string): Promise<boolean> {
  if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
    const cookieStore = await cookies();
    cookieStore.set("auth-token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");
  return token?.value === "authenticated";
}

export async function requireAuth() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/login");
  }
}

