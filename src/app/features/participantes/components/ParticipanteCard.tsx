import type { Participante } from '../types'

interface ParticipanteCardProps {
  participante: Participante
  onEdit?: () => void
  onDelete?: () => void
}

export function ParticipanteCard({
  participante,
  onEdit,
  onDelete,
}: ParticipanteCardProps) {
  const tipoLabels: Record<string, string> = {
    JUEZ: 'Juez',
    ABOGADO_DEMANDANTE: 'Abogado Demandante',
    ABOGADO_DEFENSOR: 'Abogado Defensor',
    SECRETARIO: 'Secretario',
    PSICOLOGO: 'Psicólogo',
    FORENSE: 'Forense',
  }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {participante.nombre}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {tipoLabels[participante.tipo] || participante.tipo}
          </p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {participante.email && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span>{participante.email}</span>
          </div>
        )}
        {participante.telefono && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Teléfono:</span>
            <span>{participante.telefono}</span>
          </div>
        )}
        {participante.telegramChatId && (
          <div className="flex items-center gap-2">
            <span className="font-medium">Telegram ID:</span>
            <span className="text-xs font-mono">
              {participante.telegramChatId}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
