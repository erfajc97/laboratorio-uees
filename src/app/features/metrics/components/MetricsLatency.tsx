import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'
import { ChevronDown, ChevronRight, Info, Trophy } from 'lucide-react'
import { metricsService } from '../services/metrics.service'

interface MetricsLatencyProps {
  filters: {
    from?: string
    to?: string
    channel?: string
    experimentRunId?: string
  }
}

export default function MetricsLatency({ filters }: MetricsLatencyProps) {
  const [showInfoBox, setShowInfoBox] = useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics', 'latency', filters],
    queryFn: () => metricsService.getLatency(filters),
  })

  if (isLoading) {
    return <div className="text-center py-8">Cargando datos de latencia...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error al cargar datos de latencia
      </div>
    )
  }

  if (!data || data.series.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-2">
          No hay datos de latencia disponibles
        </div>
        <div className="text-sm text-gray-500">
          {filters.experimentRunId
            ? 'El experimento seleccionado no tiene eventos con latencia registrada. Los eventos deben estar en estado ACKED o DELIVERED para tener latencia.'
            : 'No se encontraron eventos con latencia registrada. Asegúrate de que haya notificaciones completadas (ACKED o DELIVERED) en el rango de fechas seleccionado.'}
        </div>
      </div>
    )
  }

  const chartData = data.series.map((point) => ({
    timestamp: new Date(point.timestamp).toLocaleTimeString(),
    p50: point.p50,
    p95: point.p95,
    p99: point.p99,
    avg: point.avg,
  }))

  const PercentileCard = ({
    label,
    value,
    color,
    description,
  }: {
    label: string
    value: number | null
    color: string
    description: string
  }) => (
    <div className={`${color} p-4 rounded-md shadow relative group`}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{label}</div>
        <div className="cursor-help" title={description}>
          <Info size={16} className="text-gray-500" />
        </div>
      </div>
      <div className="text-2xl font-bold mt-2">{value ?? 'N/A'}ms</div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Latencia en el Tiempo</h2>
        <button
          onClick={() => setShowInfoBox(!showInfoBox)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
        >
          {showInfoBox ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <Info size={16} />
          <span>Explicación de conceptos</span>
        </button>
      </div>

      {/* Info Box Colapsable */}
      {showInfoBox && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            📊 Conceptos de Métricas
          </h3>
          <div className="space-y-3 text-sm text-blue-800">
            <div>
              <strong>P50 (Mediana):</strong> El 50% de las notificaciones
              tuvieron esta latencia o menos. Es el valor que divide los datos
              en dos mitades iguales.
            </div>
            <div>
              <strong>P95:</strong> El 95% de las notificaciones tuvieron esta
              latencia o menos. Es una métrica importante para SLA (Service
              Level Agreement) ya que muestra el rendimiento en la mayoría de
              los casos, excluyendo el 5% más lento.
            </div>
            <div>
              <strong>P99:</strong> El 99% de las notificaciones tuvieron esta
              latencia o menos. Muestra el rendimiento en casos extremos, útil
              para identificar problemas de rendimiento raros pero importantes.
            </div>
            <div>
              <strong>Serie Temporal:</strong> Datos ordenados por tiempo que
              muestran cómo cambia la latencia a lo largo del experimento.
              Permite identificar tendencias, picos y patrones de rendimiento en
              el tiempo.
            </div>
          </div>
        </div>
      )}

      {/* Overall stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <PercentileCard
          label="P50"
          value={data.overall.p50}
          color="bg-blue-50"
          description="50% de las notificaciones tuvieron esta latencia o menos (Mediana)"
        />
        <PercentileCard
          label="P95"
          value={data.overall.p95}
          color="bg-purple-50"
          description="95% de las notificaciones tuvieron esta latencia o menos (Métrica importante para SLA)"
        />
        <PercentileCard
          label="P99"
          value={data.overall.p99}
          color="bg-indigo-50"
          description="99% de las notificaciones tuvieron esta latencia o menos (Casos extremos)"
        />
        <div className="bg-gray-50 p-4 rounded-md shadow">
          <div className="text-sm text-gray-600 font-medium">Promedio</div>
          <div className="text-2xl font-bold mt-2">
            {data.overall.avg ?? 'N/A'}ms
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Serie Temporal (General)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis
              domain={[0, 'auto']}
              label={{
                value: 'Latencia (ms)',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <RechartsTooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="p50"
              stroke="#3b82f6"
              name="P50"
              strokeWidth={3}
              connectNulls={true}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="p95"
              stroke="#eab308"
              name="P95"
              strokeWidth={4}
              strokeDasharray="10 5"
              connectNulls={true}
              strokeOpacity={0.9}
              dot={{ r: 6, fill: '#eab308', strokeWidth: 2 }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="p99"
              stroke="#ef4444"
              name="P99"
              strokeWidth={3}
              connectNulls={true}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#10b981"
              name="Promedio"
              strokeWidth={2}
              strokeDasharray="5 5"
              connectNulls={true}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica Comparativa EMAIL vs TELEGRAM */}
      {(() => {
        const emailChannel = data.byChannel.find((ch) => ch.channel === 'EMAIL')
        const telegramChannel = data.byChannel.find(
          (ch) => ch.channel === 'TELEGRAM',
        )
        const hasBothChannels = emailChannel && telegramChannel

        if (!hasBothChannels || !data.seriesByChannel) return null

        // Agrupar seriesByChannel por timestamp y canal
        const comparisonMap = new Map<
          string,
          { email: number | null; telegram: number | null }
        >()

        data.seriesByChannel.forEach((point) => {
          const timestamp = new Date(point.timestamp).toLocaleTimeString()
          if (!comparisonMap.has(timestamp)) {
            comparisonMap.set(timestamp, { email: null, telegram: null })
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

        const comparisonData = Array.from(comparisonMap.entries()).map(
          ([timestamp, values]) => ({
            timestamp,
            email: values.email,
            telegram: values.telegram,
          }),
        )

        if (comparisonData.length > 0) {
          return (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                Comparación EMAIL vs TELEGRAM (P95 Latency en el Tiempo)
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis
                    domain={[0, 'auto']}
                    label={{
                      value: 'Latencia P95 (ms)',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <RechartsTooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="email"
                    stroke="#6b7280"
                    name="EMAIL"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="telegram"
                    stroke="#3b82f6"
                    name="TELEGRAM"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-2 text-sm text-gray-600">
                {telegramChannel.p95 &&
                  emailChannel.p95 &&
                  telegramChannel.p95 < emailChannel.p95 && (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <Trophy size={16} />
                      <span>
                        Telegram es{' '}
                        {Math.round(emailChannel.p95 - telegramChannel.p95)}ms
                        más rápido que Email en P95 (promedio general)
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )
        }

        return null
      })()}

      {/* Por canal */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Por Canal</h3>
        {(() => {
          const emailChannel = data.byChannel.find(
            (ch) => ch.channel === 'EMAIL',
          )
          const telegramChannel = data.byChannel.find(
            (ch) => ch.channel === 'TELEGRAM',
          )
          const hasBothChannels = emailChannel && telegramChannel

          // Determinar ganador en P95 (menor es mejor)
          const getLatencyWinner = (): 'EMAIL' | 'TELEGRAM' | null => {
            if (!emailChannel?.p95 || !telegramChannel?.p95) return null
            return telegramChannel.p95 < emailChannel.p95 ? 'TELEGRAM' : 'EMAIL'
          }

          const latencyWinner = getLatencyWinner()

          return (
            <div>
              {hasBothChannels && (
                <div className="bg-green-50 border border-green-200 p-3 rounded-md mb-4">
                  <div className="flex items-center gap-2 text-green-800">
                    <Info size={16} />
                    <span className="text-sm font-medium">
                      Comparación directa: Este experimento compara EMAIL y
                      TELEGRAM.
                    </span>
                  </div>
                </div>
              )}
              <div
                className={`grid gap-4 ${
                  hasBothChannels
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-3'
                }`}
              >
                {data.byChannel.map((channel) => {
                  const isEmail = channel.channel === 'EMAIL'
                  const isTelegram = channel.channel === 'TELEGRAM'
                  const isWinner =
                    hasBothChannels &&
                    ((isTelegram && latencyWinner === 'TELEGRAM') ||
                      (isEmail && latencyWinner === 'EMAIL'))

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
                        <div className="font-semibold">{channel.channel}</div>
                        {isWinner && (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Trophy size={14} />
                            <span>Más rápido (P95)</span>
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
          )
        })()}
      </div>
    </div>
  )
}
