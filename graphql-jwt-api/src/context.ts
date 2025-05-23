import { Request } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export interface Context {
	prisma: PrismaClient
	userId?: number
}

export const createContext = async ({ req }: { req: Request }): Promise<Context> => {
	const authHeader = req.headers.authorization
	if (authHeader?.startsWith('Bearer ')) {
		const token = authHeader.replace('Bearer ', '')
		try {
			const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number }

			//  Ensure user exists
			const user = await prisma.user.findUnique({ where: { id: payload.userId } })
			if (!user) {
				console.warn('Token is valid but user does not exist in DB')
				return { prisma }
			}

			return { prisma, userId: payload.userId }
		} catch (err) {
			console.warn('Invalid or expired token:', err)
		}
	}

	return { prisma }
}

export default createContext
