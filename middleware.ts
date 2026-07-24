// Protects the admin area. Unauthenticated users are redirected to /admin/login
// (configured as the signIn page in lib/auth.ts). The login route itself is excluded.
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin", "/admin/((?!login).*)"],
};
