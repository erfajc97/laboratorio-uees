import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCreateJuicio } from '../mutations/useCreateJuicio'
import { useUpdateJuicio } from '../mutations/useUpdateJuicio'
import { EstadoJuicio } from '../types'
import type { CreateJuicioDto, Juicio } from '../types'

interface JuicioFormProps {
  juicio?: Juicio
  onSuccess?: () => void
}

export function JuicioForm({ juicio, onSuccess }: JuicioFormProps) {
  const navigate = useNavigate()
  const isEditing = !!juicio
  const createMutation = useCreateJuicio()
  const updateMutation = useUpdateJuicio()

  const [formData, setFormData] = useState<CreateJuicioDto>({
    numeroCaso: juicio?.numeroCaso || '',
    tipoJuicio: juicio?.tipoJuicio || '',
    fecha: juicio?.fecha ? juicio.fecha.split('T')[0] : '',
    hora: juicio?.hora || '',
    sala: juicio?.sala || '',
    descripcion: juicio?.descripcion || '',
    estado: juicio?.estado || EstadoJuicio.PROGRAMADO,
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: juicio.id,
          data: formData,
        })
      } else {
        await createMutation.mutateAsync(formData)
      }

      onSuccess?.()
      navigate({ to: '/juicios' })
    } catch (error) {
      console.error('Error al guardar juicio:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
            htmlFor="numeroCaso"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Número de Caso *
          </label>
          <input
            type="text"
            id="numeroCaso"
            name="numeroCaso"
            value={formData.numeroCaso}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="tipoJuicio"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tipo de Juicio *
          </label>
          <input
            type="text"
            id="tipoJuicio"
            name="tipoJuicio"
            value={formData.tipoJuicio}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="fecha"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fecha *
          </label>
          <input
            type="date"
            id="fecha"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="hora"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Hora *
          </label>
          <input
            type="time"
            id="hora"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="sala"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Sala *
          </label>
          <input
            type="text"
            id="sala"
            name="sala"
            value={formData.sala}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="estado"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Estado
          </label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={EstadoJuicio.PROGRAMADO}>Programado</option>
            <option value={EstadoJuicio.EN_CURSO}>En Curso</option>
            <option value={EstadoJuicio.COMPLETADO}>Completado</option>
            <option value={EstadoJuicio.CANCELADO}>Cancelado</option>
            <option value={EstadoJuicio.REAGENDADO}>Reagendado</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="descripcion"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
              : 'Crear Juicio'}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: '/juicios' })}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
