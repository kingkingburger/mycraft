import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { createLog, listLogs, StoreError } from "@/lib/store/memory";
import { todayDateKey } from "@/lib/timezone";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? todayDateKey();
  return NextResponse.json(listLogs(date));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.categoryId || !body.logDate) {
      throw new StoreError("categoryId와 logDate가 필요합니다.", 400);
    }

    return NextResponse.json(
      createLog({
        categoryId: body.categoryId,
        logDate: body.logDate,
        value: body.value ?? null,
        note: body.note ?? null,
      }),
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error);
  }
}
