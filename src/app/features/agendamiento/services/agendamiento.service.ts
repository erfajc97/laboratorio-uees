import { juiciosService } from '../../juicios/services/juicios.service';
import type { AgendamientoData } from '../types';
import type { Juicio } from '../../juicios/types';

export const agendamientoService = {
  agendar: async (data: AgendamientoData): Promise<Juicio> => {
    return juiciosService.create(data);
  },
};

