import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const PRIVATE_ROUTES = ["/profile", "/notes"];
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(request: NextRequest) {
  const { pathname, origin, search } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  if (isPrivate) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      const nextPath = encodeURIComponent(pathname + (search ?? ""));
      const refreshUrl = new URL(`/api/auth/refresh?next=${nextPath}`, origin);
      return NextResponse.redirect(refreshUrl);
    }

    return NextResponse.redirect(new URL("/sign-in", origin));
  }

  if (isPublic) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/profile", origin));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
