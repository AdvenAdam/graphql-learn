import { useQuery } from '@tanstack/react-query'
import { graphqlClient } from '../lib/graphqlClient'
import { GAMES_QUERY } from '@/graphql/queries/games'
import type { Game } from '@/types/game'

type GamesResponse = {
	games: Game[]
}

export const useGames = (token: string) =>
	useQuery({
		queryKey: ['games'],
		queryFn: async () => {
			graphqlClient.setHeader('Authorization', `Bearer ${token}`)
			return await graphqlClient.request<GamesResponse>(GAMES_QUERY)
		},
		enabled: !!token,
	})
