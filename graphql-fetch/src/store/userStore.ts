import { create } from 'zustand'

type UserState = {
	email: string
	id: string
	token: string
}

type StoreState = UserState & {
	setUser: (key: keyof UserState | Partial<UserState>, value?: string) => void
	reset: () => void
	isAuthenticated: () => boolean
}

const getInitialUserState = (): UserState => ({
	email: localStorage.getItem('email') ?? '',
	id: localStorage.getItem('idUser') ?? '',
	token: localStorage.getItem('token') ?? '',
})

export const useUserStore = create<StoreState>((set, get) => ({
	...getInitialUserState(),

	setUser: (key, value) => {
		if (typeof key === 'string') {
			set((state) => ({ ...state, [key]: value! }))
			localStorage.setItem(key === 'id' ? 'idUser' : key, value!)
		} else {
			set((state) => ({ ...state, ...key }))
			Object.entries(key).forEach(([k, v]) => localStorage.setItem(k === 'id' ? 'idUser' : k, v))
		}
	},

	reset: () => {
		set({ email: '', id: '', token: '' })
		localStorage.removeItem('email')
		localStorage.removeItem('idUser')
		localStorage.removeItem('token')
	},

	isAuthenticated: () => !!get().token,
}))
