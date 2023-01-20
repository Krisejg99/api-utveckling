import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()


const main = async () => {
	// Write Prisma Client queries here
	console.log('It works?')

	// // Get all phones
	// const phones = await prisma.phones.findMany({
	// 	select: {
	// 		manufacturer: true,
	// 		model: true,
	// 	},
	// 	where: {
	// 		manufacturer: "Apple",
	// 	},
	// })
	// console.log('Phones:', phones)

	// // Get all users (maybe filter a bit if you want :) )
	// const users = await prisma.users.findMany({
	// 	where: {
	// 		name: {
	// 			contains: 'an'
	// 		}
	// 	},
	// 	orderBy: {
	// 		name: 'asc'
	// 	},
	// 	take: 2,
	// 	skip: 1
	// })
	// console.log('Users:', users)

	// // Get one user
	// const user = await prisma.users.findFirst({
	// 	where: {
	// 		name: "Korben Dallas",
	// 	}
	// })
	// console.log('User:', user)

	// // Get a specific user
	// const user = await prisma.users.findFirst({
	// 	where: {
	// 		id: 5,
	// 	}
	// })
	// console.log('Unique user:', user)

	// // Get a specific user and their phone
	// const user = await prisma.users.findUnique({
	// 	where: {
	// 		id: 4
	// 	},
	// 	include: {
	// 		phones: true
	// 	}
	// })
	// console.log('User:', user)

	// // Get all users and their phones
	// const users = await prisma.users.findMany({
	// 	include: {
	// 		phones: true
	// 	}
	// })
	// console.dir(users, { depth: null})

	// Get all phones and thir users (if they have any)
	const phones = await prisma.phones.findMany({
		include: {
			users: true
		}
	})
	console.dir(phones, { depth: null})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
