const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const endpoints = {
  metrics: {
    summary: `${API_BASE_URL}/metrics/summary`,
    logs: `${API_BASE_URL}/metrics/logs`,
    latency: `${API_BASE_URL}/metrics/latency`,
    throughput: `${API_BASE_URL}/metrics/throughput`,
    economicDefaults: `${API_BASE_URL}/metrics/economic/defaults`,
    economicCalculate: `${API_BASE_URL}/metrics/economic/calculate`,
  },
  experiments: {
    list: `${API_BASE_URL}/experiments`,
    create: `${API_BASE_URL}/experiments`,
    getById: (id: string) => `${API_BASE_URL}/experiments/${id}`,
    run: (id: string, dryRun?: boolean) =>
      `${API_BASE_URL}/experiments/${id}/run${dryRun ? '?dryRun=true' : ''}`,
    export: (id: string, format: 'csv' | 'json' = 'json') =>
      `${API_BASE_URL}/experiments/${id}/export?format=${format}`,
    delete: (id: string) => `${API_BASE_URL}/experiments/${id}`,
  },
} as const
