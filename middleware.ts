import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/api/webhooks",
    "/question/:id*",
    "/tags",
    "/profile/:id*",
    "/tags/:id*",
    "/community",
  ],
  ignoredRoutes: ["/api/webhooks", "api/chatgpt"],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};