// routes/logout.tsx
import { createRoute, redirect, } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { logout } from '@/hooks/useAuth';
import { toast } from 'sonner';


export const Route = createRoute({
  path: '/logout',
  getParentRoute: () => rootRoute,
  beforeLoad: async () => {
    logout(); // Clear localStorage and Zustand
    toast.success('logout success!')
    return redirect({ to: '/' });

  },
  component: () => null,
});