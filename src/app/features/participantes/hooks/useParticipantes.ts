import { useQuery } from '@tanstack/react-query'
import { participantesQueries } from '../../../queries/participantes.queries'

export const useParticipantes = (search?: string) => {
  return useQuery(participantesQueries.all(search))
}

export const useParticipante = (id: string) => {
  return useQuery(participantesQueries.detail(id))
}
