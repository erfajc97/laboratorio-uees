export enum TipoError {
  NOTIFICACION_TELEGRAM_ID_INVALIDO = 'NOTIFICACION_TELEGRAM_ID_INVALIDO',
  NOTIFICACION_BOT_BLOQUEADO = 'NOTIFICACION_BOT_BLOQUEADO',
  NOTIFICACION_API_ERROR = 'NOTIFICACION_API_ERROR',
  PARTICIPANTE_VALIDACION = 'PARTICIPANTE_VALIDACION',
  PARTICIPANTE_DUPLICADO = 'PARTICIPANTE_DUPLICADO',
  JUICIO_VALIDACION = 'JUICIO_VALIDACION',
  JUICIO_PARTICIPANTE_NO_ENCONTRADO = 'JUICIO_PARTICIPANTE_NO_ENCONTRADO',
  TELEGRAM_API_ERROR = 'TELEGRAM_API_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  OTRO = 'OTRO',
}

export interface Auditoria {
  id: string;
  tipoError: TipoError;
  entidad: string;
  entidadId?: string;
  mensaje: string;
  detalles?: Record<string, unknown>;
  stackTrace?: string;
  resuelto: boolean;
  fechaResolucion?: string;
  createdAt: string;
}

export interface FiltrosAuditoria {
  tipoError?: TipoError;
  entidad?: string;
  resuelto?: boolean;
  fechaDesde?: string;
  fechaHasta?: string;
  limit?: number;
  offset?: number;
}

export interface EstadisticasAuditoria {
  total: number;
  noResueltos: number;
  resueltos: number;
  porTipo: Array<{ tipoError: TipoError; cantidad: number }>;
  porEntidad: Array<{ entidad: string; cantidad: number }>;
}

