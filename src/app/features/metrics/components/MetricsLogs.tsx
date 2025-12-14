import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { metricsService } from '../services/metrics.service'
import type { MetricStatus } from '../types/metrics.types'

interface MetricsLogsProps {
  filters: {
    from?: string
    to?: string
    channel?: string
    experimentRunId?: string
  }
}

export default function MetricsLogs({ filters }: MetricsLogsProps) {
  const [page, setPage] = useState(1)
  const [pageSize] = useState(50)
  const [statusFilter, setStatusFilter] = useState<MetricStatus | ''>('')
  const [searchQuery, setSearchQuery] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'metrics',
      'logs',
      filters,
      page,
      pageSize,
      statusFilter,
      searchQuery,
    ],
    queryFn: () =>
      metricsService.getLogs({
        ...filters,
        page,
        pageSize,
        status: statusFilter || undefined,
        q: searchQuery || undefined,
      }),
  })

  if (isLoading) {
    return <div className="text-center py-8">Cargando logs...</div>
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">Error al cargar logs</div>
    )
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-2">No hay logs disponibles</div>
        <div className="text-sm text-gray-500">
          {filters.experimentRunId
            ? `No se encontraron logs para el experimento ${filters.experimentRunId} con los filtros aplicados.`
            : 'No se encontraron logs de notificaciones con los filtros aplicados. Intenta ajustar los filtros de fecha o canal.'}
        </div>
      </div>
    )
  }

  const totalPages = Math.ceil(data.total / pageSize)

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Logs de Notificaciones</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar (correlationId, hash, template)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as MetricStatus | '')
              setPage(1)
            }}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Todos los estados</option>
            <option value="PENDING">Pendiente</option>
            <option value="SENT">Enviado</option>
            <option value="ACKED">Confirmado</option>
            <option value="DELIVERED">Entregado</option>
            <option value="FAILED">Fallido</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Canal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Latencia (ms)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correlation ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reintentos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Error
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.data.map((log: any) => (
              <tr key={log.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.channel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold ${
                      log.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-800'
                        : log.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : log.status === 'ACKED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.latencyMs ?? '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                  {log.correlationId.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {log.retryCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                  {log.errorCode || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">
          Mostrando {(page - 1) * pageSize + 1} a{' '}
          {Math.min(page * pageSize, data.total)} de {data.total} resultados
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="px-4 py-2">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}
