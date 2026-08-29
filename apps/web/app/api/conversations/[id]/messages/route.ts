import { type NextRequest } from 'next/server';
import { createConversationMessagesHandlers } from '@/lib/server/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return createConversationMessagesHandlers().GET(request, { params: context.params.then((params) => ({ conversationId: params.id })) });
}

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return createConversationMessagesHandlers().POST(request, { params: context.params.then((params) => ({ conversationId: params.id })) });
}