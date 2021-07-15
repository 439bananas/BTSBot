const express = require('express')
const router = express.Router()

//const readyRoutes = require('./api/ready')
const submitMySQLRoutes = require('./api/submitMySQL')

router.use('/submit-mysql', submitMySQLRoutes)

module.exports = router;