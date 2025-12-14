import React from 'react'
import { Button } from '@heroui/react'
import { useDeleteJuicio } from '../mutations/useDeleteJuicio'
import CustomModalNextUI from '@/components/UI/CustomModalNextUI'

interface DeleteJuicioModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  juicioId: string | null | undefined
  juicioNumeroCaso?: string
}

export const DeleteJuicioModal: React.FC<DeleteJuicioModalProps> = ({
  isOpen,
  onOpenChange,
  juicioId,
  juicioNumeroCaso,
}) => {
  const deleteMutation = useDeleteJuicio()

  const handleDelete = async () => {
    if (!juicioId) return

    try {
      await deleteMutation.mutateAsync(juicioId)
      // El ToastResponse ya se maneja en la mutation
      onOpenChange(false)
    } catch (error) {
      console.error('Error al eliminar juicio:', error)
      // El ToastResponse ya se maneja en la mutation
    }
  }

  return (
    <CustomModalNextUI
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      headerContent={<h3 className="text-xl font-bold">Eliminar Juicio</h3>}
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
        ¿Está seguro de eliminar el juicio{' '}
        <strong>{juicioNumeroCaso || 'este juicio'}</strong>? Esta acción no se
        puede deshacer.
      </p>
    </CustomModalNextUI>
  )
}
