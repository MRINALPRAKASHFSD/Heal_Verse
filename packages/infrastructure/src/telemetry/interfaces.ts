export interface TelemetryLogger {
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>): void;
}

export interface MetricsCollector {
  increment(metric: string, value?: number, tags?: Record<string, string>): void;
  gauge(metric: string, value: number, tags?: Record<string, string>): void;
  timing(metric: string, milliseconds: number, tags?: Record<string, string>): void;
}

export interface Tracer {
  startSpan(name: string, attributes?: Record<string, unknown>): TelemetrySpan;
}

export interface TelemetrySpan {
  end(): void;
  recordException(error: Error): void;
  setAttribute(key: string, value: string | number | boolean): void;
}

export interface MonitoringService {
  notifyIncident(name: string, details?: Record<string, unknown>): void;
}