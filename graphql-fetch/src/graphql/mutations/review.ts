import { gql } from 'graphql-request'

export const CREATE_REVIEW_MUTATION = gql`
	mutation CreateReview($gameId: Int!, $content: String!) {
		createReview(gameId: $gameId, content: $content) {
			id
			content
			user {
				id
				email
			}
			game {
				id
				title
			}
		}
	}
`

export const DELETE_REVIEW_MUTATION = gql`
	mutation DeleteReview($id: Int!) {
		deleteReview(id: $id)
	}
`
