// app/api/getGlbFiles/route.ts

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const glbDir = path.join(process.cwd(), 'public', 'assets', '3d');

  try {
    const files = await fs.promises.readdir(glbDir);
    const glbFiles = files.filter(file => file.endsWith('.glb'));
    return NextResponse.json({ files: glbFiles });
  } catch (err) {
    return NextResponse.json({ message: 'Error reading directory' }, { status: 500 });
  }
}
