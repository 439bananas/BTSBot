const uniconf = require('../configs/uniconf.json')
const path = require('path')
const express = require('express')
const router = express.Router()
const ejs = require('ejs')
const resourcesRoutes = require('./resources')

router.use('/resources', resourcesRoutes)

module.exports = router;