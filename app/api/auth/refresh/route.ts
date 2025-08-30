import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { isAxiosError } from 'axios';
import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const refreshToken = (await cookieStore).get('refreshToken')?.value;
    const next = request.nextUrl.searchParams.get('next') || '/';

    if (refreshToken) {
      const cookieHeader = (await cookieStore).getAll().map(c => `${c.name}=${c.value}`).join('; ');

      const apiRes = await api.get('auth/session', {
        headers: { Cookie: cookieHeader },
      });

      const setCookie = apiRes.headers['set-cookie'];
      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        let accessToken = '';
        let newRefreshToken = '';

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          if (parsed.accessToken) accessToken = parsed.accessToken;
          if (parsed.refreshToken) newRefreshToken = parsed.refreshToken;
        }

        const response = NextResponse.redirect(new URL(next, request.url));
        if (accessToken) response.cookies.set('accessToken', accessToken, { httpOnly: true, path: '/' });
        if (newRefreshToken) response.cookies.set('refreshToken', newRefreshToken, { httpOnly: true, path: '/' });
        return response;
      }
    }

    return NextResponse.redirect(new URL('/sign-in', request.url));
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
