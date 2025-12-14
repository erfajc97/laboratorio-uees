import { useState } from 'react'
import { Form } from 'antd'
import { useNavigate } from '@tanstack/react-router'
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react'

import { EstadoJuicio } from '../../juicios/types'
import { useAgendamiento } from '../hooks/useAgendamiento'
import { ParticipantesSelector } from './ParticipantesSelector'
import type { AgendamientoData } from '../types'
import { ToastResponse } from '@/components/ToastResponse'

export function AgendamientoForm() {
  const navigate = useNavigate()
  const { agendar, isLoading } = useAgendamiento()
  const [form] = Form.useForm()

  const [selectedParticipantes, setSelectedParticipantes] = useState<
    Array<string>
  >([])

  const handleFinish = async (
    values: Omit<AgendamientoData, 'participantes'>,
  ) => {
    if (selectedParticipantes.length === 0) {
      ToastResponse('Por favor, seleccione al menos un participante', 'warning')
      return
    }

    try {
      // Asegurar que la fecha esté en formato ISO (YYYY-MM-DD)
      // El input type="date" ya devuelve el formato YYYY-MM-DD
      let fechaISO = values.fecha || ''

      // Validar que la fecha no esté vacía
      if (!fechaISO) {
        ToastResponse('Por favor, ingrese una fecha válida', 'warning')
        return
      }

      // Si la fecha viene en formato DD/MM/YYYY, convertirla a YYYY-MM-DD
      if (fechaISO.includes('/')) {
        const [day, month, year] = fechaISO.split('/')
        fechaISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }

      // Validar formato de fecha ISO
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(fechaISO)) {
        ToastResponse('Formato de fecha inválido. Use YYYY-MM-DD', 'error')
        return
      }

      const data: AgendamientoData = {
        numeroCaso: (values.numeroCaso || '').trim(),
        tipoJuicio: (values.tipoJuicio || '').trim(),
        fecha: fechaISO,
        hora: (values.hora || '').trim(),
        sala: (values.sala || '').trim(),
        descripcion: values.descripcion ? values.descripcion.trim() : undefined,
        estado: values.estado || EstadoJuicio.PROGRAMADO,
        participantes: selectedParticipantes.map((id) => ({
          participanteId: id.trim(),
        })),
      }

      // Validar campos requeridos
      if (
        !data.numeroCaso ||
        !data.tipoJuicio ||
        !data.fecha ||
        !data.hora ||
        !data.sala
      ) {
        ToastResponse(
          'Por favor, complete todos los campos requeridos',
          'warning',
        )
        return
      }

      console.log('Enviando datos al backend:', JSON.stringify(data, null, 2))

      await agendar(data)
      // El ToastResponse ya se maneja en la mutation
      navigate({ to: '/juicios' })
    } catch (error) {
      console.error('Error al agendar juicio:', error)
      // El ToastResponse ya se maneja en la mutation
    }
  }

  const estadoOptions = [
    { label: 'Programado', value: EstadoJuicio.PROGRAMADO },
    { label: 'En Curso', value: EstadoJuicio.EN_CURSO },
    { label: 'Completado', value: EstadoJuicio.COMPLETADO },
    { label: 'Cancelado', value: EstadoJuicio.CANCELADO },
    { label: 'Reagendado', value: EstadoJuicio.REAGENDADO },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <Form
        layout="vertical"
        form={form}
        onFinish={handleFinish}
        variant="filled"
        noValidate
        initialValues={{
          estado: EstadoJuicio.PROGRAMADO,
        }}
      >
        <div className="flex flex-col py-1">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-1 sm:gap-x-4">
            <Form.Item
              name="numeroCaso"
              rules={[
                { required: true, message: 'Ingresar el número de caso' },
              ]}
            >
              <Input
                label="Número de Caso"
                placeholder="Ingresa el número de caso"
                labelPlacement="outside"
                radius="lg"
                isRequired
              />
            </Form.Item>

            <Form.Item
              name="tipoJuicio"
              rules={[
                { required: true, message: 'Ingresar el tipo de juicio' },
              ]}
            >
              <Input
                label="Tipo de Juicio"
                placeholder="Ingresa el tipo de juicio"
                labelPlacement="outside"
                radius="lg"
                isRequired
              />
            </Form.Item>

            <Form.Item
              name="fecha"
              rules={[{ required: true, message: 'Ingresar la fecha' }]}
            >
              <Input
                label="Fecha"
                placeholder="YYYY-MM-DD"
                labelPlacement="outside"
                radius="lg"
                type="date"
                isRequired
              />
            </Form.Item>

            <Form.Item
              name="hora"
              rules={[{ required: true, message: 'Ingresar la hora' }]}
            >
              <Input
                label="Hora"
                placeholder="HH:MM"
                labelPlacement="outside"
                radius="lg"
                type="time"
                isRequired
              />
            </Form.Item>

            <Form.Item
              name="sala"
              rules={[{ required: true, message: 'Ingresar la sala' }]}
            >
              <Input
                label="Sala"
                placeholder="Ingresa la sala"
                labelPlacement="outside"
                radius="lg"
                isRequired
              />
            </Form.Item>

            <Form.Item name="estado">
              <Select
                label="Estado"
                placeholder="Selecciona el estado"
                labelPlacement="outside"
                radius="lg"
                selectedKeys={[
                  form.getFieldValue('estado') || EstadoJuicio.PROGRAMADO,
                ]}
                onSelectionChange={(keys) => {
                  const selected = Array.from(keys)[0] as string
                  form.setFieldValue('estado', selected)
                }}
              >
                {estadoOptions.map((item) => (
                  <SelectItem key={item.value}>{item.label}</SelectItem>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="descripcion" className="col-span-full">
              <Textarea
                label="Descripción"
                placeholder="Ingresa la descripción del juicio"
                labelPlacement="outside"
                radius="lg"
                maxRows={4}
                minRows={2}
              />
            </Form.Item>

            <Form.Item
              name="participantes"
              className="col-span-full"
              rules={[
                {
                  validator: () => {
                    if (selectedParticipantes.length === 0) {
                      return Promise.reject(
                        new Error('Seleccione al menos un participante'),
                      )
                    }
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Participantes <span className="text-red-500">*</span>
                </label>
                <ParticipantesSelector
                  selected={selectedParticipantes}
                  onChange={setSelectedParticipantes}
                />
                {selectedParticipantes.length > 0 && (
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedParticipantes.length} participante(s)
                    seleccionado(s)
                  </p>
                )}
              </div>
            </Form.Item>
          </div>

          <div className="flex gap-x-2 ml-auto mt-4">
            <Button
              color="default"
              variant="light"
              onPress={() => navigate({ to: '/' })}
              radius="lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              radius="lg"
              className="h-[2.2rem] bg-gray-800 text-white hover:bg-gray-700"
              isLoading={isLoading}
              isDisabled={selectedParticipantes.length === 0}
            >
              Agendar Juicio
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
