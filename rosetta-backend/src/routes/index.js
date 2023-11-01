const userRoutes = require('./user.routes')
const orderRoutes = require('./order.routes')
const authRoutes = require('./auth.routes')

module.exports = (fastify, opts, done) => {

    fastify.register(userRoutes, { prefix: '/user'})
    fastify.register(orderRoutes, { prefix: '/orders'})
    fastify.register(authRoutes, { prefix: '/auth'})
    done()
}