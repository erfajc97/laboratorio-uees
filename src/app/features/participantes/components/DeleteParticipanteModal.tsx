import React from 'react'
import { Button } from '@heroui/react'
import { useDeleteParticipante } from '../mutations/useDeleteParticipante'
import CustomModalNextUI from '@/components/UI/CustomModalNextUI'

interface DeleteParticipanteModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  participanteId: string | null | undefined
  participanteNombre?: string
}

export const DeleteParticipanteModal: React.FC<
  DeleteParticipanteModalProps
> = ({ isOpen, onOpenChange, participanteId, participanteNombre }) => {
  const deleteMutation = useDeleteParticipante()

  const handleDelete = async () => {
    if (!participanteId) return

    try {
      await deleteMutation.mutateAsync(participanteId)
      // El ToastResponse ya se maneja en la mutation
      onOpenChange(false)
    } catch (error) {
      console.error('Error al eliminar participante:', error)
      // El ToastResponse ya se maneja en la mutation
    }
  }

  return (
    <CustomModalNextUI
      size="md"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      headerContent={
        <h3 className="text-xl font-bold">Eliminar Participante</h3>
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
        ¿Está seguro de eliminar al participante{' '}
        <strong>{participanteNombre || 'este participante'}</strong>? Esta
        acción no se puede deshacer.
      </p>
    </CustomModalNextUI>
  )
}
