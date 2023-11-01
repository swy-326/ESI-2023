const path = require('path')

const routes = require('./routes')

const multer = require('fastify-multer')

const { archives: uploader } = require('./services/uploader.service')

const fastify = require('fastify')({
    logger: true
})

fastify.register(require('@fastify/jwt'), {
    secret: 'SUPER_SECRET'
})

fastify.register(require('fastify-bcrypt'), {
    saltWorkFactor: 12
})

fastify.register(require('@fastify/cors'), {
    origin: true
})

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '..', 'uploads')
})

fastify.register(multer.contentParser)

fastify.get("/archives/:filename", (request, response) => {
    console.log("aqui")
    const { filename } = request.params
    response.sendFile(`/archives/${filename}`)
})


fastify.get("/avatar/:filename", (request, response) => {
    const { filename } = request.params
    console.log(filename)
    response.sendFile(`/avatar/${filename}`)
})

fastify.register(routes, { prefix: '/api'})

fastify.get('/upload', {
    preHandler: uploader.single('avatar'),
    handler: (request, response) => {
        return { hello: 'world' }
    }
})

module.exports = {
    fastify
}