import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ChevronDown,
  ChevronRight,
  Info,
  TrendingDown,
  Trophy,
} from 'lucide-react'
import { metricsService } from '../services/metrics.service'
import ChannelComparison from './ChannelComparison'

interface MetricsSummaryProps {
  filters: {
    from?: string
    to?: string
    channel?: string
    experimentRunId?: string
  }
}

export default function MetricsSummary({ filters }: MetricsSummaryProps) {
  const [showInfoBox, setShowInfoBox] = useState(false)
  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics', 'summary', filters],
    queryFn: () => metricsService.getSummary(filters),
  })

  // Obtener datos de latencia para la tabla comparativa (siempre llamar el hook)
  const { data: latencyData } = useQuery({
    queryKey: ['metrics', 'latency', filters],
    queryFn: () => metricsService.getLatency(filters),
  })

  if (isLoading) {
    return <div className="text-center py-8">Cargando...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error al cargar métricas</div>
        <div className="text-sm text-gray-500">
          {error instanceof Error ? error.message : 'Error desconocido'}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-2">No hay datos disponibles</div>
        <div className="text-sm text-gray-500">
          {filters.from || filters.to
            ? 'No se encontraron métricas con los filtros aplicados. Intenta ajustar las fechas o limpiar los filtros.'
            : 'No hay métricas registradas en la base de datos. Ejecuta un experimento o envía notificaciones para generar datos.'}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Resumen de Métricas</h2>
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
              <strong>Tasa de Éxito:</strong> Porcentaje de notificaciones que
              fueron entregadas exitosamente (estado DELIVERED) del total de
              notificaciones enviadas.
            </div>
          </div>
        </div>
      )}

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-50 p-6 rounded-md shadow">
          <div className="text-sm text-blue-600 font-medium">
            Total Enviados
          </div>
          <div className="text-3xl font-bold text-blue-900 mt-2">
            {data.totalSent}
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-md shadow">
          <div className="text-sm text-green-600 font-medium">
            Tasa de Éxito
          </div>
          <div className="text-3xl font-bold text-green-900 mt-2">
            {data.successRate.toFixed(1)}%
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-md shadow relative group">
          <div className="flex items-center justify-between">
            <div className="text-sm text-purple-600 font-medium">
              P95 Latencia
            </div>
            <div
              className="cursor-help"
              title="95% de las notificaciones tuvieron esta latencia o menos (Métrica importante para SLA)"
            >
              <Info size={16} className="text-gray-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-900 mt-2">
            {data.p95LatencyMs ? `${data.p95LatencyMs}ms` : 'N/A'}
          </div>
        </div>
        <div className="bg-red-50 p-6 rounded-md shadow">
          <div className="text-sm text-red-600 font-medium">Fallos</div>
          <div className="text-3xl font-bold text-red-900 mt-2">
            {data.totalFailed}
          </div>
        </div>
      </div>

      {/* Métricas por canal */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Por Canal</h3>
        {data.totalSent === 0 &&
        data.byChannel.every((ch) => ch.totalSent === 0) ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">
              No hay eventos registrados con los filtros aplicados.
            </p>
            <p className="text-sm">
              Si acabas de ejecutar un experimento, los eventos pueden estar en
              estado PENDING. Espera unos segundos y recarga la página.
            </p>
          </div>
        ) : (
          <>
            {(() => {
              const emailChannel = data.byChannel.find(
                (ch) => ch.channel === 'EMAIL',
              )
              const telegramChannel = data.byChannel.find(
                (ch) => ch.channel === 'TELEGRAM',
              )
              const hasBothChannels = emailChannel && telegramChannel

              // Determinar ganador en cada métrica
              const getWinner = (
                emailValue: number | null,
                telegramValue: number | null,
                lowerIsBetter: boolean = true,
              ): 'EMAIL' | 'TELEGRAM' | null => {
                if (!emailValue || !telegramValue) return null
                if (lowerIsBetter) {
                  return telegramValue < emailValue ? 'TELEGRAM' : 'EMAIL'
                }
                return telegramValue > emailValue ? 'TELEGRAM' : 'EMAIL'
              }

              const latencyWinner = getWinner(
                emailChannel?.p95LatencyMs ?? null,
                telegramChannel?.p95LatencyMs ?? null,
                true,
              )
              const successRateWinner = getWinner(
                emailChannel?.successRate ?? null,
                telegramChannel?.successRate ?? null,
                false,
              )

              return (
                <div>
                  {hasBothChannels && (
                    <div className="bg-green-50 border border-green-200 p-3 rounded-md mb-4">
                      <div className="flex items-center gap-2 text-green-800">
                        <Info size={16} />
                        <span className="text-sm font-medium">
                          Comparación directa: Este experimento compara EMAIL y
                          TELEGRAM. Los resultados se muestran por canal
                          individual.
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
                      const isWinnerLatency =
                        hasBothChannels &&
                        ((isTelegram && latencyWinner === 'TELEGRAM') ||
                          (isEmail && latencyWinner === 'EMAIL'))
                      const isWinnerSuccess =
                        hasBothChannels &&
                        ((isTelegram && successRateWinner === 'TELEGRAM') ||
                          (isEmail && successRateWinner === 'EMAIL'))

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
                          <div className="flex items-center justify-between mb-3">
                            <div className="font-semibold text-lg">
                              {channel.channel}
                            </div>
                            {isWinnerLatency && (
                              <div className="flex items-center gap-1 text-green-600 text-xs">
                                <Trophy size={14} />
                                <span>Más rápido</span>
                              </div>
                            )}
                            {isWinnerSuccess && (
                              <div className="flex items-center gap-1 text-green-600 text-xs">
                                <TrendingDown size={14} />
                                <span>Mejor tasa</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Enviados:</span>
                              <span className="font-medium">
                                {channel.totalSent}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Entregados:</span>
                              <span className="font-medium">
                                {channel.totalDelivered}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fallos:</span>
                              <span className="font-medium text-red-600">
                                {channel.totalFailed}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Tasa de Éxito:</span>
                              <span
                                className={`font-medium ${
                                  isWinnerSuccess
                                    ? 'text-green-600 font-bold'
                                    : ''
                                }`}
                              >
                                {channel.successRate.toFixed(1)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>P95 Latencia:</span>
                              <span
                                className={`font-medium ${
                                  isWinnerLatency
                                    ? 'text-green-600 font-bold'
                                    : ''
                                }`}
                              >
                                {channel.p95LatencyMs
                                  ? `${channel.p95LatencyMs}ms`
                                  : 'N/A'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}
          </>
        )}

        {/* Tabla Comparativa */}
        {(() => {
          const emailChannel = data.byChannel.find(
            (ch) => ch.channel === 'EMAIL',
          )
          const telegramChannel = data.byChannel.find(
            (ch) => ch.channel === 'TELEGRAM',
          )
          const hasBothChannels = emailChannel && telegramChannel

          if (!hasBothChannels) return null

          // Usar datos de latencia obtenidos en el nivel superior
          const emailLatencyData = latencyData?.byChannel.find(
            (ch) => ch.channel === 'EMAIL',
          )
          const telegramLatencyData = latencyData?.byChannel.find(
            (ch) => ch.channel === 'TELEGRAM',
          )

          // hasBothChannels garantiza que emailChannel y telegramChannel son truthy
          const emailComparisonData = {
            channel: 'EMAIL' as const,
            totalSent: emailChannel.totalSent,
            totalDelivered: emailChannel.totalDelivered,
            totalFailed: emailChannel.totalFailed,
            successRate: emailChannel.successRate,
            p50LatencyMs: emailLatencyData?.p50 ?? null,
            p95LatencyMs: emailChannel.p95LatencyMs,
            p99LatencyMs: emailLatencyData?.p99 ?? null,
            avgLatencyMs: emailLatencyData?.avg ?? null,
          }

          const telegramComparisonData = {
            channel: 'TELEGRAM' as const,
            totalSent: telegramChannel.totalSent,
            totalDelivered: telegramChannel.totalDelivered,
            totalFailed: telegramChannel.totalFailed,
            successRate: telegramChannel.successRate,
            p50LatencyMs: telegramLatencyData?.p50 ?? null,
            p95LatencyMs: telegramChannel.p95LatencyMs,
            p99LatencyMs: telegramLatencyData?.p99 ?? null,
            avgLatencyMs: telegramLatencyData?.avg ?? null,
          }

          return (
            <div className="mt-8">
              <ChannelComparison
                emailData={emailComparisonData}
                telegramData={telegramComparisonData}
              />
            </div>
          )
        })()}
      </div>
    </div>
  )
}
