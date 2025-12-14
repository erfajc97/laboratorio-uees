import type { CreateJuicioDto } from '../../juicios/types';

export interface AgendamientoData extends Omit<CreateJuicioDto, 'participantes'> {
  participantes: Array<{
    participanteId: string;
    rol?: string;
  }>;
}

