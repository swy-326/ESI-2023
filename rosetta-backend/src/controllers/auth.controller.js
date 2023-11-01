const { z } = require('zod')
const { PrismaClient } = require("@prisma/client")

const AuthController = (fastify) => {

    const prisma = new PrismaClient({
        log: ['query'],
        errorFormat: 'pretty'
    })

    return {
        handleLogin: async (request, response) => {
            
            const loginBody = z.object({
                email: z.string().email(),
                password: z.string()
            })

            const {
                email,
                password
            } = loginBody.parse(request.body)

            const user = await prisma.users.findFirst({
                where: {
                    email
                }
            })

            if(!user){
                return response.code(404).send({
                    error: "User Not Found"
                })
            }

            const matches = await fastify.bcrypt.compare(password, user.password)

            if(!matches){
                return response.code(404).send({
                    error: "Wrong Password"
                })
            }

            const token = fastify.jwt.sign({
                id: user.id,
                internal_id: user.internal_id,
                email: user.email
            })

            return {
                token
            }
        },
    }
}

module.exports = AuthController