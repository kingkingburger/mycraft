import { NextResponse } from "next/server";
import { getState } from "@/lib/store/memory";
import { todayDateKey } from "@/lib/timezone";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? todayDateKey();
  return NextResponse.json(getState(date));
}
