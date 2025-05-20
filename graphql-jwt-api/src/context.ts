import { Request } from 'express'
import { verify } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Context {
	prisma: PrismaClient
	userId?: number
}

export const createContext = ({ req }: { req: Request }): Context => {
	const authHeader = req.headers.authorization
	if (authHeader?.startsWith('Bearer ')) {
		const token = authHeader.replace('Bearer ', '')
		try {
			const payload = verify(token, process.env.JWT_SECRET!) as { userId: number }
			return { prisma, userId: payload.userId }
		} catch (err) {
			console.warn('Invalid or expired token:', err)
		}
	}

	return { prisma }
}

export default createContext
