import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Info } from 'lucide-react'
import MetricsSummary from './components/MetricsSummary'
import MetricsLogs from './components/MetricsLogs'
import MetricsLatency from './components/MetricsLatency'
import MetricsThroughput from './components/MetricsThroughput'
import ExperimentsList from './components/ExperimentsList'
import ExportSection from './components/ExportSection'
import EconomicImpact from './components/EconomicImpact'
import { metricsService } from './services/metrics.service'

type Tab =
  | 'summary'
  | 'logs'
  | 'latency'
  | 'throughput'
  | 'experiments'
  | 'export'
  | 'economic'

export default function MetricsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('summary')
  const [filters, setFilters] = useState<{
    from?: string
    to?: string
    channel?: string
    experimentRunId?: string
  }>({})

  // Obtener detalles del experimento si hay un experimentRunId
  const { data: experimentData } = useQuery({
    queryKey: ['experiment', filters.experimentRunId],
    queryFn: () =>
      filters.experimentRunId
        ? metricsService.getExperiment(filters.experimentRunId)
        : null,
    enabled: !!filters.experimentRunId,
  })

  const isBothExperiment =
    experimentData?.channelTarget === 'BOTH' && filters.experimentRunId

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'summary', label: 'Resumen' },
    { id: 'logs', label: 'Logs' },
    { id: 'latency', label: 'Latencia' },
    { id: 'throughput', label: 'Throughput/Errores' },
    { id: 'experiments', label: 'Experimentos del Laboratorio' },
    { id: 'export', label: 'Exportar' },
    { id: 'economic', label: 'Impacto Económico' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Laboratorio de Métricas y Experimentos
      </h1>

      {/* Filtros globales */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filtros</h2>
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md shadow hover:bg-gray-50"
          >
            Limpiar Filtros
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              type="datetime-local"
              value={filters.from || ''}
              onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              type="datetime-local"
              value={filters.to || ''}
              onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canal
            </label>
            <select
              value={filters.channel || ''}
              onChange={(e) =>
                setFilters({ ...filters, channel: e.target.value || undefined })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Todos</option>
              <option value="EMAIL">Email</option>
              <option value="TELEGRAM">Telegram</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experimento
            </label>
            <input
              type="text"
              placeholder="ID del experimento"
              value={filters.experimentRunId || ''}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  experimentRunId: e.target.value || undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        {(filters.from || filters.to) && (
          <div className="mt-3 text-sm text-amber-600">
            <strong>Nota:</strong> Si no ves datos, verifica que las fechas
            seleccionadas incluyan el rango donde se crearon los eventos. Puedes
            limpiar los filtros para ver todos los datos.
          </div>
        )}
        {isBothExperiment && (
          <div className="mt-3 text-sm text-blue-700 bg-blue-50 border border-blue-200 p-3 rounded-md">
            <div className="flex items-start gap-2">
              <Info size={18} className="mt-0.5 shrink-0" />
              <div>
                <strong>Experimento de Comparación:</strong> Este experimento
                compara EMAIL y TELEGRAM. Los resultados se muestran por canal
                individual para permitir una comparación directa. Telegram
                generalmente muestra mejores resultados en latencia y tasa de
                éxito.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-md shadow p-6">
        {activeTab === 'summary' && <MetricsSummary filters={filters} />}
        {activeTab === 'logs' && <MetricsLogs filters={filters} />}
        {activeTab === 'latency' && <MetricsLatency filters={filters} />}
        {activeTab === 'throughput' && <MetricsThroughput filters={filters} />}
        {activeTab === 'experiments' && (
          <ExperimentsList
            onSelectExperiment={(experimentId) => {
              // Limpiar fechas para mostrar todos los datos del experimento
              setFilters({ experimentRunId: experimentId })
              // Cambiar a la pestaña de resumen para ver los datos
              setActiveTab('summary')
            }}
          />
        )}
        {activeTab === 'export' && <ExportSection filters={filters} />}
        {activeTab === 'economic' && <EconomicImpact />}
      </div>
    </div>
  )
}
