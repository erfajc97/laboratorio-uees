import axiosInstance from '../../../api/axios.config'
import { endpoints } from '../../../api/endpoints'
import type {
  CreateExperimentDto,
  ExperimentRun,
  MetricsLatency,
  MetricsLogsResponse,
  MetricsSummary,
  ThroughputPoint,
} from '../types/metrics.types'
import type {
  EconomicImpactDefaults,
  EconomicImpactInputs,
  EconomicImpactResult,
} from '../types/economic-impact.types'

// Helper para convertir datetime-local a ISO string
function convertToISO(dateString?: string): string | undefined {
  if (!dateString || dateString.trim() === '') {
    return undefined
  }
  // Si ya es ISO, retornarlo
  if (dateString.includes('T') && dateString.includes('Z')) {
    return dateString
  }
  // Si es datetime-local (YYYY-MM-DDTHH:mm), convertirlo a ISO
  if (dateString.includes('T') && !dateString.includes('Z')) {
    return new Date(dateString).toISOString()
  }
  // Si no tiene T, asumir que es solo fecha y agregar hora
  return new Date(dateString).toISOString()
}

// Helper para limpiar parámetros: remover valores vacíos y manejar "BOTH"
function cleanParams<T extends Record<string, any>>(params: T): Partial<T> {
  const cleaned: Partial<T> = {}
  for (const [key, value] of Object.entries(params)) {
    // Si el valor está vacío o es undefined, no incluirlo
    if (value === undefined || value === null || value === '') {
      continue
    }
    // Si el canal es "BOTH", no enviarlo (el backend mostrará ambos canales por defecto)
    if (key === 'channel' && value === 'BOTH') {
      continue
    }
    cleaned[key as keyof T] = value
  }
  return cleaned
}

export const metricsService = {
  async getSummary(params?: {
    from?: string
    to?: string
    channel?: string
    experimentRunId?: string
  }): Promise<MetricsSummary> {
    const cleanParamsObj = cleanParams({
      ...params,
      from: convertToISO(params?.from),
      to: convertToISO(params?.to),
    })
    const response = await axiosInstance.get(endpoints.metrics.summary, {
      params: cleanParamsObj,
    })
    return response.data
  },

  async getLogs(params?: {
    from?: string
    to?: string
    channel?: string
    status?: string
    q?: string
    page?: number
    pageSize?: number
    experimentRunId?: string
  }): Promise<MetricsLogsResponse> {
    const cleanParamsObj = cleanParams({
      ...params,
      from: convertToISO(params?.from),
      to: convertToISO(params?.to),
    })
    const response = await axiosInstance.get(endpoints.metrics.logs, {
      params: cleanParamsObj,
    })
    return response.data
  },

  async getLatency(params?: {
    from?: string
    to?: string
    channel?: string
    experimentRunId?: string
  }): Promise<MetricsLatency> {
    const cleanParamsObj = cleanParams({
      ...params,
      from: convertToISO(params?.from),
      to: convertToISO(params?.to),
    })
    const response = await axiosInstance.get(endpoints.metrics.latency, {
      params: cleanParamsObj,
    })
    return response.data
  },

  async getThroughput(
    experimentRunId: string,
  ): Promise<Array<ThroughputPoint>> {
    const response = await axiosInstance.get(endpoints.metrics.throughput, {
      params: { experimentRunId },
    })
    return response.data
  },

  async getExperiments(): Promise<Array<ExperimentRun>> {
    const response = await axiosInstance.get(endpoints.experiments.list)
    return response.data
  },

  async getExperiment(id: string): Promise<ExperimentRun> {
    const response = await axiosInstance.get(endpoints.experiments.getById(id))
    return response.data
  },

  async createExperiment(dto: CreateExperimentDto): Promise<ExperimentRun> {
    const response = await axiosInstance.post(endpoints.experiments.create, dto)
    return response.data
  },

  async runExperiment(
    id: string,
    dryRun?: boolean,
  ): Promise<{ message: string; id: string }> {
    const response = await axiosInstance.post(
      endpoints.experiments.run(id, dryRun),
    )
    return response.data
  },

  async exportExperiment(
    id: string,
    format: 'csv' | 'json' = 'json',
  ): Promise<Blob> {
    const response = await axiosInstance.get(
      endpoints.experiments.export(id, format),
      {
        responseType: 'blob',
      },
    )
    return response.data
  },

  async deleteExperiment(id: string): Promise<{ message: string; id: string }> {
    const response = await axiosInstance.delete(
      endpoints.experiments.delete(id),
    )
    return response.data
  },

  async getEconomicDefaults(): Promise<EconomicImpactDefaults> {
    const response = await axiosInstance.get(endpoints.metrics.economicDefaults)
    return response.data
  },

  async calculateEconomicImpact(
    inputs: EconomicImpactInputs,
  ): Promise<EconomicImpactResult> {
    const response = await axiosInstance.post(
      endpoints.metrics.economicCalculate,
      inputs,
    )
    return response.data
  },
}
