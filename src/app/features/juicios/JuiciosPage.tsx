import { BackButton } from '../../../components/BackButton'
import { JuicioList } from './components/JuicioList'

export function JuiciosPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Juicios</h1>
      </div>

      <JuicioList />
    </div>
  )
}
