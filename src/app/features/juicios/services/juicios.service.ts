import axiosInstance from '../../../api/axios.config'
import { endpoints } from '../../../api/endpoints'
import type { CreateJuicioDto, Juicio, UpdateJuicioDto } from '../types'

export const juiciosService = {
  getAll: async (search?: string): Promise<Array<Juicio>> => {
    const params = search ? { search } : {}
    const response = await axiosInstance.get<Array<Juicio>>(
      endpoints.juicios.list,
      { params },
    )
    return response.data
  },

  getById: async (id: string): Promise<Juicio> => {
    const response = await axiosInstance.get<Juicio>(
      endpoints.juicios.getById(id),
    )
    return response.data
  },

  create: async (data: CreateJuicioDto): Promise<Juicio> => {
    const response = await axiosInstance.post<Juicio>(
      endpoints.juicios.create,
      data,
    )
    return response.data
  },

  update: async (id: string, data: UpdateJuicioDto): Promise<Juicio> => {
    const response = await axiosInstance.patch<Juicio>(
      endpoints.juicios.update(id),
      data,
    )
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(endpoints.juicios.delete(id))
  },

  addParticipante: async (
    juicioId: string,
    participanteId: string,
    rol?: string,
  ): Promise<void> => {
    await axiosInstance.post(endpoints.juicios.addParticipante(juicioId), {
      participanteId,
      rol,
    })
  },

  removeParticipante: async (
    juicioId: string,
    participanteId: string,
  ): Promise<void> => {
    await axiosInstance.delete(
      endpoints.juicios.removeParticipante(juicioId, participanteId),
    )
  },
}
