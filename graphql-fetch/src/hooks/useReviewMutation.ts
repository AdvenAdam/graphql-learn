import { useMutation, useQueryClient } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphqlClient'
import { CREATE_REVIEW_MUTATION } from '@/graphql/mutations/review'
import type { CreateReviewInput, CreateReviewResponse } from '@/types/review'

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
