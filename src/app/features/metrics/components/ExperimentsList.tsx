import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { metricsService } from '../services/metrics.service'
import ExperimentForm from './ExperimentForm'
import ExperimentDetail from './ExperimentDetail'
import type { ExperimentRun, ExperimentStatus } from '../types/metrics.types'

interface ExperimentsListProps {
  onSelectExperiment?: (experimentId: string) => void
}

export default function ExperimentsList({
  onSelectExperiment,
}: ExperimentsListProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedExperiment, setSelectedExperiment] = useState<string | null>(
    null,
  )

  const queryClient = useQueryClient()
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['experiments'],
    queryFn: () => metricsService.getExperiments(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => metricsService.deleteExperiment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['experiments'] })
    },
  })

  const handleDelete = async (
    id: string,
    name: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation()
    if (
      window.confirm(
        `¿Estás seguro de que quieres eliminar el experimento "${name}"? Esta acción no se puede deshacer.`,
      )
    ) {
      try {
        await deleteMutation.mutateAsync(id)
      } catch (deleteError) {
        alert(
          `Error al eliminar el experimento: ${deleteError instanceof Error ? deleteError.message : 'Error desconocido'}`,
        )
      }
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        Cargando experimentos del laboratorio...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error al cargar experimentos del laboratorio
      </div>
    )
  }

  if (selectedExperiment) {
    return (
      <ExperimentDetail
        experimentId={selectedExperiment}
        onBack={() => setSelectedExperiment(null)}
        onDelete={() => setSelectedExperiment(null)}
      />
    )
  }

  if (showForm) {
    return (
      <ExperimentForm
        onSuccess={() => {
          setShowForm(false)
          void refetch()
        }}
        onCancel={() => setShowForm(false)}
      />
    )
  }

  const getStatusColor = (status: ExperimentStatus) => {
    switch (status) {
      case 'CREATED':
        return 'bg-gray-100 text-gray-800'
      case 'RUNNING':
        return 'bg-blue-100 text-blue-800'
      case 'DONE':
        return 'bg-green-100 text-green-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Experimentos del Laboratorio</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
        >
          Crear Experimento
        </button>
      </div>

      {!data || data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay experimentos en el laboratorio. Crea uno para comenzar.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((experiment: ExperimentRun) => (
            <div
              key={experiment.id}
              className="border p-4 rounded-md shadow hover:shadow-lg cursor-pointer transition-shadow"
              onClick={() => setSelectedExperiment(experiment.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{experiment.name}</h3>
                  {experiment.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {experiment.description}
                    </p>
                  )}
                  <div className="mt-2 flex gap-4 text-sm text-gray-600">
                    <span>Escenario: {experiment.scenario}</span>
                    <span>Canal: {experiment.channelTarget}</span>
                    <span>Mensajes: {experiment.totalMessages}</span>
                    <span>Concurrencia: {experiment.concurrency}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 font-mono">
                    ID: {experiment.id}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium ${getStatusColor(
                      experiment.status,
                    )}`}
                  >
                    {experiment.status}
                  </span>
                  {experiment._count && (
                    <span className="text-xs text-gray-500">
                      {experiment._count.metricEvents} eventos
                    </span>
                  )}
                  <div className="flex gap-2">
                    {onSelectExperiment && experiment.status === 'DONE' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectExperiment(experiment.id)
                        }}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                        title="Usar este experimento en los filtros"
                      >
                        Ver Métricas
                      </button>
                    )}
                    {experiment.status !== 'RUNNING' && (
                      <button
                        onClick={(e) =>
                          handleDelete(experiment.id, experiment.name, e)
                        }
                        disabled={deleteMutation.isPending}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-md shadow hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Eliminar experimento"
                      >
                        {deleteMutation.isPending
                          ? 'Eliminando...'
                          : 'Eliminar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
