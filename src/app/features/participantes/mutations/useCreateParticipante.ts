import { useMutation, useQueryClient } from '@tanstack/react-query'
import { participantesService } from '../services/participantes.service'
import { participantesKeys } from '../../../queries/participantes.queries'
import type { CreateParticipanteDto } from '../types'
import { ToastResponse } from '@/components/ToastResponse'

export const useCreateParticipante = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateParticipanteDto) =>
      participantesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: participantesKeys.all })
      ToastResponse('Participante creado exitosamente', 'success')
    },
    onError: (error) => {
      console.error('Error al crear participante:', error)
      ToastResponse(
        'Error al crear el participante. Por favor, intente nuevamente.',
        'error',
      )
    },
  })
}
