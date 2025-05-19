import { gql } from 'apollo-server-express'

export const typeDefs = gql`
	type User {
		id: Int!
		email: String!
		reviews: [Review!]!
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
		signup(email: String!, password: String!): String!
		login(email: String!, password: String!): String!
		createGame(title: String!): Game!
		createReview(gameId: Int!, content: String!): Review!
	}
`
