import { gql } from 'graphql-request'

export const GAMES_QUERY = gql`
	query Games {
		games {
			id
			title
			reviews {
				content
				user {
					id
					email
				}
			}
		}
	}
`
