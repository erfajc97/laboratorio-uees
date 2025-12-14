import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCreateParticipante } from '../mutations/useCreateParticipante'
import { useUpdateParticipante } from '../mutations/useUpdateParticipante'
import type { CreateParticipanteDto, Participante } from '../types'
import { TipoParticipante } from '../types'
import { useNavigate } from '@tanstack/react-router'

interface ParticipanteFormProps {
  participante?: Participante
  onSuccess?: () => void
}

export function ParticipanteForm({
  participante,
  onSuccess,
}: ParticipanteFormProps) {
  const navigate = useNavigate()
  const isEditing = !!participante
  const createMutation = useCreateParticipante()
  const updateMutation = useUpdateParticipante()

  const [formData, setFormData] = useState<CreateParticipanteDto>({
    nombre: participante?.nombre || '',
    email: participante?.email || '',
    telefono: participante?.telefono || '',
    tipo: participante?.tipo || TipoParticipante.JUEZ,
    telegramChatId: participante?.telegramChatId || '',
  })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      if (isEditing && participante) {
        await updateMutation.mutateAsync({
          id: participante.id,
          data: formData,
        })
      } else {
        await createMutation.mutateAsync(formData)
      }

      onSuccess?.()
      navigate({ to: '/participantes' })
    } catch (error) {
      console.error('Error al guardar participante:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="nombre"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre *
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="tipo"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tipo *
          </label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={TipoParticipante.JUEZ}>Juez</option>
            <option value={TipoParticipante.ABOGADO_DEMANDANTE}>
              Abogado Demandante
            </option>
            <option value={TipoParticipante.ABOGADO_DEFENSOR}>
              Abogado Defensor
            </option>
            <option value={TipoParticipante.SECRETARIO}>Secretario</option>
            <option value={TipoParticipante.PSICOLOGO}>Psicólogo</option>
            <option value={TipoParticipante.FORENSE}>Forense</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="telefono"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Teléfono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="telegramChatId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Telegram Chat ID
          </label>
          <input
            type="text"
            id="telegramChatId"
            name="telegramChatId"
            value={formData.telegramChatId}
            onChange={handleChange}
            placeholder="Ingrese el Chat ID de Telegram"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            El Chat ID se obtiene cuando el usuario inicia conversación con el
            bot de Telegram
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading
            ? 'Guardando...'
            : isEditing
              ? 'Actualizar'
              : 'Crear Participante'}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: '/participantes' })}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
