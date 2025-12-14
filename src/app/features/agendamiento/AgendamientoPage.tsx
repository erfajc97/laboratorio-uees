import { BackButton } from '../../../components/BackButton'
import { AgendamientoForm } from './components/AgendamientoForm'

export function AgendamientoPage() {
  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agendar Juicio</h1>
          <p className="text-gray-600 mt-1 text-sm">
            Complete el formulario para agendar un nuevo juicio
          </p>
        </div>
        <BackButton />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-4">
        <AgendamientoForm />
      </div>
    </div>
  )
}
