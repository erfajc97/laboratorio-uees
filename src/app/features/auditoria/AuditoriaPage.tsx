import { AuditoriaStats } from './components/AuditoriaStats'
import { AuditoriaList } from './components/AuditoriaList'

export default function AuditoriaPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Auditoría</h1>
      <AuditoriaStats />
      <AuditoriaList />
    </div>
  )
}

