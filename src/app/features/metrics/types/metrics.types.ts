export enum NotificationChannel {
  EMAIL = 'EMAIL',
  TELEGRAM = 'TELEGRAM',
  BOTH = 'BOTH',
}

export enum MetricStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  ACKED = 'ACKED',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export enum ExperimentScenario {
  LATENCY = 'LATENCY',
  THROUGHPUT = 'THROUGHPUT',
  ERROR_INJECTION = 'ERROR_INJECTION',
}

export enum ExperimentStatus {
  CREATED = 'CREATED',
  RUNNING = 'RUNNING',
  DONE = 'DONE',
  FAILED = 'FAILED',
}

export interface MetricsSummary {
  totalSent: number
  totalDelivered: number
  totalFailed: number
  successRate: number
  p50LatencyMs: number | null
  p95LatencyMs: number | null
  p99LatencyMs: number | null
  avgLatencyMs: number | null
  byChannel: Array<{
    channel: NotificationChannel
    totalSent: number
    totalDelivered: number
    totalFailed: number
    successRate: number
    p95LatencyMs: number | null
  }>
}

export interface MetricsLog {
  id: string
  channel: NotificationChannel
  template: string | null
  recipientHash: string
  correlationId: string
  status: MetricStatus
  sentAt: string
  providerAckAt: string | null
  deliveredAt: string | null
  latencyMs: number | null
  errorCode: string | null
  errorMessage: string | null
  retryCount: number
  experimentRunId: string | null
  createdAt: string
  updatedAt: string
}

export interface MetricsLogsResponse {
  data: MetricsLog[]
  total: number
  page: number
  pageSize: number
}

export interface LatencySeriesPoint {
  timestamp: Date
  p50: number | null
  p95: number | null
  p99: number | null
  avg: number | null
}

export interface MetricsLatency {
  series: LatencySeriesPoint[]
  seriesByChannel?: Array<{
    timestamp: string
    channel: NotificationChannel
    p95: number | null
  }>
  overall: {
    p50: number | null
    p95: number | null
    p99: number | null
    avg: number | null
  }
  byChannel: Array<{
    channel: NotificationChannel
    p50: number | null
    p95: number | null
    p99: number | null
    avg: number | null
  }>
}

export interface ThroughputPoint {
  tOffsetSec: number
  sentCount: number
  successCount: number
  failCount: number
  throughput: number
}

export interface ExperimentRun {
  id: string
  name: string
  description: string | null
  scenario: ExperimentScenario
  channelTarget: NotificationChannel
  totalMessages: number
  concurrency: number
  ratePerSec: number | null
  startedAt: string | null
  finishedAt: string | null
  status: ExperimentStatus
  summaryJson: Record<string, unknown> | null
  createdBy: string | null
  createdAt: string
  seriesPoints?: Array<{
    id: string
    tOffsetSec: number
    sentCount: number
    successCount: number
    failCount: number
    p95LatencyMs: number | null
    createdAt: string
  }>
  _count?: {
    metricEvents: number
    seriesPoints: number
  }
}

export interface CreateExperimentDto {
  name: string
  description?: string
  scenario: ExperimentScenario
  channelTarget: NotificationChannel
  totalMessages: number
  concurrency: number
  ratePerSec?: number
  dryRun?: boolean
  createdBy?: string
}

