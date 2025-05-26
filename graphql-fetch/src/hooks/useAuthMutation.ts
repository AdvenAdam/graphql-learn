import { useMutation } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphqlClient'
import { SIGNIN_MUTATION, SIGNUP_MUTATION } from '../graphql/mutations/auth'
import type { AuthInput, SignupResponse, SigninResponse } from '../types/auth'
import { useUserStore } from '@/store/userStore'

export function useSignupMutation() {
	const { setUser } = useUserStore()

	return useMutation<SignupResponse, Error, AuthInput>({
		mutationFn: (input) => graphqlClient.request(SIGNUP_MUTATION, input),
		onSuccess: ({ signup }) => {
			setUser('email', signup.user.email)
			setUser('token', signup.token)
			setUser('id', signup.user.id)
		},
		onError: (error) => {
			console.error('Signup failed:', error.message)
		},
	})
}

export function useSigninMutation() {
	const { setUser } = useUserStore()

	return useMutation<SigninResponse, Error, AuthInput>({
		mutationFn: (input) => graphqlClient.request(SIGNIN_MUTATION, input),
		onSuccess: ({ login }) => {
			setUser('email', login.user.email)
			setUser('token', login.token)
			setUser('id', login.user.id)
		},
		onError: (error) => {
			console.error('Signin failed:', error.message)
		},
	})
}
