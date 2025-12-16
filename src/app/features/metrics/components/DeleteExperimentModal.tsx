import React from 'react'
import { Button } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { metricsService } from '../services/metrics.service'
import CustomModalNextUI from '@/components/UI/CustomModalNextUI'
import { ToastResponse } from '@/components/ToastResponse'

interface DeleteExperimentModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  experimentId: string | null | undefined
  experimentName?: string
  onDeleteSuccess?: () => void
}

export const DeleteExperimentModal: React.FC<DeleteExperimentModalProps> = ({
  isOpen,
  onOpenChange,
  experimentId,
  experimentName,
  onDeleteSuccess,
}) => {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => metricsService.deleteExperiment(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['experiments'] })
      ToastResponse('Experimento eliminado exitosamente', 'success')
      onOpenChange(false)
      if (onDeleteSuccess) {
        onDeleteSuccess()
      }
    },
    onError: (error) => {
      console.error('Error al eliminar experimento:', error)
      let errorMessage =
        'Error al eliminar el experimento. Por favor, intente nuevamente.'

      if (error instanceof Error) {
        errorMessage = error.message
      } else {
        const axiosError = error as any
        if (axiosError?.response?.data?.message) {
          errorMessage = axiosError.response.data.message
        } else if (axiosError?.response?.statusText) {
          errorMessage = `${axiosError.response.status} - ${axiosError.response.statusText}`
        } else if (axiosError?.message) {
          errorMessage = axiosError.message
        }
      }

      ToastResponse(errorMessage, 'error')
    },
  })

  const handleDelete = async () => {
    if (!experimentId) return

    try {
      await deleteMutation.mutateAsync(experimentId)
    } catch (error) {
      // El error ya se maneja en onError de la mutation
      console.error('Error al eliminar experimento:', error)
    }
  }

  return (
    <CustomModalNextUI
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      headerContent={
        <h3 className="text-xl font-bold">Eliminar Experimento</h3>
      }
      footerContent={
        <>
          <Button
            color="danger"
            onPress={handleDelete}
            isLoading={deleteMutation.isPending}
            radius="lg"
          >
            Eliminar
          </Button>
          <Button
            color="default"
            variant="light"
            onPress={() => onOpenChange(false)}
            radius="lg"
          >
            Cancelar
          </Button>
        </>
      }
    >
      <p className="text-gray-700">
        ¿Está seguro de eliminar el experimento{' '}
        <strong>{experimentName || 'este experimento'}</strong>? Esta acción no
        se puede deshacer.
      </p>
    </CustomModalNextUI>
  )
}
