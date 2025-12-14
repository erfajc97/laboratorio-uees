import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { metricsService } from '../services/metrics.service'
import { ExperimentScenario, NotificationChannel } from '../types/metrics.types'
import type { CreateExperimentDto } from '../types/metrics.types'

interface ExperimentFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function ExperimentForm({
  onSuccess,
  onCancel,
}: ExperimentFormProps) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<CreateExperimentDto>({
    name: '',
    description: '',
    scenario: ExperimentScenario.LATENCY,
    channelTarget: NotificationChannel.EMAIL,
    totalMessages: 100,
    concurrency: 5,
    ratePerSec: 10,
    dryRun: true,
  })

  const createMutation = useMutation({
    mutationFn: (dto: CreateExperimentDto) =>
      metricsService.createExperiment(dto),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['experiments'] })
      onSuccess()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Crear Nuevo Experimento</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Escenario *
            </label>
            <select
              value={formData.scenario}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  scenario: e.target.value as ExperimentScenario,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={ExperimentScenario.LATENCY}>Latencia</option>
              <option value={ExperimentScenario.THROUGHPUT}>Throughput</option>
              <option value={ExperimentScenario.ERROR_INJECTION}>
                Inyección de Errores
              </option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canal Objetivo *
            </label>
            <select
              value={formData.channelTarget}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  channelTarget: e.target.value as NotificationChannel,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={NotificationChannel.EMAIL}>Email</option>
              <option value={NotificationChannel.TELEGRAM}>Telegram</option>
              <option value={NotificationChannel.BOTH}>Ambos</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Mensajes *
            </label>
            <input
              type="number"
              required
              min={1}
              max={10000}
              value={formData.totalMessages}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalMessages: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Concurrencia *
            </label>
            <input
              type="number"
              required
              min={1}
              max={100}
              value={formData.concurrency}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  concurrency: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate (msg/s)
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={formData.ratePerSec || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ratePerSec: e.target.value
                    ? parseInt(e.target.value)
                    : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="dryRun"
            checked={formData.dryRun}
            onChange={(e) =>
              setFormData({ ...formData, dryRun: e.target.checked })
            }
            className="mr-2"
          />
          <label htmlFor="dryRun" className="text-sm font-medium text-gray-700">
            Modo Dry-Run (no enviar notificaciones reales)
          </label>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Creando...' : 'Crear Experimento'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>

        {createMutation.isError && (
          <div className="text-red-600 text-sm">
            Error al crear experimento: {createMutation.error.message}
          </div>
        )}
      </form>
    </div>
  )
}
