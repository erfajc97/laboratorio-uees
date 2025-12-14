import { Link } from '@tanstack/react-router'
import { TestTube } from 'lucide-react'

export default function Header() {
  return (
    <header className="p-4 flex items-center bg-gray-800 text-white shadow-lg">
      <div className="flex items-center gap-3">
        <TestTube size={32} className="text-blue-400" />
        <h1 className="text-xl font-semibold">
          <Link to="/">Laboratorio de Métricas</Link>
        </h1>
      </div>
    </header>
  )
}
