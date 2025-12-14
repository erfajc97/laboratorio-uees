import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
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

interface MetricsThroughputProps {
  filters: {
    experimentRunId?: string
  }
}

export default function MetricsThroughput({ filters }: MetricsThroughputProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['metrics', 'throughput', filters.experimentRunId],
    queryFn: () => metricsService.getThroughput(filters.experimentRunId!),
    enabled: !!filters.experimentRunId,
  })

  if (!filters.experimentRunId) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-2">
          Selecciona un experimento para ver el throughput
        </div>
        <div className="text-sm text-gray-500">
          Ingresa el ID de un experimento en el filtro "Experimento" para ver
          los datos de throughput y errores
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">Cargando datos de throughput...</div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error al cargar datos de throughput
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-600 mb-2">
          No hay datos de throughput disponibles
        </div>
        <div className="text-sm text-gray-500">
          El experimento {filters.experimentRunId} no tiene puntos de serie
          temporal registrados. Asegúrate de que el experimento se haya
          ejecutado completamente.
        </div>
      </div>
    )
  }

  const chartData = data.map((point) => ({
    tiempo: `${point.tOffsetSec}s`,
    throughput: point.throughput,
    enviados: point.sentCount,
    exitosos: point.successCount,
    fallidos: point.failCount,
  }))

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Throughput y Errores</h2>

      {/* Throughput chart */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          Throughput (mensajes/segundo)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tiempo" />
            <YAxis
              label={{
                value: 'Mensajes/s',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="throughput"
              stroke="#3b82f6"
              name="Throughput"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Success/Fail chart */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Éxitos vs Fallos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="tiempo" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="exitosos" fill="#10b981" name="Exitosos" />
            <Bar dataKey="fallidos" fill="#ef4444" name="Fallidos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
