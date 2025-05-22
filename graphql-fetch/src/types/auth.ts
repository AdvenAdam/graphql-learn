export type AuthPayload = {
	token: string
	user: {
		id: string
		email: string
	}
}

export type AuthInput = {
	email: string
	password: string
}

export type SignupResponse = {
	signup: AuthPayload
}

export type SigninResponse = {
	login: AuthPayload
}
