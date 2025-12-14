import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { metricsService } from '../services/metrics.service'

interface ExperimentDetailProps {
  experimentId: string
  onBack: () => void
}

export default function ExperimentDetail({
  experimentId,
  onBack,
}: ExperimentDetailProps) {
  const queryClient = useQueryClient()
  const [dryRun, setDryRun] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['experiment', experimentId],
    queryFn: () => metricsService.getExperiment(experimentId),
    refetchInterval: (query) => {
      const experiment = query.state.data as any
      // Poll cada 2 segundos si está RUNNING
      return experiment?.status === 'RUNNING' ? 2000 : false
    },
  })

  const runMutation = useMutation({
    mutationFn: (isDryRun: boolean) =>
      metricsService.runExperiment(experimentId, isDryRun),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['experiment', experimentId],
      })
    },
  })

  const exportMutation = useMutation({
    mutationFn: async (format: 'csv' | 'json') => {
      const blob = await metricsService.exportExperiment(experimentId, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `experiment-${experimentId}-${Date.now()}.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    },
  })

  if (isLoading) {
    return <div className="text-center py-8">Cargando experimento...</div>
  }

  if (error || !data) {
    return (
      <div className="text-center py-8 text-red-600">
        Error al cargar experimento
      </div>
    )
  }

  const isRunning = data.status === 'RUNNING'
  const summary = data.summaryJson as any

  const chartData =
    data.seriesPoints?.map((point) => ({
      tiempo: `${point.tOffsetSec}s`,
      enviados: point.sentCount,
      exitosos: point.successCount,
      fallidos: point.failCount,
      p95: point.p95LatencyMs,
    })) || []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={onBack}
            className="text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Volver a lista
          </button>
          <h2 className="text-2xl font-bold">{data.name}</h2>
          {data.description && (
            <p className="text-gray-600 mt-1">{data.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {data.status === 'CREATED' && (
            <>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(e) => setDryRun(e.target.checked)}
                />
                <span className="text-sm">Dry-Run</span>
              </label>
              <button
                onClick={() => runMutation.mutate(dryRun)}
                disabled={runMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 disabled:opacity-50"
              >
                {runMutation.isPending ? 'Iniciando...' : 'Ejecutar'}
              </button>
            </>
          )}
          <button
            onClick={() => exportMutation.mutate('json')}
            disabled={exportMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
          >
            Exportar JSON
          </button>
          <button
            onClick={() => exportMutation.mutate('csv')}
            disabled={exportMutation.isPending}
            className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 disabled:opacity-50"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <span className="font-semibold">Estado:</span>
          <span
            className={`px-3 py-1 text-sm font-medium ${
              isRunning
                ? 'bg-blue-100 text-blue-800'
                : data.status === 'DONE'
                  ? 'bg-green-100 text-green-800'
                  : data.status === 'FAILED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
            }`}
          >
            {data.status}
            {isRunning && ' (actualizando...)'}
          </span>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-md shadow">
            <div className="text-sm text-blue-600">Total Enviados</div>
            <div className="text-2xl font-bold">{summary.totalSent || 0}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-md shadow">
            <div className="text-sm text-green-600">Tasa de Éxito</div>
            <div className="text-2xl font-bold">
              {summary.successRate
                ? `${summary.successRate.toFixed(1)}%`
                : 'N/A'}
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-md shadow">
            <div className="text-sm text-purple-600">P95 Latencia</div>
            <div className="text-2xl font-bold">
              {summary.p95LatencyMs ? `${summary.p95LatencyMs}ms` : 'N/A'}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-md shadow">
            <div className="text-sm text-gray-600">Throughput</div>
            <div className="text-2xl font-bold">
              {summary.throughput
                ? `${summary.throughput.toFixed(2)} msg/s`
                : 'N/A'}
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Progreso del Experimento
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tiempo" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="enviados"
                  stroke="#3b82f6"
                  name="Enviados"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="exitosos"
                  stroke="#10b981"
                  name="Exitosos"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="fallidos"
                  stroke="#ef4444"
                  name="Fallidos"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">P95 Latencia</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tiempo" />
                <YAxis
                  label={{
                    value: 'Latencia (ms)',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="p95"
                  stroke="#8b5cf6"
                  name="P95 Latency"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}
