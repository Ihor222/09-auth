import { NextRequest, NextResponse } from 'next/server';
import { api } from '../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../_utils/utils';

export async function GET(req: NextRequest) {
  try {
    const cookieJar = await cookies();

    const query = req.nextUrl.searchParams;
    const searchValue = query.get('search') || '';
    const currentPage = Number(query.get('page') || 1);
    const tagParam = query.get('tag') || '';
    const tag = tagParam === 'All' ? '' : tagParam;

    const response = await api('/notes', {
      params: {
        ...(searchValue && { search: searchValue }),
        page: currentPage,
        perPage: 12,
        ...(tag && { tag }),
      },
      headers: {
        Cookie: cookieJar.toString(),
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err) {
    if (isAxiosError(err)) {
      logErrorResponse(err.response?.data);
      return NextResponse.json(
        { error: err.message, details: err.response?.data },
        { status: err.status }
      );
    }
    logErrorResponse({ message: (err as Error).message });
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieJar = await cookies();
    const body = await req.json();

    const response = await api.post('/notes', body, {
      headers: {
        Cookie: cookieJar.toString(),
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (err) {
    if (isAxiosError(err)) {
      logErrorResponse(err.response?.data);
      return NextResponse.json(
        { error: err.message, details: err.response?.data },
        { status: err.status }
      );
    }
    logErrorResponse({ message: (err as Error).message });
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
