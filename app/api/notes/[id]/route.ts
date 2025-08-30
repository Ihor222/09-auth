import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";
import { logErrorResponse } from "../../_utils/utils";

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function GET(_req: Request, { params }: RouteProps) {
  try {
    const cookieJar = await cookies();
    const { id } = await params;

    const response = await api.get(`/notes/${id}`, {
      headers: { Cookie: cookieJar.toString() },
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
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: RouteProps) {
  try {
    const cookieJar = await cookies();
    const { id } = await params;

    const response = await api.delete(`/notes/${id}`, {
      headers: { Cookie: cookieJar.toString() },
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
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(_req: Request, { params }: RouteProps) {
  try {
    const cookieJar = await cookies();
    const { id } = await params;
    const updateData = await _req.json();

    const response = await api.patch(`/notes/${id}`, updateData, {
      headers: { Cookie: cookieJar.toString() },
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
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
