export const runtime = 'edge';
import { NextResponse } from "next/server"

import { fetchProductSummariesByIds } from "@/lib/products"

export async function POST(request: Request) {
  const { ids } = (await request.json().catch(() => ({ ids: [] }))) as {
    ids?: string[]
  }

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ products: [] })
  }

  const products = await fetchProductSummariesByIds(ids)

  return NextResponse.json({ products })
}
