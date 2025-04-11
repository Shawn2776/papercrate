import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/api/webhooks/(.*)",
]);

const SUPERADMIN_ID = process.env.SUPERADMIN_ID; // Replace with your Clerk userId

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const pathname = req.nextUrl.pathname;

  // 🔐 Restrict /admin to superadmin only
  if (pathname.startsWith("/admin") && userId !== SUPERADMIN_ID) {
    return new Response("Unauthorized", { status: 403 });
  }

  // 🔐 If the route is not public and no user is signed in, redirect to sign-in
  if (!isPublicRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url); // Optional: redirect back after sign-in
    return Response.redirect(signInUrl.toString());
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
