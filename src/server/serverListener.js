/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: serverListener.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkConf = require('../core/checkConfExists')
const engine = require('express-engine-jsx');
const express = require('express')
const title = require('express-title')
const app = express()
const favicon = require('serve-favicon')
const routes = require('./routes')
//const aaPages = require('./alwaysAvailablePages')
const frontpage = require('./frontPage')
const loginRoutes = require('./login')
const logoutRoutes = require('./logout')
const serversRoutes = require('./serversPage')
const confpage = require('./confPage')
const resourcesRoutes = require('./resources')
const pkg = require('../../package.json')
const cookieParser = require('cookie-parser')
const show404 = require('./display404')
const createLocaleMiddleware = require('express-locale')
const getDiscordUser = require('../core/getDiscordUserInfo')
const refreshBearerToken = require('../core/refreshDiscordBearerToken')
const showwall = require('./displayWall')
const getUserLang = require('../core/getUserLang')
let faviconfilename
let excludedApis = ["version", "uniconf", "submit-config"]
let confExists
let confErr
let user

app.set('views', path.join(__dirname, '..', 'src', 'server', 'views'))
app.set('view engine', 'jsx'); // We're using React as the templating engine
app.engine('jsx', engine);

switch (pkg.mode) {
    case 'alpha':
        faviconfilename = 'faviconalpha.ico'
        break;
    case 'beta':
        faviconfilename = 'faviconbeta.ico'
        break;
    case 'active-development':
        faviconfilename = 'faviconad.ico'
        break;
    case 'ad':
        faviconfilename = 'faviconad.ico'
        break;
    default:
        faviconfilename = 'favicon.ico'
        break;
}

app.use(cookieParser()) // Deal with cookies
app.use(createLocaleMiddleware())
app.use(title()); // Set tab title
app.set('title', uniconf.projname);

