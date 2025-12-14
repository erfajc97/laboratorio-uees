import { createFileRoute } from '@tanstack/react-router'
import MetricsPage from '../app/features/metrics/MetricsPage'

export const Route = createFileRoute('/metrics')({
  component: MetricsPage,
})

