const { PrismaClient } = require('@prisma/client')
const { z } = require('zod')


class QueryBuilder {
    query = []

    with(attribute, kind, value) {
        if ( value === undefined || value === null ) return this

        this.query.push({
            [attribute]: {
                [kind]: value
            }
        })

        return this
    }

    isEmpty(){
        return this.query.length === 0
    }

    build(){
        return this.query   
    }
}

const OrderController = (fastify) => {

    const prisma = new PrismaClient({
        log: ['query'],
        errorFormat: 'pretty'
    })

    return {

        handleFindAll: async (request, response) => {

            const queryParamFormat = z
                                    .array(z.string())
                                    .or(z.string())
                                    .nullish()
                                    .transform( value => {
                                        if(value === null || value === undefined) return null

                                        return Array.isArray(value)
                                            ? value
                                            : Array.of(value)
                                    } )

            const parseQueryParams = z.object({
                tags: queryParamFormat,
                languages: queryParamFormat,
                price: z.string().nullish().transform( value => value && parseFloat(value))
            })

            const {
                tags,
                languages,
                price
            } = parseQueryParams.parse(request.query)

            const query = new QueryBuilder()
                .with('tags', 'hasSome', tags)
                .with('languages', 'hasSome', languages)
                .with('price', 'gte', price)

            console.log(`QUery => ${query.isEmpty()}`)
            if(query.isEmpty()){
                return await prisma.orders.findMany({
                    include: {
                        user: {
                            select: {
                                avatar: true
                            }
                        }
                    }
                })
            }

            return await prisma.orders.findMany({
                where: {
                    AND: query.build()
                },
                include: {
                    user: {
                        select: {
                            avatar: true
                        }
                    }
                }
            })

        },

        handleFindOne: async (request, response) => {
            const { id } = request.params
            const { internal_id } = await request.jwtVerify()

            const order = await prisma.orders.findUnique(
                { where: { id },
                include: {
                    answers: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    avatar: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            avatar: true
                        }
                    }
                }
            })

            const canAnswerOrder = order.price.equals(0)
                                || order.user_id === internal_id
                                || internal_id === order.translator_id

            const canRateOrder = order.user_id === internal_id

            if(! order) return response.code(404).send({ error: "Order Not Found"})

            return {
                ...order,
                canAnswerOrder,
                canRateOrder
            }
        },

        handleAcceptOrder: async (request, response) => {
            const { id } = request.params
            const { internal_id: translator_id } = await request.jwtVerify()
            
            const updated = await prisma.orders.update({
                where: { id },
                data: {
                    translator_id
                }
            })

            return updated

        },
        handleCreate: async (request, response) => {

            const { internal_id: user_id } = await request.jwtVerify()

            const stringToArrayType = z.array(z.string())
                                    .or(z.string())
                                    .transform( value => Array.isArray(value) ? value : value.split(","))
                                    .nullish()

            const createOrderBody = z.object({
                title: z.string(),
                price: z.number().or(z.string()).transform( value => value && parseFloat(value)),
                description: z.string(),
                main_language: z.string(),
                tags: stringToArrayType,
                languages: stringToArrayType
            })

            const data = createOrderBody.parse(request.body)
            const files = request?.files.map( file => file.filename)

            try {
            const created = await prisma.orders.create({
                data: {
                    user_id,
                    ...data,
                    files
                }
            })
            return created

        } catch (error){
            console.log(error)
            return { error: "Error"}
        }

        },


        handleUpdate: async (request, response) => {

        },

        handleAddResponse: async (request, response) => {
            const { id } = request.params
            const { internal_id: user_id } = await request.jwtVerify()


            const orderResponseBody = z.object({
                answer: z.string()
            })

            const files = request?.files.map( file => file.filename )

            const {
                answer
            } = orderResponseBody.parse(request.body)
            
            const updated = await prisma.orders.update({
                where: { id },
                data: {
                    answers: {
                        create: [{
                            user_id,
                            answer,
                            files
                        }]
                    }
                },
                include: {
                    answers: {
                        include: {
                            user: {
                                select: {
                                    name: true,
                                    avatar: true
                                }
                            }
                        }
                    },
                    user: {
                        select: {
                            name: true,
                            avatar: true
                        }
                    }
                }
            })

            return updated
        },

        handleAddRaiting: async (request, response) => {
            const { id } = request.params
            const { internal_id: user_id} = await request.jwtVerify()

            const createOrderRaitingBody = z.object({
                stars: z.number(),
                description: z.string()
            })

            const { stars, description} = createOrderRaitingBody.parse(request.body)

            const updated = await prisma.orders.update({
                where: { id },
                data: {
                    raiting: {
                        create: {
                            user_id,
                            stars,
                            description,
                        }
                    },
                    completed: true
                }
            })
        },

        handleFinish: async (request, response) => {
            const { id } = request.params

        }
    }
}

module.exports = OrderController