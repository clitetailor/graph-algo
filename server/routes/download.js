const { Router } = require('express')
const path = require('path')
const fs = require('fs')
const del = require('del')
const winston = require('winston')

const { toGraphML } = require('../data/graph')
const { download } = require('../utils/express')
const { writeFile } = require('../utils/fs')

const downloadRouter = new Router()
const downloadDir = path.resolve(
  __dirname,
  '../assets/download'
)

downloadRouter.post('/graphml', async (req, res, next) => {
  try {
    const data = toGraphML(req.body.graph)

    const fileName = `${new Date().getTime()}.graphml`
    const filePath = path.resolve(downloadDir, fileName)

    await writeFile(filePath, data)
    await download(res, filePath)

    await del([filePath])
  } catch (error) {
    next(error)
    winston.error(error)
  }
})

module.exports = {
  downloadRouter
}
