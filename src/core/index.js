const log = require('./logHandler');
const uniconf = require('../configs/uniconf.json')

log.info(`Starting ${uniconf.projname}...`)
const start = require('./init')