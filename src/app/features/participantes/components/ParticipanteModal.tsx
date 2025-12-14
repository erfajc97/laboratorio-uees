import { useEffect } from 'react'
import { Form } from 'antd'
import { Button, Input, Select, SelectItem } from '@heroui/react'
import { useCreateParticipante } from '../mutations/useCreateParticipante'
import { useUpdateParticipante } from '../mutations/useUpdateParticipante'
import { TipoParticipante } from '../types'
import type { CreateParticipanteDto, Participante } from '../types'
import CustomModalNextUI from '@/components/UI/CustomModalNextUI'

interface ParticipanteModalProps {
  isOpen: boolean
  onClose: () => void
  participante?: Participante
}

export function ParticipanteModal({
  isOpen,
  onClose,
  participante,
}: ParticipanteModalProps) {
  const [form] = Form.useForm()
  const telegramChatId = Form.useWatch('telegramChatId', form)
  const createMutation = useCreateParticipante()
  const updateMutation = useUpdateParticipante()

  // Reset form when modal opens/closes or participante changes
  useEffect(() => {
    if (isOpen) {
      if (participante) {
        form.setFieldsValue({
          nombre: participante.nombre || '',
          email: participante.email || '',
          telefono: participante.telefono || '',
          tipo: participante.tipo,
          telegramChatId: participante.telegramChatId ?? '',
        })
      } else {
        form.resetFields()
        form.setFieldsValue({
          tipo: TipoParticipante.JUEZ,
        })
      }
    }
  }, [isOpen, participante, form])

  const handleFinish = async (values: CreateParticipanteDto) => {
    try {
      if (participante) {
        await updateMutation.mutateAsync({
          id: participante.id,
          data: values,
        })
      } else {
        await createMutation.mutateAsync(values)
      }
      onClose()
    } catch (error) {
      console.error('Error al guardar participante:', error)
      // El ToastResponse ya se maneja en las mutations
    }
  }

  const handleFieldsChange = () => {
    // Manejar cambios de campos si es necesario
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  const tipoOptions = [
    { label: 'Juez', value: TipoParticipante.JUEZ },
    { label: 'Abogado Demandante', value: TipoParticipante.ABOGADO_DEMANDANTE },
    { label: 'Abogado Defensor', value: TipoParticipante.ABOGADO_DEFENSOR },
    { label: 'Secretario', value: TipoParticipante.SECRETARIO },
    { label: 'Psicólogo', value: TipoParticipante.PSICOLOGO },
    { label: 'Forense', value: TipoParticipante.FORENSE },
  ]

  return (
    <CustomModalNextUI
      isOpen={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          onClose()
        }
      }}
      isDismissable
      size="xl"
      placement="top-center"
      headerContent={
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {participante ? 'Editar Participante' : 'Nuevo Participante'}
        </h2>
      }
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        onFieldsChange={handleFieldsChange}
        variant="filled"
        noValidate
      >
        <div className="flex flex-col py-2 sm:py-3">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-x-6">
            <Form.Item
              name="nombre"
              rules={[{ required: true, message: 'Ingresar el nombre' }]}
            >
              <Input
                label="Nombre"
                placeholder="Ingresa el nombre"
                labelPlacement="outside"
                radius="lg"
                isRequired
              />
            </Form.Item>

            <Form.Item
              name="tipo"
              rules={[{ required: true, message: 'Seleccionar el tipo' }]}
            >
              <Select
                label="Tipo"
                placeholder="Selecciona el tipo"
                labelPlacement="outside"
                radius="lg"
                isRequired
                selectedKeys={[
                  form.getFieldValue('tipo') || TipoParticipante.JUEZ,
                ]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  form.setFieldValue('tipo', selected)
                }}
              >
                {tipoOptions.map((item) => (
                  <SelectItem key={item.value}>{item.label}</SelectItem>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="email">
              <Input
                label="Email"
                placeholder="Ingresa el email"
                labelPlacement="outside"
                radius="lg"
                type="email"
              />
            </Form.Item>

            <Form.Item name="telefono">
              <Input
                label="Teléfono"
                placeholder="Ingresa el teléfono"
                labelPlacement="outside"
                radius="lg"
                type="tel"
              />
            </Form.Item>

            <Form.Item name="telegramChatId" className="col-span-full">
              <Input
                label="Telegram Chat ID"
                placeholder="Ingrese el Chat ID de Telegram"
                labelPlacement="outside"
                radius="lg"
                value={telegramChatId ?? ''}
                onValueChange={(value) => {
                  form.setFieldValue('telegramChatId', value)
                }}
              />
              <p className="mt-1 text-xs text-gray-500">
                El Chat ID se obtiene cuando el usuario inicia conversación con
                el bot de Telegram
              </p>
            </Form.Item>
          </div>

          <div className="flex gap-x-2 ml-auto mt-6">
            <Button
              color="default"
              variant="light"
              onPress={onClose}
              radius="lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              radius="lg"
              className="h-[2.2rem] bg-gray-800 text-white hover:bg-gray-700"
              isLoading={isLoading}
            >
              {participante ? 'Actualizar' : 'Crear'} Participante
            </Button>
          </div>
        </div>
      </Form>
    </CustomModalNextUI>
  )
}
