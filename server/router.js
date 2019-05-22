const { Router } = require('express')

const { downloadRouter } = require('./routes/download')
const { uploadRouter } = require('./routes/upload')

const router = new Router()

router.use('/download', downloadRouter)
router.use('/upload', uploadRouter)

module.exports = {
  router
}
