export type CreateReviewInput = {
	token: string
	gameId: number
	content: string
}
export type DeleteReviewInput = {
	token: string
	reviewId: number
}

export type CreateReviewVariables = {
	gameId: number
	content: string
}

export type CreateReviewResponse = {
	createReview: {
		id: number
		content: string
		user: {
			id: number
			email: string
		}
		game: {
			id: number
			title: string
		}
	}
}
