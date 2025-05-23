import { gql } from 'apollo-server-express'

export const typeDefs = gql`
	type User {
		id: String!
		email: String!
		reviews: [Review!]!
	}

	type AuthResponse {
		token: String!
		user: User!
	}

	type Game {
		id: Int!
		title: String!
		reviews: [Review!]!
	}

	type Review {
		id: Int!
		content: String!
		user: User!
		game: Game!
	}

	type Query {
		me: User
		games: [Game!]!
	}

	type Mutation {
		signup(email: String!, password: String!): AuthResponse!
		login(email: String!, password: String!): AuthResponse!
		createGame(title: String!): Game!
		createReview(gameId: Int!, content: String!): Review!
		deleteReview(id: Int!): Boolean
	}
`
