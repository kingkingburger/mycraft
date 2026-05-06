import { NextResponse } from "next/server";
import { StoreError } from "@/lib/store/memory";

export function jsonError(error: unknown) {
  if (error instanceof StoreError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  console.error(error);
  return NextResponse.json({ error: "internal server error" }, { status: 500 });
}
