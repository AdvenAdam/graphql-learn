import { Context } from './context'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface SignupArgs {
	email: string
	password: string
}

interface LoginArgs {
	email: string
	password: string
}

interface CreateGameArgs {
	title: string
}

interface CreateReviewArgs {
	content: string
	gameId: number
}

export const resolvers = {
	Query: {
		games: async (_: unknown, _args: unknown, ctx: Context) => {
			if (!ctx.userId) throw new Error('Not authenticated')
			return ctx.prisma.game.findMany({ include: { reviews: { include: { user: true } } } })
		},

		me: async (_: unknown, _args: unknown, ctx: Context) => {
			if (!ctx.userId) throw new Error('Not authenticated')
			return ctx.prisma.user.findUnique({ where: { id: ctx.userId } })
		},
	},

	Mutation: {
		signup: async (_: unknown, args: SignupArgs, ctx: Context) => {
			const hashedPassword = await bcrypt.hash(args.password, 10)
			const user = await ctx.prisma.user.create({
				data: { email: args.email, password: hashedPassword },
			})
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
			return { user, token }
		},

		login: async (_: unknown, args: LoginArgs, ctx: Context) => {
			const user = await ctx.prisma.user.findUnique({ where: { email: args.email } })
			if (!user || !(await bcrypt.compare(args.password, user.password))) {
				throw new Error('Invalid credentials')
			}
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!)
			return { user, token }
		},

		createGame: async (_: unknown, args: CreateGameArgs, ctx: Context) => {
			if (!ctx.userId) throw new Error('Not authenticated')
			return ctx.prisma.game.create({ data: { title: args.title } })
		},

		createReview: async (_: unknown, args: CreateReviewArgs, ctx: Context) => {
			if (!ctx.userId) throw new Error('Not authenticated')
			return ctx.prisma.review.create({
				data: {
					content: args.content,
					userId: ctx.userId,
					gameId: args.gameId,
				},
				include: {
					game: true,
					user: true,
				},
			})
		},
		deleteReview: async (_: unknown, { id }: { id: number }, ctx: Context) => {
			if (!ctx.userId) throw new Error('Not authenticated')
			const review = await ctx.prisma.review.findUnique({ where: { id } })
			if (review?.userId !== ctx.userId) throw new Error('Forbidden')

			await ctx.prisma.review.delete({ where: { id } })
			return true
		},

		deleteGame: async (_: unknown, { id }: { id: number }, ctx: Context) => {
			if (!ctx.userId) throw new Error('Not authenticated')
			await ctx.prisma.$transaction(async (tx) => {
				const game = await tx.game.findUnique({ where: { id } })
				if (!game) throw new Error('Game not found')
				await tx.review.deleteMany({ where: { gameId: id } })
				await tx.game.delete({ where: { id } })
			})
			return true
		},
	},
}
