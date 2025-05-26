import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphqlClient'
import { CREATE_REVIEW_MUTATION, DELETE_REVIEW_MUTATION } from '@/graphql/mutations/review'
import type { CreateReviewInput, CreateReviewResponse, DeleteReviewInput } from '@/types/review'

export const useCreateReview = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ gameId, content, token }: CreateReviewInput) => {
			graphqlClient.setHeader('Authorization', `Bearer ${token}`)
			return await graphqlClient.request<CreateReviewResponse>(CREATE_REVIEW_MUTATION, { gameId, content })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['games'] })
		},
	})
}

export const useDeleteReview = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({ reviewId, token }: DeleteReviewInput) => {
			console.log('🚀 ~ mutationFn: ~ reviewId:', reviewId)
			graphqlClient.setHeader('Authorization', `Bearer ${token}`)
			return await graphqlClient.request(DELETE_REVIEW_MUTATION, { id: reviewId })
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['games'] })
		},
	})
}
