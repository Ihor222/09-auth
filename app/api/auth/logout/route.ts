import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { api } from "../../api";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

export async function POST() {
  const cookieJar = cookies();

  try {
    const access = (await cookieJar).get("accessToken")?.value;
    const refresh = (await cookieJar).get("refreshToken")?.value;

    if (!access || !refresh) {
      return NextResponse.json(
        { error: "Missing tokens" },
        { status: 400 }
      );
    }

    await api.post(
      "auth/logout",
      {},
      {
        headers: {
          Cookie: `accessToken=${access}; refreshToken=${refresh}`,
        },
      }
    );

    (await cookieJar).delete("accessToken");
    (await cookieJar).delete("refreshToken");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    if (isAxiosError(err)) {
      logErrorResponse(err.response?.data);
      return NextResponse.json(
        { error: err.message, details: err.response?.data },
        { status: err.response?.status ?? 500 }
      );
    }

    logErrorResponse({ message: (err as Error).message });
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
