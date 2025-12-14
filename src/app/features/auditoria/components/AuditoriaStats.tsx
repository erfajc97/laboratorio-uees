import { useEstadisticasAuditoria } from '../hooks/useAuditoria'
import { TipoError } from '../types'

export function AuditoriaStats() {
  const { data: stats, isLoading } = useEstadisticasAuditoria()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!stats) return null

  const getTipoErrorLabel = (tipo: TipoError) => {
    const labels: Record<TipoError, string> = {
      [TipoError.NOTIFICACION_TELEGRAM_ID_INVALIDO]: 'ID Telegram Inválido',
      [TipoError.NOTIFICACION_BOT_BLOQUEADO]: 'Bot Bloqueado',
      [TipoError.NOTIFICACION_API_ERROR]: 'Error API Notificación',
      [TipoError.PARTICIPANTE_VALIDACION]: 'Validación Participante',
      [TipoError.PARTICIPANTE_DUPLICADO]: 'Participante Duplicado',
      [TipoError.JUICIO_VALIDACION]: 'Validación Juicio',
      [TipoError.JUICIO_PARTICIPANTE_NO_ENCONTRADO]: 'Participante No Encontrado',
      [TipoError.TELEGRAM_API_ERROR]: 'Error API Telegram',
      [TipoError.DATABASE_ERROR]: 'Error Base de Datos',
      [TipoError.OTRO]: 'Otro',
    }
    return labels[tipo] || tipo
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Total de Errores
        </h3>
        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          No Resueltos
        </h3>
        <p className="text-3xl font-bold text-red-600">{stats.noResueltos}</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Resueltos</h3>
        <p className="text-3xl font-bold text-green-600">{stats.resueltos}</p>
      </div>

      {stats.porTipo.length > 0 && (
        <div className="md:col-span-3 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Errores por Tipo
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {stats.porTipo.map((item) => (
              <div key={item.tipoError} className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {item.cantidad}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {getTipoErrorLabel(item.tipoError)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

