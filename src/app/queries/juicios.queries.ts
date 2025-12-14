import { queryOptions } from '@tanstack/react-query'
import { juiciosService } from '../features/juicios/services/juicios.service'

export const juiciosKeys = {
  all: ['juicios'] as const,
  lists: () => [...juiciosKeys.all, 'list'] as const,
  list: (search?: string) => [...juiciosKeys.lists(), { search }] as const,
  detail: (id: string) => [...juiciosKeys.all, id] as const,
}

export const juiciosQueries = {
  all: (search?: string) =>
    queryOptions({
      queryKey: juiciosKeys.list(search),
      queryFn: () => juiciosService.getAll(search),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: juiciosKeys.detail(id),
      queryFn: () => juiciosService.getById(id),
      retry: (failureCount, error) => {
        // No reintentar si es un error 404 (juicio no encontrado)
        const httpError = error as { statusCode?: number }
        if (httpError.statusCode === 404) {
          return false
        }
        // Reintentar hasta 2 veces para otros errores
        return failureCount < 2
      },
    }),
}
