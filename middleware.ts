import { NextRequest, NextResponse } from "next/server";
import { NextURL } from "next/dist/server/web/next-url";
const protectedRoutes = ["/edit", "/profile", "/create", "/withdraw"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const token = req.cookies.get("access_token");
  const isProfile = req.nextUrl.pathname.startsWith("/profile");
  const isWithdral = req.nextUrl.pathname.startsWith("/withdraw");

  const isSecured = isProtectedRoute || isProfile || isWithdral;

  const url = req.nextUrl.clone(); // Clone the URL to modify it

  const redirectResponse = (url: string | NextURL) => {
    const response = NextResponse.redirect(url);
    return response;
  };

  if (!token && isSecured) {
    url.pathname = "/";
    url.search = "?login=true";

    return redirectResponse(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/edit",
    "/profile",
    "/profile/:path*",
    "/create",
    "/withdraw",
    "/withdraw/:path*",
  ],
};
