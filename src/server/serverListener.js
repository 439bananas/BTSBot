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
const path = require('path')
const express = require('express')
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
const checkMySQL = require('../core/checkMySQL')
const refreshBearerToken = require('../core/refreshDiscordBearerToken')
const showwall = require('./displayWall')
const getUserLang = require('../core/getUserLang')
let faviconfilename

switch (pkg.mode) {
    case 'alpha':
        faviconfilename = 'faviconalpha.ico'
        global.prereleasewarning = "<%- include('./prerelease-warning'); %>"
        break;
    case 'beta':
        faviconfilename = 'faviconbeta.ico'
        global.prereleasewarning = "<%- include('./prerelease-warning'); %>"
        break;
    case 'active-development':
        faviconfilename = 'faviconad.ico'
        global.prereleasewarning = "<%- include('./prerelease-warning'); %>"
        break;
    case 'ad':
        faviconfilename = 'faviconad.ico'
        global.prereleasewarning = "<%- include('./prerelease-warning'); %>"
        break;
    default:
        faviconfilename = 'favicon.ico'
        global.prereleasewarning = ""
        break;
}

app.use(cookieParser()) // Deal with cookies
app.use(createLocaleMiddleware())

app.get('/*', async function (req, res, next) { // Block Internet Explorer
    let confExists
    try {
        confExists = await checkConf()
    } catch (err) {
        confExists = false
    }
    let lang = await getUserLang(req)
    let urls = req.url.split('/') // Split our URLs where there is a / and add to array
    if ((req.get('user-agent').includes("MSIE") || req.get('user-agent').includes("Trident")) && urls[1].toLowerCase() != "resources") { // IE has two user agents; MSIE and Trident. Trident is only used in IE 11. Also check if we are not accessing resources (so we can load CSS)
        res.render('../src/server/pages/ie-detect-error.ejs', { // Display error
            projname: uniconf.projname,
            conf: false,
            i18ngdescription: translate(lang, 'page_globaldesc'),
            metaurl: "https://" + uniconf.metadomain,
            i18ntitle: translate(lang, "page_iewalltitle"),
            i18ndescription: translate(lang, "page_iewalldescriptionpart1") + "<a href=\"https://www.microsoft.com/en-us/edge#evergreen\">" + translate(lang, "page_iewalldescriptionpart2") + "</a>" + translate(lang, "page_iewalldescriptionpart3") + "<a href = \"https://www.google.com/chrome/\">" + translate(lang, "page_iewalldescriptionpart4") + "</a>" + translate(lang, "page_iewalldescriptionpart5") + "<a href=\"https://www.mozilla.org/en-GB/firefox/new/\">" + translate(lang, "page_iewalldescriptionpart6") + "</a>"
        })
    } else { // If there are MySQL and Redis connections, try querying the database for the user
        if (typeof (redisConnection) != "undefined" && typeof (MySQLConnection) != "undefined" && req.cookies.discordbearertoken && urls[1].toLowerCase() != "resources") {
            try {
                let user = await getDiscordUser(req.cookies.discordbearertoken)
                try {
                    let userRow = await MySQLConnection.query('SELECT * FROM user WHERE id=?', [user.id]) // If there is no user entry, add it to the database
                    if (!userRow[0][0]) {
                        let theme = 0
                        if (req.cookies.theme == "light") {
                            theme = 1
                        }
                        try {
                            let response = MySQLConnection.query('INSERT INTO user (id, email, language, theme, stringsTranslated) VALUES (?, ?, ?, ?, 0)', [user.id, user.email, user.locale, theme])
                            next()
                        } catch (err) { // If there is an error, display a wall
                            if ((err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR") && urls[1].toLowerCase() != "resources") {
                                showwall(res, lang, uniconf.projname + translate(lang, "page_missingdbperms"), translate(lang, "page_missingdbpermsdiagpart1") + conf.database + translate(lang, "page_missingdbpermsdiagpart2") + '\'' + conf.dbusername + '\'@\'' + conf.hostname + '\'.')
                            } else if (!(err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR") && urls[1].toLowerCase() != "resources") {
                                log.error(err)
                                showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                            } else next()
                        }
                    } else if (userRow[0] != user.email) { // If email is outdated, update in database
                        try {
                            let response = await MySQLConnection.query('UPDATE user SET email=? WHERE id=?', [user.email, user.id])
                            next()
                        } catch (err) { // error -> display wall
                            if ((err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR") && urls[1].toLowerCase() != "resources") {
                                showwall(res, lang, uniconf.projname + translate(lang, "page_missingdbperms"), translate(lang, "page_missingdbpermsdiagpart1") + conf.database + translate(lang, "page_missingdbpermsdiagpart2") + '\'' + conf.dbusername + '\'@\'' + conf.hostname + '\'.')
                            } else if (!(err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR") && urls[1].toLowerCase() != "resources") {
                                log.error(err)
                                showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                            } else next()
                        }
                    }
                } catch (err) {
                    if ((err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR") && urls[1].toLowerCase() != "resources") {
                        showwall(res, lang, uniconf.projname + translate(lang, "page_missingdbperms"), translate(lang, "page_missingdbpermsdiagpart1") + conf.database + translate(lang, "page_missingdbpermsdiagpart2") + '\'' + conf.dbusername + '\'@\'' + conf.hostname + '\'.')
                    } else if (!(err.code == "ER_TABLEACCESS_DENIED_ERROR" || err.code == "ER_DBACCESS_DENIED_ERROR") && urls[1].toLowerCase() != "resources") {
                        log.error(err)
                        showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag"))
                    } else next()
                }
            } catch (err) {
                try {
                    let token = refreshBearerToken(req.cookies.discordrefreshtoken) // If we can't get the user's info, refresh their bearer token and reload the page
                    res.cookie("discordbearertoken", token.bearertoken, { maxAge: 604800000, httpOnly: true }) // Store bearer token and refresh token
                    res.cookie('discordrefreshtoken', token.refreshtoken, { httpOnly: true })
                    res.redirect(req.originalUrl)
                } catch (err) { // If we can't do that, err
                    switch (err) {
                        case "BAD_DISCORD_CLIENT_SECRET": // Show wall if bad client secret
                            let lang = await getUserLang(req)
                            showwall(res, lang, translate(lang, 'page_loginbadclientsecret'), translate(lang, 'page_loginbadclientsecretdiag'))
                            break;
                        case "BAD_REFRESH_TOKEN": // Don't worry if bad refresh token
                            next()
                            break;
                        default:
                            showwall(res, conf.language, translate(lang, "page_confunknownerror"), translate(lang, "page_wallunknownerrordiag")) // Show wall if other error
                            log.error(err)
                            break;
                    }
                }
            }
        } else if ((typeof (redisConnection) === 'undefined' || typeof (MySQLConnection) === 'undefined') && confExists === true) { // Database can be accessed after downtime during initialisation of project
            global.conf = require('../configs/conf.json')
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

app.use(favicon(path.join(__dirname, 'pages', 'resources', 'img', faviconfilename)))
app.use('/', frontpage) // If root directory is contacted, we'll check if conf.json exists before serving
app.use('/config', confpage) // Fun fact, I forgot to call this file, and wondered why I was getting 404s on /config
app.use('/resources', resourcesRoutes) // Yeah let's get these resources
app.use('/api', routes) // All API endpoints then begin with "/api"
app.use('/login', loginRoutes) // Login
app.use('/logout', logoutRoutes) // And logging out
app.use('/servers', serversRoutes) // Servers page + actual dashboard

app.use(function (req, res, next) {
    getlang(true).then(lang => {
        checkConf().then(result => {
            show404(res, lang, true, req)
        }).catch(err => { // If error in conf, don't show things like login etc that couldn't possibly exist
            show404(res, lang, false)
        })
    })
});

module.exports = app;