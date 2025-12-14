import { useQuery } from '@tanstack/react-query'
import { juiciosQueries } from '../../../queries/juicios.queries'

export const useJuicios = (search?: string) => {
  return useQuery(juiciosQueries.all(search))
}

export const useJuicio = (id: string, enabled = true) => {
  return useQuery({
    ...juiciosQueries.detail(id),
    enabled: enabled && !!id,
  })
}
