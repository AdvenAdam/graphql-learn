import { queryClient } from '@/lib/queryClient'
import { useUserStore } from '@/store/userStore'

export const useIsAuthenticated = () => {
	const token = useUserStore((state) => state.token)
	return Boolean(token && token.length > 0)
}
export function logout() {
	localStorage.clear()
	useUserStore.getState().reset()
	queryClient.clear()
}
