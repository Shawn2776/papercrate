import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/api/webhooks/(.*)",
  "/new-user(.*)", // ✅ Onboarding steps are public
]);

const SUPERADMIN_ID = process.env.SUPERADMIN_ID;

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // 🔐 Restrict /admin to superadmin
  if (pathname.startsWith("/admin") && userId !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  // 🚪 Block unauthenticated users from protected routes
  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return Response.redirect(signInUrl.toString());
  }

  // ✅ All good — continue
  return;
});

export const config = {
  matcher: [
    // Match all application and API routes except static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
