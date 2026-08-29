import { type NextRequest } from 'next/server';
import { createConversationItemHandlers } from '@/lib/server/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return createConversationItemHandlers().GET(request, { params: context.params.then((params) => ({ conversationId: params.id })) });
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return createConversationItemHandlers().PATCH(request, { params: context.params.then((params) => ({ conversationId: params.id })) });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  return createConversationItemHandlers().DELETE(request, { params: context.params.then((params) => ({ conversationId: params.id })) });
}