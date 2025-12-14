import { useMutation, useQueryClient } from '@tanstack/react-query'
import { juiciosService } from '../services/juicios.service'
import { juiciosKeys } from '../../../queries/juicios.queries'
import { ToastResponse } from '@/components/ToastResponse'

export const useDeleteJuicio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => juiciosService.delete(id),
    onSuccess: (_, deletedId) => {
      // Primero eliminar la query del detalle del caché para evitar refetches
      queryClient.removeQueries({ queryKey: juiciosKeys.detail(deletedId) })
      // Luego invalidar la lista de juicios para actualizar la UI
      queryClient.invalidateQueries({ queryKey: juiciosKeys.all })
      ToastResponse('Juicio eliminado exitosamente', 'success')
    },
    onError: (error) => {
      console.error('Error al eliminar juicio:', error)
      ToastResponse(
        'Error al eliminar el juicio. Por favor, intente nuevamente.',
        'error',
      )
    },
  })
}
