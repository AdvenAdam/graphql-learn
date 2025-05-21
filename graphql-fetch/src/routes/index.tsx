import { createFileRoute, redirect } from '@tanstack/react-router'
import { SignInForm } from '@/components/SignInForm'
import { useUserStore } from '@/store/userStore'

export const Route = createFileRoute('/')({
  loader: () => {
    const isAuthenticated = useUserStore.getState().isAuthenticated
    if (isAuthenticated()) {
      throw redirect({
        to: '/games',
      })
    }
  },
  component: App,
})


function App() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignInForm />
      </div>
    </div>
  )
}
