import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy POST /api/file/extract to file service (POST /api/v1/receipts/extract).
 * Sends the file for full pipeline: OCR → classify → extract. Returns extraction JSON.
 */
const backendBase =
  process.env.NEXT_PUBLIC_FILE_API_URL || 'http://localhost:8005';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const language = (formData.get('language') as string) || 'fr';

    if (!file) {
      return NextResponse.json({ detail: 'File is required' }, { status: 400 });
    }

    const targetUrl = new URL('/api/v1/receipts/extract', backendBase);
    targetUrl.searchParams.set('language', language);

    const forwardForm = new FormData();
    forwardForm.append('file', file);

    const authHeader = req.headers.get('authorization') || 'Bearer dev_mock_token_local';

    let res: Response;
    try {
      res = await fetch(targetUrl.toString(), {
        method: 'POST',
        headers: {
          Authorization: authHeader,
        },
        body: forwardForm,
      });
    } catch (fetchError: unknown) {
      const message = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      return NextResponse.json(
        {
          detail: `Failed to connect to file service: ${message}`,
          error: 'CONNECTION_ERROR',
          backend_url: targetUrl.toString(),
        },
        { status: 500 },
      );
    }

    const text = await res.text();
    let data: unknown;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          detail: (data as { detail?: string })?.detail ?? 'Extraction failed',
          raw: data,
          backend_status: res.status,
        },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Extract proxy failed';
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}
