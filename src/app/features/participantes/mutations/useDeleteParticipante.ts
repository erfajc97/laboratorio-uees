import { useMutation, useQueryClient } from '@tanstack/react-query'
import { participantesService } from '../services/participantes.service'
import { participantesKeys } from '../../../queries/participantes.queries'
import { ToastResponse } from '@/components/ToastResponse'

export const useDeleteParticipante = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => participantesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: participantesKeys.all })
      ToastResponse('Participante eliminado exitosamente', 'success')
    },
    onError: (error) => {
      console.error('Error al eliminar participante:', error)
      ToastResponse(
        'Error al eliminar el participante. Por favor, intente nuevamente.',
        'error',
      )
    },
  })
}
