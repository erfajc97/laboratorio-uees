import { useMutation, useQueryClient } from '@tanstack/react-query'
import { juiciosService } from '../services/juicios.service'
import type { UpdateJuicioDto } from '../types'
import { juiciosKeys } from '@/app/queries/juicios.queries'

export const useUpdateJuicio = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateJuicioDto }) =>
      juiciosService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: juiciosKeys.all })
      queryClient.invalidateQueries({
        queryKey: juiciosKeys.detail(variables.id),
      })
    },
  })
}
