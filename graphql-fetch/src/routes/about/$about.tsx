import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/$about')({
  component: RouteComponent,
})

function RouteComponent() {
  const { about } = Route.useParams()
  return <div>Hello "/about/{about}"!</div>
}
