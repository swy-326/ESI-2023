module.exports = (fastify, opts, done) => {
    const AuthController = require('../controllers/auth.controller')
    const controller = AuthController(fastify)

    fastify.post("/login", controller.handleLogin)

    done()
}