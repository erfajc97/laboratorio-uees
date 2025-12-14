import { useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate({ to: '/' })}
      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors mb-4"
    >
      <ArrowLeft size={20} />
      <span>Volver al inicio</span>
    </button>
  )
}
