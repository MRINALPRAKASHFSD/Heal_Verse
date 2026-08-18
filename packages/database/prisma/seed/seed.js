const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'maya.chen@healverse.test' },
    update: {},
    create: {
      displayName: 'Maya Chen',
      email: 'maya.chen@healverse.test',
      avatarUrl: null,
      preferences: {
        theme: 'system',
        language: {
          primary: 'en-US',
          fallback: ['en-GB'],
        },
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          textScale: 'medium',
          screenReaderOptimized: false,
        },
        notifications: {
          enabled: true,
          channels: ['in-app'],
          priority: 'normal',
        },
      },
    },
  });

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: 'Follow-up care review',
      type: 'follow_up',
      summary: {
        id: 'b1f2e14f-5b9d-4f7f-b6d4-0fa2f7f8e001',
        conversationId: 'b1f2e14f-5b9d-4f7f-b6d4-0fa2f7f8e000',
        title: 'Follow-up care review',
        type: 'follow-up',
        lastMessagePreview: 'Reviewing care instructions and reminders.',
        messageCount: 2,
        updatedAt: new Date().toISOString(),
      },
      preferences: {
        theme: 'system',
        language: 'en-US',
        sendWithEnter: true,
        compactMode: false,
        allowAttachments: true,
      },
      participantIds: [user.id],
      messageIds: [],
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        role: 'user',
        status: 'sent',
        content: 'I want to organize my follow-up care after my visit.',
      },
      {
        conversationId: conversation.id,
        role: 'assistant',
        status: 'sent',
        content: 'Start with your appointment date, prescribed medications, and any warning signs to watch for.',
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });