import { gql } from 'graphql-request'

export const CREATE_GAME_MUTATION = gql`
	mutation CreateGame($title: String!) {
		createGame(title: $title) {
			id
			title
		}
	}
`

export const DELETE_GAME_MUTATION = gql`
	mutation DeleteGame($id: Int!) {
		deleteGame(id: $id)
	}
`
