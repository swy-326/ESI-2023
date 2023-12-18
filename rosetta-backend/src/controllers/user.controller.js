const { PrismaClient, Prisma } = require('@prisma/client')

const { z } = require('zod')


const ParseUserProfileDTO = require('../dtos/user.profile.dto')


const UserController = (fastify) => {

    const prisma = new PrismaClient({
        log: ['query']
    })

    return {

        handleQuery: async (request, response ) => {

            // `)
                //         count: 50,
                //         stars: [
                //             { value: 5, count: 10 },

                //             { value: 4, count: 10 },
                //             { value: 3, count: 10 },
                //             { value: 2, count: 10 },
                //             { value: 1, count: 10 },
                //         ],
                //     }

            /**
            return await prisma.$queryRaw(Prisma.sql`
                SELECT orr.stars, count(orr.id)::INTEGER as total
                FROM "OrderRaiting" orr
                JOIN "Orders" o ON orr.order_id = o.internal_id
                WHERE o.translator_id = 1
                GROUP BY orr.stars
            `)
             */
            

            return 

        /**
         *                 //         testimonials: [{
                //             name: 'João Gomes',
                //             image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                //             description: 'muito rápida e tradução muito boa, me ajudou muito'
                //         },{
                //             name: 'João Gomes',
                //             image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',

                //             description: 'muito rápida e tradução muito boa, me ajudou muito'
                //         },{
                //             name: 'João Gomes',
                //             image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                //             description: 'muito rápida e tradução muito boa, me ajudou muito'
                //         }]
         */

        },
        handleGetProfile: async (request, response) => {
            const { id, internal_id } = await request.jwtVerify()

            const user = await prisma.users.findFirst({
                where: { id },
                include: {

                    portfolio: true
                }
            })
            
            const testimonials = await prisma.$queryRaw(Prisma.sql`
                    SELECT u.name, u.avatar, orr.description, orr.stars
                    FROM "OrderRaiting" orr
                    LEFT JOIN "Orders" o ON orr.order_id = o.internal_id
                    LEFT JOIN "Users" u ON orr.user_id = u.internal_id
                    WHERE o.translator_id = ${internal_id}
                    LIMIT 3
            `)


            const stars = await prisma.$queryRaw(Prisma.sql`
                    SELECT orr.stars, count(orr.id)::INTEGER as total
                    FROM "OrderRaiting" orr
                    JOIN "Orders" o ON orr.order_id = o.internal_id

                    WHERE o.translator_id = ${internal_id}
                    GROUP BY orr.stars
            `)


            const count = stars.reduce( (accumulator, actual) => accumulator + actual.total, 0)

            return {
                ...user,
                raitings: {
                    count,
                    stars,
                    testimonials
                }
            }
        },

        handleFindUser: async (request, reply) => {
            const { id } = request.params


            const users = await prisma.users.findFirst({
                where: { id }
            });

            return users
        },

        handleCreate: async (request, reply) => {

            const createUserBody = z.object({
                name: z.string(),
                email: z.string().email(),

                password: z.string(),
                confirm_password: z.string()
            })
            .superRefine( ({ password, confirm_password}, ctx) => {
                if (confirm_password !== password){
                    ctx.addIssue({
                        code: 'custom',
                        message: 'Password didn\'t matches'
                    })

                }
            })

            const {
                name,
                email,
                password
            } = createUserBody.parse(request.body)

            const hashed = await fastify.bcrypt.hash(password)

            const created = await prisma.users.create({ data: {
                name,
                email,
                password: hashed
            }})

            return created
        },

        handleUpdate: async (request, reply) => {

            const { id } = await request.jwtVerify()

            const updateUserBody = z.object({
                name: z.string(),
                email: z.string().email(),
                country: z.string().nullish(),
                city: z.string().nullish(),
                bio: z.string().nullish(),
                main_language: z.string().nullish(),
                languages: z.array(z.string()).nullish(),
                abilities: z.array(z.string()).nullish(),
            })

            const user = updateUserBody.parse(request.body)


            const updated = await prisma.users.update({
                where: { id },

                data: {
                    ...user
                }
            })

            return updated

        },

        handleAddUploadImage: async (request, reply) => {
            

            const { id } = await request.jwtVerify()

            const {
                hostname,
                protocol,
                file: {
                    filename
                }
            }  = request

            const avatar = `${protocol}://${hostname}/avatar/${filename}`

            await prisma.users.update({
                where: { id },
                data: {
                    avatar
                }
            })

            return { avatar }
        },
        handleAddProject: async (request, reply) => {
            const { id } = await request.jwtVerify()

            const addProjectBody = z.object({
                title: z.string(),
                url: z.string().url(),
            })


            const project = addProjectBody.parse(request.body)

            await prisma.users.update({
                where: { id },
                data: {
                    portfolio: {
                        create: {
                            ...project
                        }
                    }
                }
            })

            return project
        }
    }
}

module.exports = UserController