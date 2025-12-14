import { useMemo } from 'react'
import { Minus, Trophy } from 'lucide-react'

interface ChannelData {
  channel: 'EMAIL' | 'TELEGRAM'
  totalSent: number
  totalDelivered: number
  totalFailed: number
  successRate: number
  p50LatencyMs: number | null
  p95LatencyMs: number | null
  p99LatencyMs: number | null
  avgLatencyMs: number | null
}

interface ChannelComparisonProps {
  emailData?: ChannelData
  telegramData?: ChannelData
}

export default function ChannelComparison({
  emailData,
  telegramData,
}: ChannelComparisonProps) {
  const comparison = useMemo(() => {
    if (!emailData || !telegramData) return null

    const compareLatency = (
      email: number | null,
      telegram: number | null,
    ): {
      winner: 'EMAIL' | 'TELEGRAM' | 'TIE' | null
      difference: number | null
      percentage: number | null
    } => {
      if (!email || !telegram)
        return { winner: null, difference: null, percentage: null }
      const diff = email - telegram
      const percentage = (diff / email) * 100
      if (Math.abs(diff) < 1)
        return { winner: 'TIE', difference: 0, percentage: 0 }
      return {
        winner: diff > 0 ? 'TELEGRAM' : 'EMAIL',
        difference: Math.abs(diff),
        percentage: Math.abs(percentage),
      }
    }

    const compareSuccessRate = (
      email: number,
      telegram: number,
    ): {
      winner: 'EMAIL' | 'TELEGRAM' | 'TIE' | null
      difference: number
      percentage: number
    } => {
      const diff = telegram - email
      const percentage = (diff / email) * 100
      if (Math.abs(diff) < 0.1)
        return { winner: 'TIE', difference: 0, percentage: 0 }
      return {
        winner: diff > 0 ? 'TELEGRAM' : 'EMAIL',
        difference: Math.abs(diff),
        percentage: Math.abs(percentage),
      }
    }

    return {
      p50: compareLatency(emailData.p50LatencyMs, telegramData.p50LatencyMs),
      p95: compareLatency(emailData.p95LatencyMs, telegramData.p95LatencyMs),
      p99: compareLatency(emailData.p99LatencyMs, telegramData.p99LatencyMs),
      avg: compareLatency(emailData.avgLatencyMs, telegramData.avgLatencyMs),
      successRate: compareSuccessRate(
        emailData.successRate,
        telegramData.successRate,
      ),
    }
  }, [emailData, telegramData])

  if (!emailData || !telegramData || !comparison) {
    return (
      <div className="text-center py-8 text-gray-500">
        Se requieren datos de ambos canales (EMAIL y TELEGRAM) para la
        comparación.
      </div>
    )
  }

  const MetricRow = ({
    label,
    emailValue,
    telegramValue,
    comparison: comp,
    formatValue,
    lowerIsBetter = true,
  }: {
    label: string
    emailValue: number | null | string
    telegramValue: number | null | string
    comparison: {
      winner: 'EMAIL' | 'TELEGRAM' | 'TIE' | null
      difference: number | null
      percentage: number | null
    }
    formatValue: (val: number | null) => string
    lowerIsBetter?: boolean
  }) => {
    const getWinnerIcon = () => {
      if (!comp.winner) return null
      if (comp.winner === 'TIE')
        return <Minus size={16} className="text-gray-500" />
      if (comp.winner === 'TELEGRAM') {
        return <Trophy size={16} className="text-green-600" />
      }
      return null
    }

    const getEmailClass = () => {
      if (!comp.winner || comp.winner === 'TIE') return ''
      if (comp.winner === 'EMAIL' && lowerIsBetter) return 'bg-green-50'
      if (comp.winner === 'EMAIL' && !lowerIsBetter) return 'bg-green-50'
      return ''
    }

    const getTelegramClass = () => {
      if (!comp.winner || comp.winner === 'TIE') return ''
      if (comp.winner === 'TELEGRAM') return 'bg-green-50 font-bold'
      return ''
    }

    return (
      <tr className="border-b">
        <td className="p-3 font-medium">{label}</td>
        <td className={`p-3 text-center ${getEmailClass()}`}>
          {formatValue(emailValue as number | null)}
        </td>
        <td className={`p-3 text-center ${getTelegramClass()}`}>
          <div className="flex items-center justify-center gap-2">
            {formatValue(telegramValue as number | null)}
            {getWinnerIcon()}
          </div>
        </td>
        <td className="p-3 text-center text-sm text-gray-600">
          {comp.difference !== null && comp.percentage !== null ? (
            <div>
              {comp.winner === 'TELEGRAM' ? (
                <span className="text-green-600 font-medium">
                  Telegram es {comp.difference.toFixed(1)}
                  {typeof emailValue === 'number' && emailValue > 0
                    ? `ms más rápido (${comp.percentage.toFixed(1)}% mejor)`
                    : ' mejor'}
                </span>
              ) : comp.winner === 'EMAIL' ? (
                <span className="text-gray-600">
                  Email es {comp.difference.toFixed(1)}
                  {typeof emailValue === 'number' && emailValue > 0
                    ? `ms más rápido`
                    : ' mejor'}
                </span>
              ) : (
                <span className="text-gray-500">Empate</span>
              )}
            </div>
          ) : (
            <span className="text-gray-400">N/A</span>
          )}
        </td>
      </tr>
    )
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Comparación Detallada</h3>
      <div className="bg-white border rounded-md shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left font-semibold">Métrica</th>
              <th className="p-3 text-center font-semibold">EMAIL</th>
              <th className="p-3 text-center font-semibold">TELEGRAM</th>
              <th className="p-3 text-center font-semibold">Diferencia</th>
            </tr>
          </thead>
          <tbody>
            <MetricRow
              label="P50 Latencia"
              emailValue={emailData.p50LatencyMs}
              telegramValue={telegramData.p50LatencyMs}
              comparison={comparison.p50}
              formatValue={(val) =>
                val !== null ? `${val.toFixed(0)}ms` : 'N/A'
              }
              lowerIsBetter={true}
            />
            <MetricRow
              label="P95 Latencia"
              emailValue={emailData.p95LatencyMs}
              telegramValue={telegramData.p95LatencyMs}
              comparison={comparison.p95}
              formatValue={(val) =>
                val !== null ? `${val.toFixed(0)}ms` : 'N/A'
              }
              lowerIsBetter={true}
            />
            <MetricRow
              label="P99 Latencia"
              emailValue={emailData.p99LatencyMs}
              telegramValue={telegramData.p99LatencyMs}
              comparison={comparison.p99}
              formatValue={(val) =>
                val !== null ? `${val.toFixed(0)}ms` : 'N/A'
              }
              lowerIsBetter={true}
            />
            <MetricRow
              label="Latencia Promedio"
              emailValue={emailData.avgLatencyMs}
              telegramValue={telegramData.avgLatencyMs}
              comparison={comparison.avg}
              formatValue={(val) =>
                val !== null ? `${val.toFixed(0)}ms` : 'N/A'
              }
              lowerIsBetter={true}
            />
            <MetricRow
              label="Tasa de Éxito"
              emailValue={emailData.successRate}
              telegramValue={telegramData.successRate}
              comparison={comparison.successRate}
              formatValue={(val) =>
                val !== null ? `${val.toFixed(1)}%` : 'N/A'
              }
              lowerIsBetter={false}
            />
            <MetricRow
              label="Total Enviados"
              emailValue={emailData.totalSent}
              telegramValue={telegramData.totalSent}
              comparison={{ winner: null, difference: null, percentage: null }}
              formatValue={(val) => (val !== null ? val.toString() : 'N/A')}
            />
            <MetricRow
              label="Total Entregados"
              emailValue={emailData.totalDelivered}
              telegramValue={telegramData.totalDelivered}
              comparison={{ winner: null, difference: null, percentage: null }}
              formatValue={(val) => (val !== null ? val.toString() : 'N/A')}
            />
            <MetricRow
              label="Total Fallidos"
              emailValue={emailData.totalFailed}
              telegramValue={telegramData.totalFailed}
              comparison={{ winner: null, difference: null, percentage: null }}
              formatValue={(val) => (val !== null ? val.toString() : 'N/A')}
            />
          </tbody>
        </table>
      </div>
    </div>
  )
}
