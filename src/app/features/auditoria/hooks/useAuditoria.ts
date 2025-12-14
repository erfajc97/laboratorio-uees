import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { auditoriaService } from '../services/auditoria.service'
import type { FiltrosAuditoria } from '../types'

export function useAuditoria(filtros?: FiltrosAuditoria) {
  return useQuery({
    queryKey: ['auditoria', filtros],
    queryFn: () => auditoriaService.getAll(filtros),
  })
}

export function useAuditoriaById(id: string) {
  return useQuery({
    queryKey: ['auditoria', id],
    queryFn: () => auditoriaService.getById(id),
    enabled: !!id,
  })
}

export function useEstadisticasAuditoria() {
  return useQuery({
    queryKey: ['auditoria', 'estadisticas'],
    queryFn: () => auditoriaService.getEstadisticas(),
  })
}

export function useMarcarResuelto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => auditoriaService.marcarResuelto(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auditoria'] })
    },
  })
}

