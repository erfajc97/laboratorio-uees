import axiosInstance from '../../../api/axios.config'
import { endpoints } from '../../../api/endpoints'
import type {
  CreateParticipanteDto,
  Participante,
  UpdateParticipanteDto,
} from '../types'

export const participantesService = {
  getAll: async (search?: string): Promise<Array<Participante>> => {
    const params = search ? { search } : {}
    const response = await axiosInstance.get<Array<Participante>>(
      endpoints.participantes.list,
      { params },
    )
    return response.data
  },

  getById: async (id: string): Promise<Participante> => {
    const response = await axiosInstance.get<Participante>(
      endpoints.participantes.getById(id),
    )
    return response.data
  },

  create: async (data: CreateParticipanteDto): Promise<Participante> => {
    const response = await axiosInstance.post<Participante>(
      endpoints.participantes.create,
      data,
    )
    return response.data
  },

  update: async (
    id: string,
    data: UpdateParticipanteDto,
  ): Promise<Participante> => {
    const response = await axiosInstance.patch<Participante>(
      endpoints.participantes.update(id),
      data,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(endpoints.participantes.delete(id))
  },
}
