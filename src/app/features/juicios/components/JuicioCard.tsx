import { useState } from 'react'
import { JuicioDetailModal } from './JuicioDetailModal'
import type { Juicio } from '../types'

interface JuicioCardProps {
  juicio: Juicio
  onDelete?: () => void
}

export function JuicioCard({ juicio, onDelete }: JuicioCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fecha = new Date(juicio.fecha).toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const participantesCount = juicio.participantes?.length || 0

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete()
    }
  }

  return (
    <>
      <div
        onClick={() => setIsModalOpen(true)}
        className="block p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {juicio.numeroCaso}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{juicio.tipoJuicio}</p>
          </div>
          <div className="flex gap-2 items-start">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                juicio.estado === 'PROGRAMADO'
                  ? 'bg-blue-100 text-blue-800'
                  : juicio.estado === 'EN_CURSO'
                    ? 'bg-yellow-100 text-yellow-800'
                    : juicio.estado === 'COMPLETADO'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
              }`}
            >
              {juicio.estado}
            </span>
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-medium">Fecha:</span>
            <span>{fecha}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Hora:</span>
            <span>{juicio.hora}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Sala:</span>
            <span>{juicio.sala}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Participantes:</span>
            <span>{participantesCount}</span>
          </div>
        </div>

        {juicio.descripcion && (
          <p className="mt-4 text-sm text-gray-500 line-clamp-2">
            {juicio.descripcion}
          </p>
        )}
      </div>

      <JuicioDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        juicio={juicio}
      />
    </>
  )
}
