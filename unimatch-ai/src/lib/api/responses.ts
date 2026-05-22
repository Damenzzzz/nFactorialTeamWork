import { NextResponse } from "next/server";
import type { ApiResponse } from "@/lib/domain";

export function jsonOk<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(
  error: string,
  status = 400,
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ ok: false, error }, { status });
}
