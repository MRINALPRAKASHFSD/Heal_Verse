import { NextResponse, type NextRequest } from 'next/server';
import { getServerAuthAdapter } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authAdapter = getServerAuthAdapter();
  const sessionPayload = await authAdapter.getSession(request.headers);

  if (!sessionPayload) {
    return NextResponse.json(
      {
        error: {
          code: 'unauthorized',
          message: 'Not authenticated',
        },
      },
      { status: 401 },
    );
  }

  return NextResponse.json({
    user: sessionPayload.user,
    session: sessionPayload.session,
  });
}
