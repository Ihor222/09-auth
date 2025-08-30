export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';

import { api } from '../../api';
import { logErrorResponse } from '../../_utils/utils';

// ================= GET =================
export async function GET() {
  const cookieStore = await cookies();

  try {
    const response = await api.get('/users/me', {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err) {
    if (isAxiosError(err)) {
      logErrorResponse(err.response?.data);
      return NextResponse.json(
        { error: err.message, response: err.response?.data },
        { status: err.status }
      );
    }

    logErrorResponse({ message: (err as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// ================= PATCH =================
export async function PATCH(req: Request) {
  const cookieStore = await cookies();

  try {
    const payload = await req.json();

    const response = await api.patch('/users/me', payload, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err) {
    if (isAxiosError(err)) {
      logErrorResponse(err.response?.data);
      return NextResponse.json(
        { error: err.message, response: err.response?.data },
        { status: err.status }
      );
    }

    logErrorResponse({ message: (err as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
