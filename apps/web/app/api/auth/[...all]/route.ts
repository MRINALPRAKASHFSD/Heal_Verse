import { type NextRequest } from 'next/server';
import { getServerAuth } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = getServerAuth();
  return auth.handler(request);
}

export async function POST(request: NextRequest) {
  const auth = getServerAuth();
  return auth.handler(request);
}
