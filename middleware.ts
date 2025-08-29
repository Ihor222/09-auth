import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "cookie";
import { serverApi } from "./lib/api/serverApi";

const PRIVATE_ROUTES = ["/profile"];
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const { pathname } = req.nextUrl;

  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));

  if (isPrivateRoute) {
    if (!accessToken) {
      if (refreshToken) {
        try {
          const session = await serverApi.checkServerSession();
          const setCookie = session.headers["set-cookie"];
          if (setCookie) {
            const cookiesArray = Array.isArray(setCookie) ? setCookie : [setCookie];
            cookiesArray.forEach((cookieStr) => {
              const parsed = parse(cookieStr);
              const options = {
                path: parsed.Path,
                maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
                expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
              };
              if (parsed.accessToken) cookieStore.set("accessToken", parsed.accessToken, options);
              if (parsed.refreshToken) cookieStore.set("refreshToken", parsed.refreshToken, options);
            });

            return NextResponse.next({
              headers: { Cookie: cookieStore.toString() },
            });
          }
        } catch {
          return NextResponse.redirect(new URL("/sign-in", req.url));
        }
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
    return NextResponse.next();
  }

  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/sign-in", "/sign-up"],
};
