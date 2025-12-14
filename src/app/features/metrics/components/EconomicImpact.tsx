import { useEffect, useMemo, useState } from 'react'
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
import type {
  EconomicImpactInputs,
  EconomicImpactResult,
  Scenario,
} from '../types/economic-impact.types'

export default function EconomicImpact() {
  const { data: defaults } = useQuery({
    queryKey: ['economic-defaults'],
    queryFn: () => metricsService.getEconomicDefaults(),
  })

  const [inputs, setInputs] = useState<EconomicImpactInputs>({
    annualFailedHearings: 75363,
    averageCostPerHearing: 339.04,
    reductionPercentage: 20,
  })

  const [showMethodology, setShowMethodology] = useState(false)

  // Actualizar inputs cuando se cargan los defaults
  useEffect(() => {
    if (defaults) {
      setInputs({
        annualFailedHearings: defaults.annualFailedHearings,
        averageCostPerHearing: defaults.averageCostPerHearing,
        reductionPercentage: defaults.reductionScenarios.mediumConservative,
      })
    }
  }, [defaults])

  // Calcular resultado actual
  const currentResult = useMemo(() => {
    const avoidedCancellations = Math.round(
      inputs.annualFailedHearings * (inputs.reductionPercentage / 100),
    )
    const estimatedAnnualSavings =
      Math.round(avoidedCancellations * inputs.averageCostPerHearing * 100) /
      100

    return {
      reductionPercentage: inputs.reductionPercentage,
      avoidedCancellations,
      estimatedAnnualSavings,
      inputs: {
        annualFailedHearings: inputs.annualFailedHearings,
        averageCostPerHearing: inputs.averageCostPerHearing,
      },
      timestamp: new Date().toISOString(),
    } as EconomicImpactResult
  }, [inputs])

  // Calcular escenarios predefinidos
  const scenarios = useMemo((): Array<Scenario> => {
    if (!defaults) return []
    return [
      {
        name: 'Muy conservador',
        reductionPercentage: defaults.reductionScenarios.veryConservative,
        avoidedCancellations: Math.round(
          inputs.annualFailedHearings *
            (defaults.reductionScenarios.veryConservative / 100),
        ),
        estimatedAnnualSavings:
          Math.round(
            inputs.annualFailedHearings *
              (defaults.reductionScenarios.veryConservative / 100) *
              inputs.averageCostPerHearing *
              100,
          ) / 100,
      },
      {
        name: 'Conservador medio',
        reductionPercentage: defaults.reductionScenarios.mediumConservative,
        avoidedCancellations: Math.round(
          inputs.annualFailedHearings *
            (defaults.reductionScenarios.mediumConservative / 100),
        ),
        estimatedAnnualSavings:
          Math.round(
            inputs.annualFailedHearings *
              (defaults.reductionScenarios.mediumConservative / 100) *
              inputs.averageCostPerHearing *
              100,
          ) / 100,
      },
      {
        name: 'Moderadamente conservador',
        reductionPercentage: defaults.reductionScenarios.moderatelyConservative,
        avoidedCancellations: Math.round(
          inputs.annualFailedHearings *
            (defaults.reductionScenarios.moderatelyConservative / 100),
        ),
        estimatedAnnualSavings:
          Math.round(
            inputs.annualFailedHearings *
              (defaults.reductionScenarios.moderatelyConservative / 100) *
              inputs.averageCostPerHearing *
              100,
          ) / 100,
      },
    ]
  }, [defaults, inputs.annualFailedHearings, inputs.averageCostPerHearing])

  // Datos para gráfico de líneas (0-30%)
  const lineChartData = useMemo(() => {
    const data = []
    for (let i = 0; i <= 30; i += 2) {
      const avoided = Math.round(inputs.annualFailedHearings * (i / 100))
      const savings =
        Math.round(avoided * inputs.averageCostPerHearing * 100) / 100
      data.push({
        reduction: i,
        ahorro: savings,
      })
    }
    return data
  }, [inputs.annualFailedHearings, inputs.averageCostPerHearing])

  // Formatear número con separadores
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num)
  }

  // Formatear número para ejes de gráficos (formato compacto)
  const formatAxisNumber = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`
    }
    return value.toString()
  }

  // Exportar a CSV
  const exportToCSV = () => {
    const csv = [
      [
        'Escenario',
        '% Reducción',
        'Cancelaciones Evitadas',
        'Ahorro Anual (USD)',
      ],
      ...scenarios.map((s) => [
        s.name,
        `${s.reductionPercentage}%`,
        s.avoidedCancellations.toString(),
        formatNumber(s.estimatedAnnualSavings),
      ]),
      [],
      [
        'Escenario Actual',
        `${currentResult.reductionPercentage}%`,
        currentResult.avoidedCancellations.toString(),
        formatNumber(currentResult.estimatedAnnualSavings),
      ],
      [],
      ['Inputs Utilizados'],
      ['Audiencias fallidas anuales', inputs.annualFailedHearings.toString()],
      [
        'Costo promedio por audiencia (USD)',
        formatNumber(inputs.averageCostPerHearing),
      ],
      ['% Reducción', `${inputs.reductionPercentage}%`],
      [],
      ['Timestamp', currentResult.timestamp],
    ]

    const csvContent = csv.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `impacto-economico-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  // Exportar a JSON
  const exportToJSON = () => {
    const exportData = {
      timestamp: currentResult.timestamp,
      inputs,
      currentResult,
      scenarios,
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `impacto-economico-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  if (!defaults) {
    return (
      <div className="text-center py-8">Cargando valores por defecto...</div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Impacto Económico</h2>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
          >
            Exportar CSV
          </button>
          <button
            onClick={exportToJSON}
            className="px-4 py-2 bg-purple-600 text-white rounded-md shadow hover:bg-purple-700"
          >
            Exportar JSON
          </button>
        </div>
      </div>

      {/* Panel de Inputs */}
      <div className="bg-white border p-6 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-4">
          Parámetros del Modelo (Editables)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audiencias fallidas anuales
            </label>
            <input
              type="number"
              value={inputs.annualFailedHearings}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  annualFailedHearings: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Valor por defecto:{' '}
              {defaults.annualFailedHearings.toLocaleString()}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Costo promedio por audiencia (USD)
            </label>
            <input
              type="number"
              value={inputs.averageCostPerHearing}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  averageCostPerHearing: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
              step="0.01"
            />
            <p className="text-xs text-gray-500 mt-1">
              Valor por defecto: ${formatNumber(defaults.averageCostPerHearing)}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              % Reducción de inasistencia
            </label>
            <input
              type="number"
              value={inputs.reductionPercentage}
              onChange={(e) =>
                setInputs({
                  ...inputs,
                  reductionPercentage: Number(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
              min="0"
              max="30"
              step="1"
            />
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setInputs({ ...inputs, reductionPercentage: 10 })
                }
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                10%
              </button>
              <button
                onClick={() =>
                  setInputs({ ...inputs, reductionPercentage: 20 })
                }
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                20%
              </button>
              <button
                onClick={() =>
                  setInputs({ ...inputs, reductionPercentage: 30 })
                }
                className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                30%
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-md shadow">
          <div className="text-sm text-blue-600 font-medium">
            Cancelaciones Evitadas
          </div>
          <div className="text-3xl font-bold text-blue-900 mt-2">
            {formatNumber(currentResult.avoidedCancellations)}
          </div>
        </div>
        <div className="bg-green-50 p-6 rounded-md shadow">
          <div className="text-sm text-green-600 font-medium">
            Ahorro Anual Estimado
          </div>
          <div className="text-3xl font-bold text-green-900 mt-2">
            ${formatNumber(currentResult.estimatedAnnualSavings)}
          </div>
        </div>
        <div className="bg-purple-50 p-6 rounded-md shadow">
          <div className="text-sm text-purple-600 font-medium">
            Escenario Activo
          </div>
          <div className="text-3xl font-bold text-purple-900 mt-2">
            {currentResult.reductionPercentage}%
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="space-y-6">
        {/* Gráfico de barras - Escenarios */}
        <div className="bg-white border p-6 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-4">Ahorro por Escenario</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={scenarios}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatAxisNumber}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Ahorro Anual (USD)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                }}
              />
              <Tooltip
                formatter={(value: number) => `$${formatNumber(value)}`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Legend />
              <Bar
                dataKey="estimatedAnnualSavings"
                fill="#3b82f6"
                name="Ahorro Anual (USD)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de líneas - Dinámico */}
        <div className="bg-white border p-6 rounded-md shadow">
          <h3 className="text-lg font-semibold mb-4">Ahorro vs % Reducción</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={lineChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="reduction"
                label={{
                  value: '% Reducción',
                  position: 'insideBottom',
                  offset: -5,
                }}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatAxisNumber}
                tick={{ fontSize: 12 }}
                label={{
                  value: 'Ahorro Anual (USD)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' },
                }}
              />
              <Tooltip
                formatter={(value: number) => `$${formatNumber(value)}`}
                labelFormatter={(label) => `${label}%`}
                contentStyle={{ fontSize: '12px' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ahorro"
                stroke="#10b981"
                strokeWidth={2}
                name="Ahorro Anual (USD)"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Escenarios */}
      <div className="bg-white border p-6 rounded-md shadow">
        <h3 className="text-lg font-semibold mb-4">Tabla de Escenarios</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Escenario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % Reducción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cancelaciones Evitadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ahorro Anual (USD)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {scenarios.map((scenario) => (
                <tr key={scenario.name}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {scenario.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {scenario.reductionPercentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatNumber(scenario.avoidedCancellations)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    ${formatNumber(scenario.estimatedAnnualSavings)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Justificación Metodológica */}
      <div className="bg-white border p-6 rounded-md shadow">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="flex justify-between items-center w-full text-left"
        >
          <h3 className="text-lg font-semibold">Justificación Metodológica</h3>
          <span className="text-gray-500">{showMethodology ? '▼' : '▶'}</span>
        </button>
        {showMethodology && (
          <div className="mt-4 text-sm text-gray-700 leading-relaxed">
            <p>
              Los escenarios del 10 %, 20 % y 30 % corresponden a tasas
              hipotéticas de reducción de inasistencia empleadas para evaluar el
              impacto potencial del sistema de notificaciones. Estos valores no
              representan resultados observados en campo, sino un rango
              conservador basado en evidencia empírica sobre el uso de
              mensajería instantánea como herramienta de recordatorio, que
              reporta reducciones de ausentismo cercanas al 30 %. El objetivo es
              estimar beneficios económicos plausibles y metodológicamente
              defendibles.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
