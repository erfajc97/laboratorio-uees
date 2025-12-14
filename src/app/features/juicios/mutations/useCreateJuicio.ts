import { useMutation, useQueryClient } from '@tanstack/react-query'
import { juiciosKeys } from '../../../queries/juicios.queries'
import { juiciosService } from '../services/juicios.service'
import type { CreateJuicioDto } from '../types'

export const useCreateJuicio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateJuicioDto) => juiciosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: juiciosKeys.all })
    },
  })
}
