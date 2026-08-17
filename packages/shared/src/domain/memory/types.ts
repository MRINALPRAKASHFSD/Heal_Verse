import type { ISODateString, UUID } from '../../types';

export type MemoryScope = 'conversation' | 'user' | 'workspace';
export type MemoryType = 'fact' | 'preference' | 'summary' | 'safety-note';

export interface MemoryItem {
  readonly id: UUID;
  readonly scope: MemoryScope;
  readonly type: MemoryType;
  readonly content: string;
  readonly sourceId?: UUID;
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

export interface MemorySummary {
  readonly id: UUID;
  readonly scope: MemoryScope;
  readonly itemCount: number;
  readonly lastUpdatedAt: ISODateString;
}