app.get('/*', async function (req, res, next) { // Block Internet Explorer
    global.requestsToDiscord = 0
    user = {}
    try {
        url = req.url.split('/')
        if (url[1] != "resources" && (url[1] != "api" && (url[2] != "uniconf" || url[2] != "version"))) {
            confExists = await checkConf()
        } else confExists = true
    } catch (err) {
        confErr = err
        confExists = false
    }
    let lang = await getUserLang(req)
    let urls = req.url.split('/') // Split our URLs where there is a / and add to array
    if ((req.get('user-agent').includes("MSIE") || req.get('user-agent').includes("Trident")) && urls[1].toLowerCase() != "resources") { // IE has two user agents; MSIE and Trident. Trident is only used in IE 11. Also check if we are not accessing resources (so we can load CSS)
        res.locals.uniconf = uniconf
        res.locals.title = " "
        res.locals.lang = lang
        res.render('ie-detect-error') // Display error
    } else { // If there are MySQL and Redis connections, try querying the database for the user
        if (typeof (redisConnection) != "undefined" && typeof (MySQLConnection) != "undefined" && req.cookies.discordbearertoken && urls[1].toLowerCase() != "resources") {
            try {
                user = await getDiscordUser(req.cookies.discordbearertoken)
                try {
                    let userRow = await MySQLConnection.query('SELECT * FROM user WHERE id=?', [user.id]) // If there is no user entry, add it to the database
                    if (!userRow[0][0]) {
                        let theme = 0
                        if (req.cookies.theme == "light") {
                            theme = 1
                        }
                        try {
                            let response = MySQLConnection.query('INSERT INTO user (id, email, language, theme, stringsTranslated) VALUES (?, ?, ?, ?, 0)', [user.id, user.email, user.locale, theme])
                            void response
                            next()
                        } catch (err) { // If there is an error, display a wall
                            if ((err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR")) {
                                showwall(res, lang, uniconf.projname + translate(lang, "page_missingdbperms"), translate(lang, "page_missingdbpermsdiagpart1") + conf.database + translate(lang, "page_missingdbpermsdiagpart2") + '\'' + conf.dbusername + '\'@\'' + conf.hostname + '\'.')
                            } else if (!(err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR")) {
                                log.error(err)
                                log.temp("serverListener.js:102")
                                showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                            } else next()
                        }
                    } else if (userRow[0] != user.email) { // If email is outdated, update in database
                        try {
                            let response = await MySQLConnection.query('UPDATE user SET email=? WHERE id=?', [user.email, user.id])
                            next()
                        } catch (err) { // error -> display wall
                            if ((err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR")) {
                                showwall(res, lang, uniconf.projname + translate(lang, "page_missingdbperms"), translate(lang, "page_missingdbpermsdiagpart1") + conf.database + translate(lang, "page_missingdbpermsdiagpart2") + '\'' + conf.dbusername + '\'@\'' + conf.hostname + '\'.')
                            } else if (!(err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR")) {
                                log.temp("serverListener.js:114")
                                log.error(err)
                                showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                            } else next()
                        }
                    }
                } catch (err) {
                    if ((err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR")) {
                        showwall(res, lang, uniconf.projname + translate(lang, "page_missingdbperms"), translate(lang, "page_missingdbpermsdiagpart1") + conf.database + translate(lang, "page_missingdbpermsdiagpart2") + '\'' + conf.dbusername + '\'@\'' + conf.hostname + '\'.')
                    } else if (!(err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR")) {
                        log.temp("serverListener.js:124")
                        log.tempinfo(err.code)
                        log.error(err)
                        showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                    } else {
                        log.temp("serverListener.js:124")
                        log.error(err)
                        showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                    }
                }
            } catch (err) {
                try {
                    log.temp("serverListener.js:126")
                    let token = await refreshBearerToken(req.cookies.discordrefreshtoken) // If we can't get the user's info, refresh their bearer token and reload the page
                    res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                    res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                    res.redirect(req.originalUrl)
                } catch (err) { // If we can't do that, err
                    switch (err) {
                        case "BAD_DISCORD_CLIENT_SECRET": // Show wall if bad client secret
                            showwall(res, lang, translate(lang, 'page_loginbadclientsecret'), translate(lang, 'page_loginbadclientsecretdiag'))
                            break;
                        case "BAD_REFRESH_TOKEN": // Don't worry if bad refresh token
                            next()
                            break;
                        default:
                            showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag")) // Show wall if other error
                            log.temp("serverListener.js:146")
                            log.error(err)
                            break;
                    }
                }
            }
        } else if ((typeof (redisConnection) === 'undefined' || typeof (MySQLConnection) === 'undefined') && urls[1].toLowerCase() != "resources" && confExists === true && !excludedApis.includes(urls[2])) { // Database can be accessed after downtime during initialisation of project
            global.conf = require('./configs/conf.json')
            require('../database/databaseManager')
            next()
        } else {
            next()
        }
    }
})

app.all('/*', async function (req, res, next) {
    getlang().then(lang => {
        if (req.headers['x-forwarded-host']) {
            log.info(req.method + translate(lang, 'log_incominghttprequestpart1') + req.headers['x-forwarded-for'] + translate(lang, 'log_incominghttprequestpart2') + req.headers['x-forwarded-host'] + translate(lang, 'log_incominghttprequestpart3') + req.url + translate(lang, 'log_incominghttprequestrp'))
        } else {
            log.info(req.method + translate(lang, 'log_incominghttprequestpart1') + req.socket.remoteAddress + translate(lang, 'log_incominghttprequestpart2') + req.headers.host + translate(lang, 'log_incominghttprequestpart3') + req.url)
        }
        next()
    })
});

app.use(favicon(path.join(__dirname, '..', 'src', 'server', 'views', 'resources', 'img', faviconfilename)))
app.use('/', function (req, res, next) {
    req.confExists = confExists
    req.confErr = confErr
    req.user = user
    next();
}, frontpage) // If root directory is contacted, we'll check if conf.json exists before serving
app.use('/config', confpage) // Fun fact, I forgot to call this file, and wondered why I was getting 404s on /config
app.use('/resources', resourcesRoutes) // Yeah let's get these resources
app.use('/api', routes) // All API endpoints then begin with "/api"
app.use('/login', function (req, res, next) {
    req.confExists = confExists
    req.confErr = confErr
    req.user = user
    next();
}, loginRoutes) // Login
app.use('/logout', logoutRoutes) // And logging out
app.use('/servers', function (req, res, next) {
    req.confExists = confExists
    req.confErr = confErr
    req.user = user
    next();
}, serversRoutes) // Servers page + actual dashboard

app.use(function (req, res, next) {
    getUserLang(req).then(lang => {
        checkConf().then(result => {
            show404(req, res, lang, true)
        }).catch(err => { // If error in conf, don't show things like login etc that couldn't possibly exist
            show404(req, res, lang, false)
        })
    })
});

module.exports = app;