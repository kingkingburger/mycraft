import { NextResponse } from "next/server";
import { jsonError } from "@/lib/api-response";
import { deleteLog } from "@/lib/store/memory";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    return NextResponse.json(deleteLog(id));
  } catch (error) {
    return jsonError(error);
  }
}
