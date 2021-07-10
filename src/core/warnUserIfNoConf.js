const log = require('./logHandler')
const checkconf = require('./checkConfExists')
const uniconf = require('../configs/uniconf.json')

checkconf().then(result => {
    if (result == false) {
        log.warn(`There does not seem to be a conf.json file, that ${uniconf.projname} can access, for it to properly function. Please follow the steps by navigating to localhost:${uniconf.port} in your web browser of choice to rectify this and generate one.`)
    }
})