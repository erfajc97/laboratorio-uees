import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { metricsService } from '../services/metrics.service'

interface ExportSectionProps {
  filters: {
    from?: string
    to?: string
    channel?: string
    experimentRunId?: string
  }
}

export default function ExportSection({ filters }: ExportSectionProps) {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json'>('json')
  const [exportError, setExportError] = useState<string | null>(null)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)

  const exportLogsMutation = useMutation({
    mutationFn: async (format: 'csv' | 'json') => {
      setExportError(null)
      setExportSuccess(null)
      const logs = await metricsService.getLogs({
        ...filters,
        page: 1,
        pageSize: 10000, // Exportar todos
      })

      if (logs.data.length === 0) {
        throw new Error('No hay datos para exportar con los filtros aplicados')
      }

      if (format === 'csv') {
        const headers = [
          'ID',
          'Fecha',
          'Canal',
          'Estado',
          'Latencia (ms)',
          'Correlation ID',
          'Reintentos',
          'Error Code',
          'Error Message',
          'Template',
          'Recipient Hash',
          'Experiment Run ID',
        ]
        const rows = logs.data.map((log: any) => [
          log.id,
          new Date(log.createdAt).toISOString(),
          log.channel,
          log.status,
          log.latencyMs || '',
          log.correlationId,
          log.retryCount,
          log.errorCode || '',
          log.errorMessage || '',
          log.template || '',
          log.recipientHash || '',
          log.experimentRunId || '',
        ])

        const csv = [
          headers.join(','),
          ...rows.map((row: Array<string>) => row.join(',')),
        ].join('\n')
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `metrics-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const exportData = {
          metadata: {
            exportedAt: new Date().toISOString(),
            filters,
            totalRecords: logs.total,
          },
          data: logs.data,
        }
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
          type: 'application/json',
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `metrics-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setExportSuccess(
          `Logs exportados exitosamente (${logs.data.length} registros)`,
        )
      }
    },
    onError: (error: Error) => {
      setExportError(error.message || 'Error al exportar logs')
      setExportSuccess(null)
    },
  })

  const generateSnapshotMutation = useMutation({
    mutationFn: async () => {
      setExportError(null)
      setExportSuccess(null)
      try {
        // Generar snapshot completo
        const [summary, logs, latency, throughput] = await Promise.all([
          metricsService.getSummary(filters),
          metricsService.getLogs({ ...filters, page: 1, pageSize: 1000 }),
          metricsService.getLatency(filters),
          filters.experimentRunId
            ? metricsService
                .getThroughput(filters.experimentRunId)
                .catch(() => null)
            : Promise.resolve(null),
        ])

        const snapshot = {
          metadata: {
            timestamp: new Date().toISOString(),
            generatedAt: new Date().toLocaleString('es-ES'),
            filters: {
              from: filters.from || 'No especificado',
              to: filters.to || 'No especificado',
              channel: filters.channel || 'Todos',
              experimentRunId: filters.experimentRunId || 'No especificado',
            },
            dataCounts: {
              totalLogs: logs.total,
              logsInSnapshot: logs.data.length,
              latencyDataPoints: latency.series.length,
              hasThroughput: throughput !== null,
            },
          },
          summary,
          latency,
          logs: {
            total: logs.total,
            page: logs.page,
            pageSize: logs.pageSize,
            data: logs.data,
          },
          ...(throughput && { throughput }),
        }

        const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
          type: 'application/json',
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `metrics-snapshot-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        setExportSuccess('Snapshot generado exitosamente')
      } catch (error) {
        console.error('Error generando snapshot:', error)
        throw error
      }
    },
    onError: (error: Error) => {
      setExportError(error.message || 'Error al generar snapshot')
      setExportSuccess(null)
    },
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Exportar Datos</h2>

      <div className="space-y-6">
        {/* Export logs */}
        <div className="border p-6 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-4">Exportar Logs</h3>
          <div className="flex gap-4 items-center">
            <select
              value={exportFormat}
              onChange={(e) =>
                setExportFormat(e.target.value as 'csv' | 'json')
              }
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
            <button
              onClick={() => exportLogsMutation.mutate(exportFormat)}
              disabled={exportLogsMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
            >
              {exportLogsMutation.isPending ? 'Exportando...' : 'Exportar Logs'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Exporta los logs de notificaciones según los filtros aplicados
          </p>
        </div>

        {/* Generate snapshot */}
        <div className="border p-6 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-4">
            Generar Snapshot Completo
          </h3>
          <button
            onClick={() => generateSnapshotMutation.mutate()}
            disabled={generateSnapshotMutation.isPending}
            className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700 disabled:opacity-50"
          >
            {generateSnapshotMutation.isPending
              ? 'Generando...'
              : 'Generar Snapshot'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Genera un snapshot completo con resumen, latencias y logs para
            evidencias de tesis
          </p>
        </div>

        {/* Messages */}
        {exportError && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-md shadow">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> {exportError}
            </p>
          </div>
        )}
        {exportSuccess && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-md shadow">
            <p className="text-sm text-green-800">
              <strong>Éxito:</strong> {exportSuccess}
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md shadow">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Los archivos se descargarán automáticamente.
            Asegúrate de tener los permisos de descarga habilitados en tu
            navegador.
          </p>
        </div>
      </div>
    </div>
  )
}
