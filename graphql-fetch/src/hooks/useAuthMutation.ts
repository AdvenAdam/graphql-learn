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
			setUser({
				token: signup.token,
				email: signup.user.email,
				id: signup.user.id,
			})
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
			setUser(login)
		},
		onError: (error) => {
			console.error('Signin failed:', error.message)
		},
	})
}
