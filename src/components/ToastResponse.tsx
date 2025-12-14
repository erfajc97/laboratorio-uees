import { addToast } from '@heroui/react'

export const ToastResponse = (
  message: string,
  type: 'success' | 'error' | 'info' | 'warning',
) => {
  let color: 'success' | 'danger' | 'primary' | 'warning'

  switch (type) {
    case 'error':
      color = 'danger'
      break
    case 'info':
      color = 'primary'
      break
    case 'warning':
      color = 'warning'
      break
    default:
      color = 'success'
  }

  addToast({
    title: message,
    color: color,
    timeout: 3500,
    radius: 'sm',
  })
}
