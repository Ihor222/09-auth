import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parse as parseCookie } from "cookie";
import { isAxiosError } from "axios";
import { api } from "../../api";
import { logErrorResponse } from "../../_utils/utils";

export async function POST(request: NextRequest) {
  try {
    // Отримуємо тіло запиту
    const credentials = await request.json();

    // Відправляємо на бекенд
    const response = await api.post("/auth/login", credentials);

    // Дістаємо кукі з відповіді
    const rawCookies = response.headers["set-cookie"];
    const cookieJar = cookies();

    if (rawCookies) {
      const list = Array.isArray(rawCookies) ? rawCookies : [rawCookies];

      list.forEach(async (cookieStr) => {
        const parsedCookie = parseCookie(cookieStr);

        const cookieOptions = {
          expires: parsedCookie.Expires ? new Date(parsedCookie.Expires) : undefined,
          path: parsedCookie.Path,
          maxAge: parsedCookie["Max-Age"] ? Number(parsedCookie["Max-Age"]) : undefined,
        };

        if (parsedCookie.accessToken) {
          (await cookieJar).set("accessToken", parsedCookie.accessToken, cookieOptions);
        }
        if (parsedCookie.refreshToken) {
          (await cookieJar).set("refreshToken", parsedCookie.refreshToken, cookieOptions);
        }
      });

      return NextResponse.json(response.data, { status: response.status });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (err) {
    if (isAxiosError(err)) {
      logErrorResponse(err.response?.data);
      return NextResponse.json(
        { error: err.message, details: err.response?.data },
        { status: err.response?.status ?? 500 }
      );
    }

    logErrorResponse({ message: (err as Error).message });
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
