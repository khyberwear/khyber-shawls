export const runtime = 'edge';
// app/api/debug/images/route.ts
import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const files = await readdir(uploadsDir);
    
    const fileList = files
      .filter(f => f !== '.gitkeep')
      .sort()
      .reverse()
      .slice(0, 50); // Last 50 files

    return NextResponse.json({
      success: true,
      totalFiles: files.length - 1, // Exclude .gitkeep
      files: fileList.map(f => ({
        name: f,
        url: `/uploads/${f}`,
        fullUrl: `https://khybershawls.store/uploads/${f}`
      }))
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
