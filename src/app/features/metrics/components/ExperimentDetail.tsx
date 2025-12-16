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
import { DeleteExperimentModal } from './DeleteExperimentModal'
import { ToastResponse } from '@/components/ToastResponse'

interface ExperimentDetailProps {
  experimentId: string
  onBack: () => void
  onDelete?: () => void
}

export default function ExperimentDetail({
  experimentId,
  onBack,
  onDelete,
}: ExperimentDetailProps) {
  const queryClient = useQueryClient()
  const [dryRun, setDryRun] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['experiment', experimentId],
    queryFn: () => metricsService.getExperiment(experimentId),
    refetchInterval: (query) => {
      const experiment = query.state.data as any
      // Poll cada 2 segundos si está RUNNING
      return experiment?.status === 'RUNNING' ? 2000 : false
    },
  })

  // Obtener métricas detalladas de latencia para gráficas comparativas
  const { data: latencyData, isLoading: latencyLoading } = useQuery({
    queryKey: ['metrics', 'latency', experimentId],
    queryFn: () =>
      metricsService.getLatency({
        experimentRunId: experimentId,
      }),
    enabled: !!data && data.status !== 'CREATED', // Solo cargar si el experimento ha sido ejecutado
    refetchInterval: () => {
      // Poll cada 2 segundos si el experimento está RUNNING
      return data?.status === 'RUNNING' ? 2000 : false
    },
  })

  const runMutation = useMutation({
    mutationFn: (isDryRun: boolean) =>
      metricsService.runExperiment(experimentId, isDryRun),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['experiment', experimentId],
      })
      void queryClient.invalidateQueries({
        queryKey: ['metrics', 'latency', experimentId],
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

  const repeatMutation = useMutation({
    mutationFn: async ({
      isDryRun,
      experimentData,
    }: {
      isDryRun: boolean
      experimentData: NonNullable<typeof data>
    }) => {
      // Crear un nuevo experimento con los mismos valores
      const newExperiment = await metricsService.createExperiment({
        name: `${experimentData.name} (Repetición)`,
        description: experimentData.description || undefined,
        scenario: experimentData.scenario as any,
        channelTarget: experimentData.channelTarget as any,
        totalMessages: experimentData.totalMessages,
        concurrency: experimentData.concurrency,
        ratePerSec: experimentData.ratePerSec || undefined,
        createdBy: experimentData.createdBy || undefined,
      })
      // Ejecutar el nuevo experimento inmediatamente
      await metricsService.runExperiment(newExperiment.id, isDryRun)
      return newExperiment
    },
    onSuccess: (newExperiment) => {
      void queryClient.invalidateQueries({ queryKey: ['experiments'] })
      // Navegar al nuevo experimento
      window.location.href = `#experiment-${newExperiment.id}`
      // O simplemente refrescar la lista
      void queryClient.invalidateQueries({ queryKey: ['experiment'] })
      ToastResponse('Experimento repetido exitosamente', 'success')
    },
    onError: (repeatError) => {
      console.error('Error al repetir experimento:', repeatError)
      let errorMessage =
        'Error al repetir el experimento. Por favor, intente nuevamente.'

      if (repeatError instanceof Error) {
        errorMessage = repeatError.message
      } else {
        const axiosError = repeatError as any
        if (axiosError?.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        } else if (axiosError?.response?.statusText) {
          errorMessage = `${axiosError.response.status} - ${axiosError.response.statusText}`
        } else if (axiosError?.message) {
          errorMessage = axiosError.message
        }
      }

      ToastResponse(errorMessage, 'error')
    },
  })

  const handleDelete = () => {
    if (!data) return
    setIsDeleteModalOpen(true)
  }

  const handleDeleteSuccess = () => {
    if (onDelete) {
      onDelete()
    } else {
      onBack()
    }
  }

  const handleRepeat = () => {
    if (!data) return
    repeatMutation.mutate({ isDryRun: false, experimentData: data })
  }

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
          {data.status !== 'RUNNING' && (
            <>
              <button
                onClick={handleRepeat}
                disabled={repeatMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 disabled:opacity-50"
                title="Crear y ejecutar una copia de este experimento"
              >
                {repeatMutation.isPending
                  ? 'Repitiendo...'
                  : 'Repetir Experimento'}
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700 disabled:opacity-50"
                title="Eliminar este experimento"
              >
                Eliminar
              </button>
            </>
          )}
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

          {/* Gráfica de Latencia - Simple para un solo canal o Comparativa para BOTH */}
          {!latencyLoading && latencyData && (
            <>
              {data.channelTarget === 'BOTH' &&
              latencyData.seriesByChannel &&
              latencyData.seriesByChannel.length > 0 ? (
                // Gráfica comparativa EMAIL vs TELEGRAM cuando es BOTH
                (() => {
                  const emailChannel = latencyData.byChannel.find(
                    (ch) => ch.channel === 'EMAIL',
                  )
                  const telegramChannel = latencyData.byChannel.find(
                    (ch) => ch.channel === 'TELEGRAM',
                  )
                  const hasBothChannels = emailChannel && telegramChannel

                  if (!hasBothChannels) return null

                  // Agrupar seriesByChannel por timestamp y canal
                  const comparisonMap = new Map<
                    string,
                    { email: number | null; telegram: number | null }
                  >()

                  latencyData.seriesByChannel.forEach((point) => {
                    const timestamp = new Date(
                      point.timestamp,
                    ).toLocaleTimeString()
                    if (!comparisonMap.has(timestamp)) {
                      comparisonMap.set(timestamp, {
                        email: null,
                        telegram: null,
                      })
                    }
                    const entry = comparisonMap.get(timestamp)
                    if (entry) {
                      if (point.channel === 'EMAIL') {
                        entry.email = point.p95
                      } else if (point.channel === 'TELEGRAM') {
                        entry.telegram = point.p95
                      }
                    }
                  })

                  const comparisonData = Array.from(
                    comparisonMap.entries(),
                  ).map(([timestamp, values]) => ({
                    timestamp,
                    email: values.email,
                    telegram: values.telegram,
                  }))

                  if (comparisonData.length > 0) {
                    return (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">
                          Comparación EMAIL vs TELEGRAM (P95 Latencia)
                        </h3>
                        <ResponsiveContainer width="100%" height={400}>
                          <LineChart data={comparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="timestamp" />
                            <YAxis
                              label={{
                                value: 'Latencia P95 (ms)',
                                angle: -90,
                                position: 'insideLeft',
                              }}
                            />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="email"
                              stroke="#6b7280"
                              name="EMAIL"
                              strokeWidth={3}
                              dot={{ r: 4 }}
                              connectNulls={true}
                            />
                            <Line
                              type="monotone"
                              dataKey="telegram"
                              stroke="#3b82f6"
                              name="TELEGRAM"
                              strokeWidth={3}
                              dot={{ r: 4 }}
                              connectNulls={true}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                        {telegramChannel.p95 &&
                          emailChannel.p95 &&
                          telegramChannel.p95 < emailChannel.p95 && (
                            <div className="mt-2 text-sm text-green-600 font-medium">
                              ✅ Telegram es{' '}
                              {Math.round(
                                emailChannel.p95 - telegramChannel.p95,
                              )}
                              ms más rápido que Email en P95 (promedio general)
                            </div>
                          )}
                        {telegramChannel.p95 &&
                          emailChannel.p95 &&
                          emailChannel.p95 < telegramChannel.p95 && (
                            <div className="mt-2 text-sm text-green-600 font-medium">
                              ✅ Email es{' '}
                              {Math.round(
                                telegramChannel.p95 - emailChannel.p95,
                              )}
                              ms más rápido que Telegram en P95 (promedio
                              general)
                            </div>
                          )}
                      </div>
                    )
                  }
                  return null
                })()
              ) : latencyData.series.length > 0 ? (
                // Gráfica simple para un solo canal
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Latencia en el Tiempo ({data.channelTarget})
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart
                      data={latencyData.series.map((point) => ({
                        timestamp: new Date(
                          point.timestamp,
                        ).toLocaleTimeString(),
                        p50: point.p50,
                        p95: point.p95,
                        p99: point.p99,
                        avg: point.avg,
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
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
                        dataKey="p50"
                        stroke="#3b82f6"
                        name="P50"
                        strokeWidth={2}
                        connectNulls={true}
                      />
                      <Line
                        type="monotone"
                        dataKey="p95"
                        stroke="#eab308"
                        name="P95"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        connectNulls={true}
                      />
                      <Line
                        type="monotone"
                        dataKey="p99"
                        stroke="#ef4444"
                        name="P99"
                        strokeWidth={2}
                        connectNulls={true}
                      />
                      <Line
                        type="monotone"
                        dataKey="avg"
                        stroke="#10b981"
                        name="Promedio"
                        strokeWidth={2}
                        strokeDasharray="3 3"
                        connectNulls={true}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : null}

              {/* Resumen por Canal */}
              {latencyData.byChannel.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Resumen de Latencia por Canal
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {latencyData.byChannel.map((channel) => {
                      const isEmail = channel.channel === 'EMAIL'
                      const isTelegram = channel.channel === 'TELEGRAM'
                      const isWinner =
                        data.channelTarget === 'BOTH' &&
                        latencyData.byChannel.length === 2 &&
                        ((isTelegram &&
                          latencyData.byChannel.find(
                            (ch) => ch.channel === 'EMAIL',
                          )?.p95 &&
                          channel.p95 &&
                          channel.p95 <
                            latencyData.byChannel.find(
                              (ch) => ch.channel === 'EMAIL',
                            )!.p95!) ||
                          (isEmail &&
                            latencyData.byChannel.find(
                              (ch) => ch.channel === 'TELEGRAM',
                            )?.p95 &&
                            channel.p95 &&
                            channel.p95 <
                              latencyData.byChannel.find(
                                (ch) => ch.channel === 'TELEGRAM',
                              )!.p95!))

                      return (
                        <div
                          key={channel.channel}
                          className={`border-2 p-4 rounded-md shadow ${
                            isTelegram
                              ? 'border-blue-300 bg-blue-50'
                              : isEmail
                                ? 'border-gray-300 bg-gray-50'
                                : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold">
                              {channel.channel}
                            </div>
                            {isWinner && (
                              <div className="flex items-center gap-1 text-green-600 text-xs">
                                🏆 <span>Más rápido (P95)</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>P50:</span>
                              <span>{channel.p50 ?? 'N/A'}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>P95:</span>
                              <span
                                className={
                                  isWinner ? 'text-green-600 font-bold' : ''
                                }
                              >
                                {channel.p95 ?? 'N/A'}ms
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>P99:</span>
                              <span>{channel.p99 ?? 'N/A'}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Promedio:</span>
                              <span>{channel.avg ?? 'N/A'}ms</span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <DeleteExperimentModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        experimentId={data.id}
        experimentName={data.name}
        onDeleteSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
