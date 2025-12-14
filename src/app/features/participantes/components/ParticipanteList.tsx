import { useState } from 'react'
import { Input } from '@heroui/react'
import { useDebounce } from '../hooks/useDebounce'
import { useParticipantes } from '../hooks/useParticipantes'
import { ParticipanteCard } from './ParticipanteCard'
import { ParticipanteModal } from './ParticipanteModal'
import { DeleteParticipanteModal } from './DeleteParticipanteModal'
import type { Participante } from '../types'

export function ParticipanteList() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingParticipante, setEditingParticipante] = useState<
    Participante | undefined
  >()
  const [deletingParticipante, setDeletingParticipante] = useState<
    Participante | undefined
  >()
  const debouncedSearch = useDebounce(search, 300)
  const {
    data: participantes,
    isLoading,
    error,
  } = useParticipantes(debouncedSearch)

  const handleDelete = (participante: Participante) => {
    setDeletingParticipante(participante)
    setIsDeleteModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Error al cargar los participantes. Por favor, intente nuevamente.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <Input
          type="text"
          placeholder="Buscar por nombre, email o teléfono..."
          value={search}
          onValueChange={setSearch}
          radius="lg"
          classNames={{
            input: 'text-base',
            inputWrapper: 'bg-white',
          }}
        />
      </div>

      {!participantes || participantes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {search
              ? 'No se encontraron participantes con ese criterio'
              : 'No hay participantes registrados'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {search
              ? 'Intenta con otro término de búsqueda'
              : 'Crea un nuevo participante para comenzar'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {participantes.map((participante) => (
            <ParticipanteCard
              key={participante.id}
              participante={participante}
              onEdit={() => {
                setEditingParticipante(participante)
                setIsModalOpen(true)
              }}
              onDelete={() => handleDelete(participante)}
            />
          ))}
        </div>
      )}

      <ParticipanteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingParticipante(undefined)
        }}
        participante={editingParticipante}
      />

      <DeleteParticipanteModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        participanteId={deletingParticipante?.id}
        participanteNombre={deletingParticipante?.nombre}
      />
    </div>
  )
}
