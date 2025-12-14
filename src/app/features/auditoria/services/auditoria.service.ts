import axiosInstance from '../../../api/axios.config'
import { endpoints } from '../../../api/endpoints'
import type {
  Auditoria,
  FiltrosAuditoria,
  EstadisticasAuditoria,
} from '../types'

export const auditoriaService = {
  async getAll(filtros?: FiltrosAuditoria) {
    const params: Record<string, string> = {}
    if (filtros?.tipoError) params.tipoError = filtros.tipoError
    if (filtros?.entidad) params.entidad = filtros.entidad
    if (filtros?.resuelto !== undefined)
      params.resuelto = filtros.resuelto.toString()
    if (filtros?.fechaDesde) params.fechaDesde = filtros.fechaDesde
    if (filtros?.fechaHasta) params.fechaHasta = filtros.fechaHasta
    if (filtros?.limit) params.limit = filtros.limit.toString()
    if (filtros?.offset) params.offset = filtros.offset.toString()

    const response = await axiosInstance.get<{
      data: Auditoria[]
      total: number
      limit: number
      offset: number
    }>(endpoints.auditoria.list, { params })
    return response.data
  },

  async getById(id: string) {
    const response = await axiosInstance.get<Auditoria>(
      endpoints.auditoria.getById(id),
    )
    return response.data
  },

  async marcarResuelto(id: string) {
    const response = await axiosInstance.patch(
      endpoints.auditoria.marcarResuelto(id),
    )
    return response.data
  },

  async getEstadisticas() {
    const response = await axiosInstance.get<EstadisticasAuditoria>(
      endpoints.auditoria.estadisticas,
    )
    return response.data
  },
}

