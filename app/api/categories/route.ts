import { NextResponse } from "next/server";
import type { RoutineUnit, StatName } from "@/lib/domain";
import { jsonError } from "@/lib/api-response";
import { addCategory, listCategories, StoreError } from "@/lib/store/memory";

const STATS: StatName[] = ["vitality", "intelligence", "focus", "social"];
const UNITS: RoutineUnit[] = ["minutes", "count"];

export async function GET() {
  return NextResponse.json({ categories: listCategories() });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!STATS.includes(body.mappedStat) || !UNITS.includes(body.unit)) {
      throw new StoreError("카테고리 설정이 올바르지 않습니다.", 400);
    }

    return NextResponse.json(
      {
        category: addCategory({
          name: body.name,
          emoji: body.emoji ?? "",
          mappedStat: body.mappedStat,
          unit: body.unit,
        }),
      },
      { status: 201 },
    );
  } catch (error) {
    return jsonError(error);
  }
}
