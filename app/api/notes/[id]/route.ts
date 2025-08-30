import { cookies } from "next/headers";
import { api } from "../../api";
import { NextResponse } from "next/server";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

type Props = {
  params: Promise<{ id: string }>;
};

async function withErrorHandler<T>(fn: () => Promise<T>) {
  try {
    return await fn();
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: Props) {
  return withErrorHandler(async () => {
    const cookieStore = await cookies();
    const { id } = await params;

    const res = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  });
}

export async function DELETE(request: Request, { params }: Props) {
  return withErrorHandler(async () => {
    const cookieStore = await cookies();
    const { id } = await params;

    const res = await api.delete(`/notes/${id}`, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  });
}

export async function PATCH(request: Request, { params }: Props) {
  return withErrorHandler(async () => {
    const cookieStore = await cookies();
    const { id } = await params;
    const body = await request.json();

    const res = await api.patch(`/notes/${id}`, body, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  });
}
