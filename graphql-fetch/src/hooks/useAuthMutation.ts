// hooks/useAuthMutations.ts
import { useMutation } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'

const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT
if (!endpoint) {
	throw new Error('Missing VITE_GRAPHQL_ENDPOINT environment variable')
}

const SIGNUP_MUTATION = gql`
	mutation Signup($email: String!, $password: String!) {
		signup(email: $email, password: $password) {
			token
			user {
				id
				email
			}
		}
	}
`

const SIGNIN_MUTATION = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				id
				email
			}
		}
	}
`

type AuthPayload = {
	token: string
	user: {
		id: string
		email: string
	}
}

type AuthInput = {
	email: string
	password: string
}

type SignupResponse = {
	signup: AuthPayload
}

type SigninResponse = {
	login: AuthPayload
}

export function useSignupMutation() {
	return useMutation<SignupResponse, Error, AuthInput>({
		mutationFn: (input) => request(endpoint, SIGNUP_MUTATION, input),
	})
}

export function useSigninMutation() {
	return useMutation<SigninResponse, Error, AuthInput>({
		mutationFn: (input) => request(endpoint, SIGNIN_MUTATION, input),
	})
}
