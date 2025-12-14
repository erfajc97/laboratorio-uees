import { useAgendarJuicio } from '../mutations/useAgendarJuicio';

export const useAgendamiento = () => {
  const agendarMutation = useAgendarJuicio();

  return {
    agendar: agendarMutation.mutateAsync,
    isLoading: agendarMutation.isPending,
    error: agendarMutation.error,
  };
};

