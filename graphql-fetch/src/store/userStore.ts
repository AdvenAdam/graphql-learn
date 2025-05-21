import { create } from 'zustand'

type UserState = {
	email: string
	id: string
	token: string
}

type SetUser = {
	<K extends keyof UserState>(key: K, value: UserState[K]): void
	(values: Partial<UserState>): void
}

type StoreState = UserState & {
	setUser: SetUser
	reset: () => void
	isAuthenticated: () => boolean
}

// Load initial state from localStorage
const getInitialUserState = (): UserState => {
	const token = localStorage.getItem('token') ?? ''
	const email = localStorage.getItem('email') ?? ''
	const id = localStorage.getItem('idUser') ?? ''
	return { token, email, id }
}

export const useUserStore = create<StoreState>((set, get) => {
	const initialUser = getInitialUserState()

	const setUser: SetUser = ((...args: [keyof UserState, string] | [Partial<UserState>]) => {
		if (typeof args[0] === 'string') {
			// Single field update
			const [key, value] = args as [keyof UserState, string]
			set((state) => ({ ...state, [key]: value }))
			if (key === 'id') {
				localStorage.setItem('idUser', value)
			} else {
				localStorage.setItem(key, value)
			}
		} else {
			// Partial update, batch localStorage writes
			const [partial] = args as [Partial<UserState>]
			set((state) => ({ ...state, ...partial }))
			Object.entries(partial).forEach(([key, value]) => {
				if (key === 'id') {
					localStorage.setItem('idUser', value)
				} else {
					localStorage.setItem(key, value)
				}
			})
		}
	}) as SetUser

	return {
		...initialUser,
		setUser,
		reset: () => {
			set({ email: '', id: '', token: '' })
			localStorage.removeItem('email')
			localStorage.removeItem('idUser')
			localStorage.removeItem('token')
		},
		isAuthenticated: () => {
			const token = get().token
			return Boolean(token && token.length > 0)
		},
	}
})
