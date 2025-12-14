import { useMutation, useQueryClient } from '@tanstack/react-query'
import { participantesService } from '../services/participantes.service'
import { participantesKeys } from '../../../queries/participantes.queries'
import type { UpdateParticipanteDto } from '../types'
import { ToastResponse } from '@/components/ToastResponse'

export const useUpdateParticipante = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateParticipanteDto }) =>
      participantesService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: participantesKeys.all })
      queryClient.invalidateQueries({
        queryKey: participantesKeys.detail(variables.id),
      })
      ToastResponse('Participante actualizado exitosamente', 'success')
    },
    onError: (error) => {
      console.error('Error al actualizar participante:', error)
      ToastResponse(
        'Error al actualizar el participante. Por favor, intente nuevamente.',
        'error',
      )
    },
  })
}
