const { Router } = require('express')
const winston = require('winston')

const { fromGraphML } = require('../data/graph')

const uploadRouter = new Router()

uploadRouter.post('/graphml', (req, res, next) => {
  try {
    const graphml = req.body.graphml
    const graph = fromGraphML(graphml)

    res.json({
      graph
    })
  } catch (error) {
    next(error)
    winston.error(error)
  }
})

module.exports = {
  uploadRouter
}
