import { queryOptions } from '@tanstack/react-query'
import { participantesService } from '../features/participantes/services/participantes.service'

export const participantesKeys = {
  all: ['participantes'] as const,
  lists: () => [...participantesKeys.all, 'list'] as const,
  list: (search?: string) =>
    [...participantesKeys.lists(), { search }] as const,
  detail: (id: string) => [...participantesKeys.all, id] as const,
}

export const participantesQueries = {
  all: (search?: string) =>
    queryOptions({
      queryKey: participantesKeys.list(search),
      queryFn: () => participantesService.getAll(search),
    }),
  detail: (id: string) =>
    queryOptions({
      queryKey: participantesKeys.detail(id),
      queryFn: () => participantesService.getById(id),
    }),
}
