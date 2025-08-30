import { NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST() {
  try {
    const cookiesData = await cookies();

    const accessToken = cookiesData.get('accessToken')?.value;
    const refreshToken = cookiesData.get('refreshToken')?.value;

    await api.post('/auth/logout', {}, {
      headers: {
        Cookie: `accessToken=${accessToken}; refreshToken=${refreshToken}`,
      },
    });

    // спочатку чистимо refreshToken, потім accessToken
    cookiesData.delete('refreshToken');
    cookiesData.delete('accessToken');

    return NextResponse.json({ message: 'Successfully logged out' }, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, details: error.response?.data },
        { status: error.response?.status ?? 400 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: 'Unexpected server error' },
      { status: 500 }
    );
  }
}
