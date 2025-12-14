import { useState } from 'react'
import { Button, Select, SelectItem } from '@heroui/react'
import { useAuditoria, useMarcarResuelto } from '../hooks/useAuditoria'
import { TipoError } from '../types'

export function AuditoriaList() {
  const [filtros, setFiltros] = useState<{
    tipoError?: TipoError
    resuelto?: boolean
  }>({})
  const { data, isLoading, error } = useAuditoria(filtros)
  const marcarResuelto = useMarcarResuelto()

  const getTipoErrorLabel = (tipo: TipoError) => {
    const labels: Record<TipoError, string> = {
      [TipoError.NOTIFICACION_TELEGRAM_ID_INVALIDO]: 'ID Telegram Inválido',
      [TipoError.NOTIFICACION_BOT_BLOQUEADO]: 'Bot Bloqueado',
      [TipoError.NOTIFICACION_API_ERROR]: 'Error API Notificación',
      [TipoError.PARTICIPANTE_VALIDACION]: 'Validación Participante',
      [TipoError.PARTICIPANTE_DUPLICADO]: 'Participante Duplicado',
      [TipoError.JUICIO_VALIDACION]: 'Validación Juicio',
      [TipoError.JUICIO_PARTICIPANTE_NO_ENCONTRADO]:
        'Participante No Encontrado',
      [TipoError.TELEGRAM_API_ERROR]: 'Error API Telegram',
      [TipoError.DATABASE_ERROR]: 'Error Base de Datos',
      [TipoError.OTRO]: 'Otro',
    }
    return labels[tipo] || tipo
  }

  const getTipoErrorColor = (tipo: TipoError) => {
    if (tipo.includes('NOTIFICACION')) return 'bg-red-100 text-red-800'
    if (tipo.includes('PARTICIPANTE')) return 'bg-yellow-100 text-yellow-800'
    if (tipo.includes('JUICIO')) return 'bg-blue-100 text-blue-800'
    if (tipo.includes('TELEGRAM')) return 'bg-purple-100 text-purple-800'
    if (tipo.includes('DATABASE')) return 'bg-orange-100 text-orange-800'
    return 'bg-gray-100 text-gray-800'
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
          Error al cargar la auditoría. Por favor, intente nuevamente.
        </p>
      </div>
    )
  }

  const errores = data?.data || []

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Tipo de Error"
            placeholder="Todos"
            selectedKeys={filtros.tipoError ? [filtros.tipoError] : []}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as TipoError | undefined
              setFiltros({ ...filtros, tipoError: selected })
            }}
          >
            {Object.values(TipoError).map((tipo) => (
              <SelectItem key={tipo}>{getTipoErrorLabel(tipo)}</SelectItem>
            ))}
          </Select>

          <Select
            label="Estado"
            placeholder="Todos"
            selectedKeys={
              filtros.resuelto !== undefined
                ? [filtros.resuelto ? 'resuelto' : 'no-resuelto']
                : []
            }
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string | undefined
              setFiltros({
                ...filtros,
                resuelto:
                  selected === 'resuelto'
                    ? true
                    : selected === 'no-resuelto'
                      ? false
                      : undefined,
              })
            }}
          >
            <SelectItem key="no-resuelto">No Resuelto</SelectItem>
            <SelectItem key="resuelto">Resuelto</SelectItem>
          </Select>

          <div className="flex items-end">
            <Button
              onPress={() => setFiltros({})}
              variant="light"
              className="w-full"
            >
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {errores.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron errores con los filtros seleccionados
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {errores.map((errorItem) => (
            <div
              key={errorItem.id}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoErrorColor(errorItem.tipoError)}`}
                    >
                      {getTipoErrorLabel(errorItem.tipoError)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {errorItem.entidad}
                      {errorItem.entidadId &&
                        ` #${errorItem.entidadId.slice(0, 8)}`}
                    </span>
                    {errorItem.resuelto && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        Resuelto
                      </span>
                    )}
                  </div>
                  <p className="text-gray-900 font-medium mb-2">
                    {errorItem.mensaje}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(errorItem.createdAt).toLocaleString('es-EC')}
                  </p>
                  {errorItem.detalles && (
                    <details className="mt-3">
                      <summary className="text-sm text-gray-600 cursor-pointer">
                        Ver detalles
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                        {JSON.stringify(errorItem.detalles, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
                {!errorItem.resuelto && (
                  <Button
                    size="sm"
                    color="success"
                    onPress={() => marcarResuelto.mutate(errorItem.id)}
                    isLoading={marcarResuelto.isPending}
                  >
                    Marcar Resuelto
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
