import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ receiptId: string }> },
) {
  try {
    const { receiptId } = await params;
    if (!receiptId) {
      return NextResponse.json({ detail: 'receiptId is required' }, { status: 400 });
    }

    const backendBase = process.env.NEXT_PUBLIC_FILE_API_URL || 'http://localhost:8005';
    const targetUrl = `${backendBase}/api/v1/receipts/${receiptId}/corrections`;
    const body = await req.json().catch(() => ({}));

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer dev_mock_token_local',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit corrections';
    return NextResponse.json({ detail: message }, { status: 500 });
  }
}

