export type DeleteGameInput = {
	gameId: number
	token: string
}
export type CreateGameInput = {
	title: string
	token: string
}

export type Game = {
	id: number
	title: string
	reviews: {
		id: string
		content: string
		user: {
			id: string
			email: string
		}
	}
}

export type CreateGameResponse = {
	createGame: Game[]
}
