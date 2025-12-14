const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const endpoints = {
  juicios: {
    list: `${API_BASE_URL}/juicios`,
    create: `${API_BASE_URL}/juicios`,
    getById: (id: string) => `${API_BASE_URL}/juicios/${id}`,
    update: (id: string) => `${API_BASE_URL}/juicios/${id}`,
    delete: (id: string) => `${API_BASE_URL}/juicios/${id}`,
    addParticipante: (id: string) =>
      `${API_BASE_URL}/juicios/${id}/participantes`,
    removeParticipante: (id: string, participanteId: string) =>
      `${API_BASE_URL}/juicios/${id}/participantes/${participanteId}`,
  },
  participantes: {
    list: `${API_BASE_URL}/participantes`,
    create: `${API_BASE_URL}/participantes`,
    getById: (id: string) => `${API_BASE_URL}/participantes/${id}`,
    update: (id: string) => `${API_BASE_URL}/participantes/${id}`,
    delete: (id: string) => `${API_BASE_URL}/participantes/${id}`,
  },
  telegram: {
    register: `${API_BASE_URL}/telegram/register`,
  },
  auditoria: {
    list: `${API_BASE_URL}/auditoria`,
    getById: (id: string) => `${API_BASE_URL}/auditoria/${id}`,
    marcarResuelto: (id: string) => `${API_BASE_URL}/auditoria/${id}/resolver`,
    estadisticas: `${API_BASE_URL}/auditoria/estadisticas`,
  },
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
  },
} as const
