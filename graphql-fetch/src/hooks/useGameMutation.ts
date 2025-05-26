import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphqlClient'
import { CREATE_GAME_MUTATION, DELETE_GAME_MUTATION } from '@/graphql/mutations/game'
import type { CreateGameInput, CreateGameResponse, DeleteGameInput } from '@/types/game'

export const useCreateGame = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ title, token }: CreateGameInput) => {
			graphqlClient.setHeader('Authorization', `Bearer ${token}`)
			return await graphqlClient.request<CreateGameResponse>(CREATE_GAME_MUTATION, { title })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['games'] })
		},
	})
}

export const useDeleteGame = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ gameId, token }: DeleteGameInput) => {
			graphqlClient.setHeader('Authorization', `Bearer ${token}`)
			return await graphqlClient.request(DELETE_GAME_MUTATION, { id: gameId })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['games'] })
		},
	})
}
