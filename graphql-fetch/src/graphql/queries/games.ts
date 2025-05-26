import { gql } from 'graphql-request'

export const GAMES_QUERY = gql`
	query Games {
		games {
			id
			title
			reviews {
				id
				content
				user {
					id
					email
				}
			}
		}
	}
`
