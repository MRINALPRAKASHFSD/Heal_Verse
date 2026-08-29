import { type NextRequest } from 'next/server';
import { createConversationsCollectionHandlers } from '@/lib/server/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return createConversationsCollectionHandlers().GET(request);
}

export async function POST(request: NextRequest) {
  return createConversationsCollectionHandlers().POST(request);
}