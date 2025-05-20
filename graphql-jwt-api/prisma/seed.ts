import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
	// Create Users
	const password1 = await bcrypt.hash('password123', 10)
	const password2 = await bcrypt.hash('securepass', 10)

	const user1 = await prisma.user.create({
		data: {
			email: 'alice@example.com',
			password: password1,
		},
	})

	const user2 = await prisma.user.create({
		data: {
			email: 'bob@example.com',
			password: password2,
		},
	})

	// Create Games
	const game1 = await prisma.game.create({
		data: {
			title: 'The Legend of Prisma',
		},
	})

	const game2 = await prisma.game.create({
		data: {
			title: 'Typescript Adventures',
		},
	})

	const game3 = await prisma.game.create({
		data: {
			title: 'GraphQL Galaxy',
		},
	})

	// Create Reviews
	await prisma.review.createMany({
		data: [
			{
				content: 'Amazing game!',
				userId: user1.id,
				gameId: game1.id,
			},
			{
				content: 'Pretty fun overall.',
				userId: user2.id,
				gameId: game1.id,
			},
			{
				content: 'Loved the types!',
				userId: user1.id,
				gameId: game2.id,
			},
			{
				content: 'A bit buggy, but solid.',
				userId: user2.id,
				gameId: game3.id,
			},
		],
	})

	console.log('✅ Seed data created')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
