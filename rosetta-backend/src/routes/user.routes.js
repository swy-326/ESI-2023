const { avatar: uploader } = require('../services/uploader.service')

module.exports = (fastify, opts, done) => {
    const UserController = require('../controllers/user.controller')
    const controller = UserController(fastify)

    fastify.get("/profile", controller.handleGetProfile)

    fastify.get("/:id", controller.handleFindUser)
    
    fastify.post("/create", {
        preHandler: uploader.single('avatar'),
        handler: controller.handleCreate
    })

    fastify.post("/project/create", controller.handleAddProject)

    fastify.post("/bla", {
        preHandler: uploader.single('avatar'),
        handler: controller.handleAddUploadImage
    })

    fastify.post("/create/basic", controller.handleCreate)

    
    fastify.put("/update", controller.handleUpdate)

    fastify.get("/query", controller.handleQuery)

    done()
}