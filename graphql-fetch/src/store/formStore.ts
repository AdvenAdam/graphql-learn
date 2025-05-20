import { create } from 'zustand'

type LoginForm = {
	password: string
	email: string
	setField: (key: keyof LoginForm, value: string) => void
}
type SignupForm = {
	password: string
	repassword: string
	email: string
	setField: (key: keyof SignupForm, value: string) => void
}

export const useLoginFormStore = create<LoginForm>((set) => ({
	password: '',
	email: '',
	setField: (key, value) => set({ [key]: value }),
}))

export const useSignupFormStore = create<SignupForm>((set) => ({
	password: '',
	email: '',
	repassword: '',
	setField: (key, value) => set({ [key]: value }),
}))
