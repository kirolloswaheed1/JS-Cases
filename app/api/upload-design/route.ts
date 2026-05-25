import { NextRequest, NextResponse } from 'next/server';
import { getStorage } from '@/lib/storage';

/**
 * POST /api/upload-design
 *
 * Body (JSON):
 *   {
 *     designId: string,
 *     previewDataUrl: string,   // data:image/png;base64,...
 *     printDataUrl:   string,
 *     designJson:     object
 *   }
 *
 * Response:
 *   {
 *     designId: string,
 *     previewUrl: string,
 *     printFileUrl: string,
 *     designJsonUrl: string
 *   }
 */

export const runtime = 'nodejs';
// Print PNGs are large (multi-MB at high res). Bump the body size cap.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { designId, previewDataUrl, printDataUrl, designJson } = body ?? {};

    if (!designId || !previewDataUrl || !printDataUrl || !designJson) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const storage = getStorage();
    const [preview, print, json] = await Promise.all([
      storage.uploadPng(`${designId}/preview.png`, previewDataUrl),
      storage.uploadPng(`${designId}/print.png`, printDataUrl),
      storage.uploadJson(`${designId}/design.json`, designJson),
    ]);

    return NextResponse.json({
      designId,
      previewUrl: preview.url,
      printFileUrl: print.url,
      designJsonUrl: json.url,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
