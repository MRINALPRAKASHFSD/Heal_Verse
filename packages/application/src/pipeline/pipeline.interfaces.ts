export interface PipelineStep<Input, Output> {
  readonly name: string;
  execute(input: Input): Promise<Output>;
}

export interface PipelineContext {
  readonly requestId: string;
  readonly actorId?: string;
  readonly traceId?: string;
}

export interface Pipeline<Input, Output> {
  readonly name: string;
  readonly steps: readonly PipelineStep<unknown, unknown>[];
  execute(input: Input, context: PipelineContext): Promise<Output>;
}

export interface ChatPipeline<Input, Output> extends Pipeline<Input, Output> {
  readonly name: 'chat';
}

export interface MedicalPipeline<Input, Output> extends Pipeline<Input, Output> {
  readonly name: 'medical';
}

export interface TranslationPipeline<Input, Output> extends Pipeline<Input, Output> {
  readonly name: 'translation';
}

export interface SafetyPipeline<Input, Output> extends Pipeline<Input, Output> {
  readonly name: 'safety';
}

export interface MemoryPipeline<Input, Output> extends Pipeline<Input, Output> {
  readonly name: 'memory';
}