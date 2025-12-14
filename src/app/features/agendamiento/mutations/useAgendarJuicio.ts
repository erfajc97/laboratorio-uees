import { useMutation, useQueryClient } from '@tanstack/react-query'
import { agendamientoService } from '../services/agendamiento.service'
import type { AgendamientoData } from '../types'
import { juiciosKeys } from '@/app/queries/juicios.queries'
import { ToastResponse } from '@/components/ToastResponse'

export const useAgendarJuicio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AgendamientoData) => agendamientoService.agendar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: juiciosKeys.all })
      ToastResponse('Juicio agendado exitosamente', 'success')
    },
    onError: (error) => {
      console.error('Error al agendar juicio:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al agendar el juicio. Por favor, intente nuevamente.'
      ToastResponse(errorMessage, 'error')
    },
  })
}
