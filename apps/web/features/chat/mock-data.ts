export type ChatGroupName = 'Today' | 'Yesterday' | 'Older';

export type ChatSession = {
  title: string;
  summary: string;
  time: string;
  group: ChatGroupName;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
};

export const recentChats: ChatSession[] = [
  {
    title: 'Medication routine review',
    summary: 'Morning schedule and adherence prompts.',
    time: '2m ago',
    group: 'Today',
  },
  {
    title: 'Post-visit follow-up plan',
    summary: 'Recovery tracking and next steps.',
    time: '1h ago',
    group: 'Today',
  },
  {
    title: 'Preventive screening checklist',
    summary: 'Annual wellness recommendations.',
    time: 'Yesterday',
    group: 'Yesterday',
  },
  {
    title: 'Family care timeline',
    summary: 'Shared reminders and appointments.',
    time: '3d ago',
    group: 'Older',
  },
];

export const suggestedQuestions = [
  'How can I prepare for a routine checkup?',
  'What questions should I ask after a new prescription?',
  'How do I organize medication reminders safely?',
];

export const mockMessages: ChatMessage[] = [
  {
    id: 'm1',
    role: 'user',
    content: 'I want to organize my follow-up care after a specialist appointment.',
    timestamp: '09:14',
  },
  {
    id: 'm2',
    role: 'assistant',
    content:
      'I can help structure the next steps into appointments, medications, symptom tracking, and reminders. Start with the date of your visit and any instructions you received.',
    timestamp: '09:14',
  },
  {
    id: 'm3',
    role: 'assistant',
    content: 'Loading care summary...',
    timestamp: '09:15',
    isStreaming: true,
  },
];

export const mockChatSession = {
  title: 'Post-visit care assistant',
  subtitle: 'Calm, structured support for care planning.',
  messages: mockMessages,
};