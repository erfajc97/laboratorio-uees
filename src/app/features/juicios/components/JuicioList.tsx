import { useState } from 'react'
import { Input } from '@heroui/react'
import { useDebounce } from '../../participantes/hooks/useDebounce'
import { useJuicios } from '../hooks/useJuicios'
import { JuicioCard } from './JuicioCard'
import { DeleteJuicioModal } from './DeleteJuicioModal'
import type { Juicio } from '../types'

export function JuicioList() {
  const [search, setSearch] = useState('')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingJuicio, setDeletingJuicio] = useState<Juicio | undefined>()
  const debouncedSearch = useDebounce(search, 300)
  const { data: juicios, isLoading, error } = useJuicios(debouncedSearch)

  const handleDelete = (juicio: Juicio) => {
    setDeletingJuicio(juicio)
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
          Error al cargar los juicios. Por favor, intente nuevamente.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <Input
          type="text"
          placeholder="Buscar por número de caso, tipo de juicio o descripción..."
          value={search}
          onValueChange={setSearch}
          radius="lg"
          classNames={{
            input: 'text-base',
            inputWrapper: 'bg-white',
          }}
        />
      </div>

      {!juicios || juicios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {search
              ? 'No se encontraron juicios con ese criterio'
              : 'No hay juicios registrados'}
          </p>
          <p className="text-gray-400 text-sm mt-2">
            {search
              ? 'Intenta con otro término de búsqueda'
              : 'Crea un nuevo juicio para comenzar'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {juicios.map((juicio) => (
            <JuicioCard
              key={juicio.id}
              juicio={juicio}
              onDelete={() => handleDelete(juicio)}
            />
          ))}
        </div>
      )}

      <DeleteJuicioModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        juicioId={deletingJuicio?.id}
        juicioNumeroCaso={deletingJuicio?.numeroCaso}
      />
    </div>
  )
}
