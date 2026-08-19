export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export interface Command<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export interface Query<Input, Output> {
  execute(input: Input): Promise<Output>;
}

export interface ApplicationContext {
  readonly requestId: string;
  readonly correlationId?: string;
  readonly actorId?: string;
}

export interface PagedResult<T> {
  readonly items: T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
}