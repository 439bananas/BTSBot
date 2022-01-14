/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//           File: checkConfOnRequest.js           //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

// NOTES: I'm sure someone's going to rip my guts out but this is admittedly one of the most janky files ever; if you could help refactor the code (this screws my brain up as it is) without cleaving functionality, please submit a pull request!

const uniconf = require('../configs/uniconf.json')
const path = require('path')
const express = require('express')
const app = express()
const fs = require('fs')
const ejs = require('ejs')
const fetch = require('node-fetch')
const formidable = require('express-formidable')
const checkconf = require('../core/checkConfExists')
const checkmysql = require('../core/checkMySQL')
const checkdiscord = require('../core/checkDiscord')
const router = express.Router()
const log = require('../core/logHandler')
const geti18n = require('../core/getI18nFiles')
const getlang = require('../core/getLanguageJSON')
const translate = require('../core/getLanguageString')
const restart = require('../core/restartProcess')
const getid = require('../core/getApplicationId')

router.use(formidable()) // Grab fields of form entered
router.get('/', async (req, res, next) => { // When / is GET'd, if checkconf returns true, send the noconfintro file and fill variables with respective values, else send back the front page
    checkconf().catch(err => {
        getlang().then(lang => {
            if (err == false) {
                res.status(200);
                res.render('../src/server/pages/noconfintro.ejs', { // DON'T CHANGE THE RENDERING OF THE PAGE, USE DIFFERENT VARIABLES ON DIFFERENT CONDITIONS
                    projname: uniconf.projname,
                    confpath: path.join(__dirname, 'configs'),
                    metadomain: uniconf.metadomain,
                    metaurl: "https://" + uniconf.metadomain,
                    wikiurl: "https://wiki." + uniconf.metadomain,
                    discord: uniconf.discord,
                    i18nbtsbotlogo: translate(lang, 'page_globalbtsbotlogo'),
                    i18nbtsbothome: translate(lang, 'page_globalbtsbothome'),
                    i18npagetitle: translate(lang, 'page_configpagetitle'),
                    i18ngdescription: translate(lang, 'page_globaldesc'),
                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                    i18ngithub: translate(lang, 'page_globalgithub'),
                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                    i18nheadertitle: translate(lang, 'page_noconfintroheader'),
                    i18nnextbutton: translate(lang, 'page_globalnext'),
                    i18nnoconfintro1: translate(lang, 'page_noconfintropart1'),
                    i18nnoconfintro2: translate(lang, 'page_noconfintropart2'),
                    i18nnoconfintro3: translate(lang, 'page_noconfintropart3'),
                    i18nnoconfintro4: translate(lang, 'page_noconfintropart4'),
                    i18nnoconfintrodiag: translate(lang, 'page_noconfintrodiag')
                });
            }
            else {
                res.status(200);
                res.json({
                    metadomain: uniconf.metadomain,
                    metaurl: "https://" + uniconf.metadomain,
                    wikiurl: "https://wiki." + uniconf.metadomain,
                    discord: uniconf.discord,
                    i18npagetitle: translate(lang, 'page_configpagetitle'),
                    i18ngdescription: translate(lang, 'page_globaldesc'),
                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                    i18ngithub: translate(lang, 'page_globalgithub'),
                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                    i18nheadertitle: translate(lang, 'page_noconfintroheader'),
                    i18nnextbutton: translate(lang, 'page_globalnext'),
                    i18nnoconfintro1: translate(lang, 'page_noconfintropart1'),
                    i18nnoconfintro2: translate(lang, 'page_noconfintropart2'),
                    i18nnoconfintro3: translate(lang, 'page_noconfintropart3'),
                    i18nnoconfintro4: translate(lang, 'page_noconfintropart4'),
                    i18nnoconfintrodiag: translate(lang, 'page_noconfintrodiag')
                });
            }
        })
    })
})

router.get('/config', async (req, res, next) => { // Rinse and repeat but only serve at all if checkconf returns false
    getlang().then(lang => {
        checkconf().then(response => { // FOR NOW WE USE DEFAULT LANGUAGE
            if (response == true) {
                res.status(404);
                res.render('../src/server/pages/404.ejs', {
                    projname: uniconf.projname,
                    conf: true,
                    metadomain: uniconf.metadomain,
                    metaurl: "https://" + uniconf.metadomain,
                    wikiurl: "https://wiki." + uniconf.metadomain,
                    discord: uniconf.discord,
                    i18npagetitle: translate(lang, 'page_404pagetitle'),
                    i18ntitle: translate(lang, 'page_404errortitle'),
                    i18ndescription: translate(lang, 'page_404errordescription'),
                    i18ngithub: translate(lang, 'page_globalgithub'),
                    i18ngdescription: translate(lang, 'page_globaldescription'),
                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                    i18ndashboard: translate(lang, 'page_noconfdashboard')
                })
            }
        }).catch(err => {
            if (err === false) {
                if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json'))) { // Check if an interim file has been created
                    const mysqlconf = require('../configs/mysqlconfinterim.json')
                    checkmysql(mysqlconf.hostname, mysqlconf.username, mysqlconf.password, mysqlconf.database).then(confresult => {
                        if (confresult == "OK") {
                            if (fs.existsSync(path.join(__dirname, '..', 'configs', 'discordconfinterim.json'))) {
                                const discordconf = require('../configs/discordconfinterim.json')
                                checkdiscord(discordconf.token).then(discordresult => {
                                    if (discordresult == "ASSUME_CLIENT_SECRET_IS_CORRECT") {
                                        if (req.query.code == undefined) { // If there's no code, get Discord to provide one
                                            fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Validate the token this way, we used Discord.JS to validate the token and validating the token that way barfed all sorts of weird errors
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bot ${discordconf.token}`,
                                                    'Transfer-Encoding': 'chunked'
                                                }
                                            }).then(response => response.json())
                                                .then(json => {
                                                    if (json.message === undefined) { // If all is good...
                                                        if (req.headers['x-forwarded-host']) { // Check if we're using a reverse proxy (RP) so we can set the redirect uri to that. IIS was a pain for me lol
                                                            var hostname = encodeURIComponent('http://' + req.headers['x-forwarded-host'])
                                                        } else {
                                                            var hostname = encodeURIComponent('http://' + req.headers.host)
                                                        }
                                                        res.redirect('https://discord.com/oauth2/authorize?client_id=' + json.id + '&redirect_uri=' + hostname + '/config&response_type=code&scope=identify&prompt=none') // Redirect to OAuth2 page
                                                    } else {
                                                        if (json.message == "401: Unauthorized") { // If there's an error like unauthorised, send the user instead to a wall
                                                            res.render('../src/server/pages/errorpage.ejs', {
                                                                projname: uniconf.projname,
                                                                metadomain: uniconf.metadomain,
                                                                metaurl: "https://" + uniconf.metadomain,
                                                                wikiurl: "https://wiki." + uniconf.metadomain,
                                                                discord: uniconf.discord,
                                                                error: translate(lang, 'page_walltokeninvalid') + path.join(__dirname, '..', 'configs', 'discordconfinterim.json') + ".",
                                                                diag: translate(lang, 'page_walltokeninvaliddiag'),
                                                                i18npagetitle: translate(lang, 'page_configpagetitle'),
                                                                i18ngithub: translate(lang, 'page_globalgithub'),
                                                                i18ngdescription: translate(lang, 'page_globaldescription'),
                                                                i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                                                i18ndiscord: translate(lang, 'page_globaldiscord'),
                                                                i18ndashboard: translate(lang, 'page_noconfdashboard')
                                                            })
                                                        } else {
                                                            res.render('../src/server/pages/errorpage.ejs', { // Same for unknown error and log the error
                                                                projname: uniconf.projname,
                                                                metadomain: uniconf.metadomain,
                                                                metaurl: "https://" + uniconf.metadomain,
                                                                wikiurl: "https://wiki." + uniconf.metadomain,
                                                                discord: uniconf.discord,
                                                                error: translate(lang, 'page_confunknownerror'),
                                                                diag: translate(lang, 'page_wallunknownerrordiag'),
                                                                i18npagetitle: translate(lang, 'page_configpagetitle'),
                                                                i18ngithub: translate(lang, 'page_globalgithub'),
                                                                i18ngdescription: translate(lang, 'page_globaldescription'),
                                                                i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                                                i18ndiscord: translate(lang, 'page_globaldiscord'),
                                                                i18ndashboard: translate(lang, 'page_noconfdashboard')
                                                            })
                                                            log.error(json.message)
                                                        }
                                                    }
                                                })
                                                .catch(err => {
                                                    if (err) {
                                                        if (err.name == "FetchError") { // Yeah more testing needed
                                                            res.render('../src/server/pages/errorpage.ejs', {
                                                                projname: uniconf.projname,
                                                                metadomain: uniconf.metadomain,
                                                                metaurl: "https://" + uniconf.metadomain,
                                                                wikiurl: "https://wiki." + uniconf.metadomain,
                                                                discord: uniconf.discord,
                                                                error: translate(lang, 'page_wallcannotconnecttodiscord'),
                                                                diag: translate(lang, 'page_wallcannotconnecttodiscorddiag'),
                                                                i18npagetitle: translate(lang, 'page_configpagetitle'),
                                                                i18ngithub: translate(lang, 'page_globalgithub'),
                                                                i18ngdescription: translate(lang, 'page_globaldescription'),
                                                                i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                                                i18ndiscord: translate(lang, 'page_globaldiscord'),
                                                                i18ndashboard: translate(lang, 'page_noconfdashboard')
                                                            })
                                                        } else {
                                                            res.render('../src/server/pages/errorpage.ejs', {
                                                                projname: uniconf.projname,
                                                                metadomain: uniconf.metadomain,
                                                                metaurl: "https://" + uniconf.metadomain,
                                                                wikiurl: "https://wiki." + uniconf.metadomain,
                                                                discord: uniconf.discord,
                                                                error: translate(lang, 'page_confunknownerror'),
                                                                diag: translate(lang, 'page_wallunknownerrordiag'),
                                                                i18npagetitle: translate(lang, 'page_configpagetitle'),
                                                                i18ngithub: translate(lang, 'page_globalgithub'),
                                                                i18ngdescription: translate(lang, 'page_globaldescription'),
                                                                i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                                                i18ndiscord: translate(lang, 'page_globaldiscord'),
                                                                i18ndashboard: translate(lang, 'page_noconfdashboard')
                                                            })
                                                            log.error(err)
                                                        }
                                                    }
                                                })
                                        }
                                        else { // If there's a code provided, do the following:
                                            if (req.headers['x-forwarded-host']) { // Check if we're using a RP again for the redirect_uri parameter
                                                var hostname = 'http://' + req.headers['x-forwarded-host']
                                            } else {
                                                var hostname = 'http://' + req.headers.host
                                            }
                                            fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Get the ID cuz yanno
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `Bot ${discordconf.token}`,
                                                    'Transfer-Encoding': 'chunked'
                                                }
                                            })
                                                .then(response => response.json())
                                                .then(json => {
                                                    fetch('https://discord.com/api/v9/oauth2/token', { // Check if the client secret is valid this way
                                                        method: 'POST',
                                                        body: new URLSearchParams({
                                                            'client_id': json.id,
                                                            'client_secret': discordconf.clientsecret, // I was an idiot and forgot the underscore then wondered for ages why it wasn't working
                                                            'grant_type': 'authorization_code',
                                                            'code': req.query.code,
                                                            'redirect_uri': hostname + "/config"
                                                        }),
                                                        headers: {
                                                            'Content-Type': 'application/x-www-form-urlencoded'
                                                        }
                                                    })
                                                        .then(res => res.json())
                                                        .then(json => {
                                                            var onlineselected, idleselected, dndselected, invisibleselected; // Declare each of these variables
                                                            onlineselected = idleselected = invisibleselected = dndselected = ""; // These should be defined as blank so we don't have any undefineds in the HTML source; if it's safer or less janky to declare them all at once then that'd be cool to know but for now I'm defining them separately to declaring them so that we can be sure everything works
                                                            if (discordconf.ostatus == "dnd" || discordconf.ostatus == "idle" || discordconf.ostatus == "online" || discordconf.ostatus == "invisible") { // If it's any of these, plonk whatever's in config as default
                                                                if (discordconf.ostatus == "online") {
                                                                    var onlineselected = "selected "
                                                                }
                                                                else if (discordconf.ostatus == "idle") {
                                                                    var idleselected = "selected "
                                                                }
                                                                else if (discordconf.ostatus == "dnd") {
                                                                    var dndselected = "selected "
                                                                }
                                                                else if (discordconf.ostatus == "invisible") {
                                                                    var invisibleselected = "selected "
                                                                }
                                                            } else { // Else, use online as default as Discord does
                                                                var onlineselected = "selected "
                                                            }
                                                            if (discordconf.pstatus !== undefined) { // If these aren't undefined, use the status in the config, else set as blank
                                                                var pstatus = discordconf.pstatus
                                                            } else {
                                                                var pstatus = ""
                                                            }
                                                            if (discordconf.guildid !== undefined) {
                                                                var guildid = discordconf.guildid
                                                            } else {
                                                                var guildid = ""
                                                            }
                                                            if (discordconf.moderatorsroleid !== undefined) {
                                                                var guildid = discordconf.moderatorsroleid
                                                            } else {
                                                                var moderatorsroleid = ""
                                                            }
                                                            if (json.error && json.error == "invalid_client") { // This is the error for bad client secret; send that back via the page
                                                                res.render('../src/server/pages/config-2.ejs', {
                                                                    projname: uniconf.projname,
                                                                    metadomain: uniconf.metadomain,
                                                                    metaurl: "https://" + uniconf.metadomain,
                                                                    wikiurl: "https://wiki." + uniconf.metadomain,
                                                                    discord: uniconf.discord,
                                                                    unknownerror: false,
                                                                    badclientsecret: true,
                                                                    onlineselected: onlineselected,
                                                                    idleselected: idleselected,
                                                                    dndselected: dndselected,
                                                                    invisibleselected: invisibleselected,
                                                                    guildid: guildid,
                                                                    moderatorsroleid: moderatorsroleid,
                                                                    pstatus: pstatus,
                                                                    i18npagetitle: translate(lang, 'page_configpagetitle'),
                                                                    i18ngithub: translate(lang, 'page_globalgithub'),
                                                                    i18ngdescription: translate(lang, 'page_globaldescription'),
                                                                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                                                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                                                                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                                                                    i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                                                                    i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                                                                    i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                                                                    i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                                                                    i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                                                                    i18ndiscordserver: translate(lang, 'global_discordserver'),
                                                                    i18ndbaccessdenied: translate(lang, 'page_accessdenied'),
                                                                    i18ndbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig2'),
                                                                    i18nrefreshthepage: translate(lang, 'page_globalrefreshthepage'),
                                                                    i18nmysqlconfinterimdeleted: translate(lang, 'page_mysqlconfinterimdeleted'),
                                                                    i18nmysqlconfinterimdeleteddiag: translate(lang, 'page_mysqlconfinterimdeleteddiag'),
                                                                    i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                                                                    i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig2'),
                                                                    i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig2'),
                                                                    i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig2'),
                                                                    i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                                                                    i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                                                                    i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                                                                    i18ninvalidtoken: translate(lang, 'page_tokeninvalid'),
                                                                    i18ninvalidtokendiag: translate(lang, 'page_tokeninvaliddiag'),
                                                                    i18nbadclientsecret: translate(lang, 'page_badclientsecret'),
                                                                    i18nbadclientsecretdiag: translate(lang, 'page_badclientsecretdiag'),
                                                                    i18nunknownerror: translate(lang, 'page_confunknownerror'),
                                                                    i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                                                                    i18ncannotconnecttodiscord: translate(lang, 'page_cannotconnecttodiscord'),
                                                                    i18ncannotconnecttodiscorddiag: translate(lang, 'page_cannotconnecttodiscorddiag'),
                                                                    i18nunknowndiscorderror: translate(lang, 'page_unknowndiscorderror'),
                                                                    i18ndiscordtoken: translate(lang, 'page_discordtoken'),
                                                                    i18nclientsecret: translate(lang, 'page_clientsecret'),
                                                                    i18nplayingstatus: translate(lang, 'page_playingstatus'),
                                                                    i18nstatus: translate(lang, 'page_status'),
                                                                    i18nonline: translate(lang, 'page_online'),
                                                                    i18nidle: translate(lang, 'page_invisible'),
                                                                    i18ndnd: translate(lang, 'page_dnd'),
                                                                    i18ninvisible: translate(lang, 'page_invisible'),
                                                                    i18nsupportguildid: translate(lang, 'page_supportguildid'),
                                                                    i18nmoderatorsroleid: translate(lang, 'page_moderatorsroleid'),
                                                                    i18nmysqlpassword: translate(lang, 'page_mysqlpassword'),
                                                                    i18nnextbutton: translate(lang, 'page_globalnext'),
                                                                    i18nsubmittingdiscord: translate(lang, 'page_submittingdiscord'),
                                                                    i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                                                                    i18nheadertitle: translate(lang, 'page_configheader'),
                                                                    i18nsteptwo: translate(lang, 'page_configstep2')
                                                                });
                                                            } else if (json.error) { // If something else is the error, return to config-2 again and display that error, logging it
                                                                res.render('../src/server/pages/config-2.ejs', {
                                                                    projname: uniconf.projname,
                                                                    metadomain: uniconf.metadomain,
                                                                    metaurl: "https://" + uniconf.metadomain,
                                                                    wikiurl: "https://wiki." + uniconf.metadomain,
                                                                    discord: uniconf.discord,
                                                                    unknownerror: true,
                                                                    badclientsecret: false,
                                                                    onlineselected: onlineselected,
                                                                    idleselected: idleselected,
                                                                    dndselected: dndselected,
                                                                    invisibleselected: invisibleselected,
                                                                    guildid: guildid,
                                                                    moderatorsroleid: moderatorsroleid,
                                                                    pstatus: pstatus,
                                                                    i18npagetitle: translate(lang, 'page_configpagetitle'),
                                                                    i18ngithub: translate(lang, 'page_globalgithub'),
                                                                    i18ngdescription: translate(lang, 'page_globaldescription'),
                                                                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                                                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                                                                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                                                                    i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                                                                    i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                                                                    i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                                                                    i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                                                                    i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                                                                    i18ndiscordserver: translate(lang, 'global_discordserver'),
                                                                    i18ndbaccessdenied: translate(lang, 'page_accessdenied'),
                                                                    i18ndbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig2'),
                                                                    i18nrefreshthepage: translate(lang, 'page_globalrefreshthepage'),
                                                                    i18nmysqlconfinterimdeleted: translate(lang, 'page_mysqlconfinterimdeleted'),
                                                                    i18nmysqlconfinterimdeleteddiag: translate(lang, 'page_mysqlconfinterimdeleteddiag'),
                                                                    i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                                                                    i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig2'),
                                                                    i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig2'),
                                                                    i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig2'),
                                                                    i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                                                                    i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                                                                    i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                                                                    i18ninvalidtoken: translate(lang, 'page_tokeninvalid'),
                                                                    i18ninvalidtokendiag: translate(lang, 'page_tokeninvaliddiag'),
                                                                    i18nbadclientsecret: translate(lang, 'page_badclientsecret'),
                                                                    i18nbadclientsecretdiag: translate(lang, 'page_badclientsecretdiag'),
                                                                    i18nunknownerror: translate(lang, 'page_confunknownerror'),
                                                                    i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                                                                    i18ncannotconnecttodiscord: translate(lang, 'page_cannotconnecttodiscord'),
                                                                    i18ncannotconnecttodiscorddiag: translate(lang, 'page_cannotconnecttodiscorddiag'),
                                                                    i18nunknowndiscorderror: translate(lang, 'page_unknowndiscorderror'),
                                                                    i18ndiscordtoken: translate(lang, 'page_discordtoken'),
                                                                    i18nclientsecret: translate(lang, 'page_clientsecret'),
                                                                    i18nplayingstatus: translate(lang, 'page_playingstatus'),
                                                                    i18nstatus: translate(lang, 'page_status'),
                                                                    i18nonline: translate(lang, 'page_online'),
                                                                    i18nidle: translate(lang, 'page_invisible'),
                                                                    i18ndnd: translate(lang, 'page_dnd'),
                                                                    i18ninvisible: translate(lang, 'page_invisible'),
                                                                    i18nsupportguildid: translate(lang, 'page_supportguildid'),
                                                                    i18nmoderatorsroleid: translate(lang, 'page_moderatorsroleid'),
                                                                    i18nmysqlpassword: translate(lang, 'page_mysqlpassword'),
                                                                    i18nnextbutton: translate(lang, 'page_globalnext'),
                                                                    i18nsubmittingdiscord: translate(lang, 'page_submittingdiscord'),
                                                                    i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                                                                    i18nheadertitle: translate(lang, 'page_configheader'),
                                                                    i18nsteptwo: translate(lang, 'page_configstep2')
                                                                });
                                                                log.error(json.error)
                                                            } else {
                                                                checkmysql(mysqlconf.hostname, mysqlconf.username, mysqlconf.password, mysqlconf.database)
                                                                    .then(result => {
                                                                        fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Get owner IDs
                                                                            method: 'GET',
                                                                            headers: {
                                                                                'Content-Type': 'application/json',
                                                                                'Authorization': `Bot ${discordconf.token}`,
                                                                                'Transfer-Encoding': 'chunked'
                                                                            }
                                                                        })
                                                                            .then(res => res.json())
                                                                            .then(applicationinfo => {
                                                                                if (applicationinfo.team != undefined) { // Check if team, if team add all members to the conf
                                                                                    var owner = []
                                                                                    for (var i in applicationinfo.team.members) {
                                                                                        owner.push(`"${applicationinfo.team.members[i].user.id}"`)
                                                                                    }
                                                                                    var owner = "[" + owner + "]"
                                                                                } else {
                                                                                    var owner = `"${applicationinfo.owner.id}"`
                                                                                }
                                                                                fs.writeFile('src/configs/conf.json', `{\n  "language": "${mysqlconf.language}",\n  "hostname": "${mysqlconf.hostname}",\n  "db": "${mysqlconf.database}",\n  "username": "${mysqlconf.username}",\n  "password": "${discordconf.mysqlpassword}",\n  "tableprefix": "${mysqlconf.tableprefix}",\n  "token": "${discordconf.token}",\n  "clientsecret": "${discordconf.clientsecret}",\n  "ostatus": "${discordconf.ostatus}",\n  "pstatus": "${discordconf.pstatus}",\n  "moderatorsroleid": "${discordconf.moderatorsroleid}",\n  "guildid": "${discordconf.guildid}",\n  "owner": ${owner}\n}`, function (err) { // Save conf file
                                                                                    if (err) throw err;
                                                                                    if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json'))) { // Delete interim conf files
                                                                                        fs.unlink('src/configs/mysqlconfinterim.json', function (err) {
                                                                                            if (err) throw err;
                                                                                        })
                                                                                    }
                                                                                    if (fs.existsSync(path.join(__dirname, '..', 'configs', 'discordconfinterim.json'))) {
                                                                                        fs.unlink('src/configs/discordconfinterim.json', function (err) {
                                                                                            if (err) throw err;
                                                                                        })
                                                                                    }
                                                                                    res.render('../src/server/pages/config-complete.ejs', { // Conf is complete! Display the page
                                                                                        projname: uniconf.projname,
                                                                                        metadomain: uniconf.metadomain,
                                                                                        metaurl: "https://" + uniconf.metadomain,
                                                                                        wikiurl: "https://wiki." + uniconf.metadomain,
                                                                                        discord: uniconf.discord,
                                                                                        onlineselected: onlineselected,
                                                                                        idleselected: idleselected,
                                                                                        dndselected: dndselected,
                                                                                        invisibleselected: invisibleselected,
                                                                                        guildid: guildid,
                                                                                        moderatorsroleid: moderatorsroleid,
                                                                                        pstatus: pstatus,
                                                                                        i18npagetitle: translate(lang, 'page_configpagetitle'),
                                                                                        i18ngithub: translate(lang, 'page_globalgithub'),
                                                                                        i18ngdescription: translate(lang, 'page_globaldescription'),
                                                                                        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                                                                        i18ndiscord: translate(lang, 'page_globaldiscord'),
                                                                                        i18ndashboard: translate(lang, 'page_noconfdashboard'),
                                                                                        i18nbtsbotlogo: translate(lang, 'page_globalbtsbotlogo'),
                                                                                        i18nbtsbothome: translate(lang, 'page_globalbtsbothome'),
                                                                                        i18nheadertitle: translate(lang, 'page_configcompleteheader'),
                                                                                        i18nconfsuccessful: translate(lang, 'page_confsuccessful'),
                                                                                        i18nconfsuccessfuldiag: translate(lang, 'page_confsuccessfuldiag'),
                                                                                        i18nnextbutton: translate(lang, 'page_globalnext')
                                                                                    })
                                                                                    log.info(translate(lang, 'log_conffilesaved') + path.join(__dirname, '..', '..', 'configs', 'conf.json'))
                                                                                    log.info(translate(lang.language, 'log_changestakeefect_part1') + uniconf.projname + translate(lang, 'log_changestakeefect_part2'))
                                                                                    setTimeout(function () { // Restart to be safe
                                                                                        restart()
                                                                                    }, 250)
                                                                                })
                                                                            })
                                                                            .catch(err => {
                                                                                if (err.name == "FetchError") { // At some point when Discord's down (which is pretty frequent, I can't lie), we should test this! This currently only works as far as I know if the bot has no internet
                                                                                    log.warn(translate(lang, 'log_cannotconnecttodiscordforownerid'))
                                                                                }
                                                                            })
                                                                    })
                                                            }
                                                        })
                                                }).catch(err => {
                                                    if (err.name == "FetchError") {
                                                        res.render('../src/server/pages/errorpage.ejs', {
                                                            projname: uniconf.projname,
                                                            metadomain: uniconf.metadomain,
                                                            metaurl: "https://" + uniconf.metadomain,
                                                            wikiurl: "https://wiki." + uniconf.metadomain,
                                                            discord: uniconf.discord,
                                                            error: translate(lang, 'page_wallcannotconnecttodiscord'),
                                                            diag: translate(lang, 'page_wallcannotconnecttodiscorddiag'),
                                                            i18npagetitle: translate(lang, 'page_configpagetitle'),
                                                            i18ngithub: translate(lang, 'page_globalgithub'),
                                                            i18ngdescription: translate(lang, 'page_globaldescription'),
                                                            i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                                            i18ndiscord: translate(lang, 'page_globaldiscord'),
                                                            i18ndashboard: translate(lang, 'page_noconfdashboard')
                                                        })
                                                    }
                                                })
                                        }
                                    }
                                })
                                    .catch(err => {
                                        var onlineselected, idleselected, dndselected, invisibleselected; // Declare each of these variables
                                        onlineselected = idleselected = invisibleselected = dndselected = ""; // These should be defined as blank so we don't have any undefineds in the HTML source; if it's safer or less janky to declare them all at once then that'd be cool to know but for now I'm defining them separately to declaring them so that we can be sure everything works
                                        if (discordconf.ostatus == "dnd" || discordconf.ostatus == "idle" || discordconf.ostatus == "online" || discordconf.ostatus == "invisible") { // If it's any of these, plonk whatever's in config as default
                                            if (discordconf.ostatus == "online") {
                                                var onlineselected = "selected "
                                            }
                                            else if (discordconf.ostatus == "idle") {
                                                var idleselected = "selected "
                                            }
                                            else if (discordconf.ostatus == "dnd") {
                                                var dndselected = "selected "
                                            }
                                            else if (discordconf.ostatus == "invisible") {
                                                var invisibleselected = "selected "
                                            }
                                        } else { // Else, use online as default as Discord does
                                            var onlineselected = "selected "
                                        }
                                        if (discordconf.pstatus !== undefined) { // If these aren't undefined, use the status in the config, else set as blank
                                            var pstatus = discordconf.pstatus
                                        } else {
                                            var pstatus = ""
                                        }
                                        if (discordconf.guildid !== undefined) {
                                            var guildid = discordconf.guildid
                                        } else {
                                            var guildid = ""
                                        }
                                        if (discordconf.moderatorsroleid !== undefined) {
                                            var guildid = discordconf.moderatorsroleid
                                        } else {
                                            var moderatorsroleid = ""
                                        }
                                        res.status(200);
                                        res.render('../src/server/pages/config-2.ejs', {
                                            projname: uniconf.projname,
                                            metadomain: uniconf.metadomain,
                                            metaurl: "https://" + uniconf.metadomain,
                                            wikiurl: "https://wiki." + uniconf.metadomain,
                                            discord: uniconf.discord,
                                            unknownerror: false,
                                            badclientsecret: false,
                                            onlineselected: onlineselected,
                                            idleselected: idleselected,
                                            dndselected: dndselected,
                                            invisibleselected: invisibleselected,
                                            guildid: guildid,
                                            pstatus: pstatus,
                                            moderatorsroleid: moderatorsroleid,
                                            i18npagetitle: translate(lang, 'page_configpagetitle'),
                                            i18ngithub: translate(lang, 'page_globalgithub'),
                                            i18ngdescription: translate(lang, 'page_globaldescription'),
                                            i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                            i18ndiscord: translate(lang, 'page_globaldiscord'),
                                            i18ndashboard: translate(lang, 'page_noconfdashboard'),
                                            i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                                            i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                                            i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                                            i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                                            i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                                            i18ndiscordserver: translate(lang, 'global_discordserver'),
                                            i18ndbaccessdenied: translate(lang, 'page_accessdenied'),
                                            i18ndbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig2'),
                                            i18nrefreshthepage: translate(lang, 'page_globalrefreshthepage'),
                                            i18nmysqlconfinterimdeleted: translate(lang, 'page_mysqlconfinterimdeleted'),
                                            i18nmysqlconfinterimdeleteddiag: translate(lang, 'page_mysqlconfinterimdeleteddiag'),
                                            i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                                            i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig2'),
                                            i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig2'),
                                            i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig2'),
                                            i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                                            i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                                            i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                                            i18ninvalidtoken: translate(lang, 'page_tokeninvalid'),
                                            i18ninvalidtokendiag: translate(lang, 'page_tokeninvaliddiag'),
                                            i18nbadclientsecret: translate(lang, 'page_badclientsecret'),
                                            i18nbadclientsecretdiag: translate(lang, 'page_badclientsecretdiag'),
                                            i18nunknownerror: translate(lang, 'page_confunknownerror'),
                                            i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                                            i18ncannotconnecttodiscord: translate(lang, 'page_cannotconnecttodiscord'),
                                            i18ncannotconnecttodiscorddiag: translate(lang, 'page_cannotconnecttodiscorddiag'),
                                            i18nunknowndiscorderror: translate(lang, 'page_unknowndiscorderror'),
                                            i18ndiscordtoken: translate(lang, 'page_discordtoken'),
                                            i18nclientsecret: translate(lang, 'page_clientsecret'),
                                            i18nplayingstatus: translate(lang, 'page_playingstatus'),
                                            i18nstatus: translate(lang, 'page_status'),
                                            i18nonline: translate(lang, 'page_online'),
                                            i18nidle: translate(lang, 'page_invisible'),
                                            i18ndnd: translate(lang, 'page_dnd'),
                                            i18ninvisible: translate(lang, 'page_invisible'),
                                            i18nsupportguildid: translate(lang, 'page_supportguildid'),
                                            i18nmoderatorsroleid: translate(lang, 'page_moderatorsroleid'),
                                            i18nmysqlpassword: translate(lang, 'page_mysqlpassword'),
                                            i18nnextbutton: translate(lang, 'page_globalnext'),
                                            i18nsubmittingdiscord: translate(lang, 'page_submittingdiscord'),
                                            i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                                            i18nheadertitle: translate(lang, 'page_configheader'),
                                            i18nsteptwo: translate(lang, 'page_configstep2')
                                        });
                                    })
                            } else {
                                res.status(200); // Send response of second page of config
                                res.render('../src/server/pages/config-2.ejs', {
                                    projname: uniconf.projname,
                                    metadomain: uniconf.metadomain,
                                    metaurl: "https://" + uniconf.metadomain,
                                    wikiurl: "https://wiki." + uniconf.metadomain,
                                    discord: uniconf.discord,
                                    unknownerror: false,
                                    badclientsecret: false,
                                    onlineselected: "selected ",
                                    idleselected: "",
                                    dndselected: "",
                                    invisibleselected: "",
                                    guildid: "",
                                    pstatus: "",
                                    moderatorsroleid: "",
                                    i18npagetitle: translate(lang, 'page_configpagetitle'),
                                    i18ngithub: translate(lang, 'page_globalgithub'),
                                    i18ngdescription: translate(lang, 'page_globaldescription'),
                                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                                    i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                                    i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                                    i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                                    i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                                    i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                                    i18ndiscordserver: translate(lang, 'global_discordserver'),
                                    i18ndbaccessdenied: translate(lang, 'page_accessdenied'),
                                    i18ndbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig2'),
                                    i18nrefreshthepage: translate(lang, 'page_globalrefreshthepage'),
                                    i18nmysqlconfinterimdeleted: translate(lang, 'page_mysqlconfinterimdeleted'),
                                    i18nmysqlconfinterimdeleteddiag: translate(lang, 'page_mysqlconfinterimdeleteddiag'),
                                    i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                                    i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig2'),
                                    i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig2'),
                                    i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig2'),
                                    i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                                    i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                                    i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                                    i18ninvalidtoken: translate(lang, 'page_tokeninvalid'),
                                    i18ninvalidtokendiag: translate(lang, 'page_tokeninvaliddiag'),
                                    i18nbadclientsecret: translate(lang, 'page_badclientsecret'),
                                    i18nbadclientsecretdiag: translate(lang, 'page_badclientsecretdiag'),
                                    i18nunknownerror: translate(lang, 'page_confunknownerror'),
                                    i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                                    i18ncannotconnecttodiscord: translate(lang, 'page_cannotconnecttodiscord'),
                                    i18ncannotconnecttodiscorddiag: translate(lang, 'page_cannotconnecttodiscorddiag'),
                                    i18nunknowndiscorderror: translate(lang, 'page_unknowndiscorderror'),
                                    i18ndiscordtoken: translate(lang, 'page_discordtoken'),
                                    i18nclientsecret: translate(lang, 'page_clientsecret'),
                                    i18nplayingstatus: translate(lang, 'page_playingstatus'),
                                    i18nstatus: translate(lang, 'page_status'),
                                    i18nonline: translate(lang, 'page_online'),
                                    i18nidle: translate(lang, 'page_invisible'),
                                    i18ndnd: translate(lang, 'page_dnd'),
                                    i18ninvisible: translate(lang, 'page_invisible'),
                                    i18nsupportguildid: translate(lang, 'page_supportguildid'),
                                    i18nmoderatorsroleid: translate(lang, 'page_moderatorsroleid'),
                                    i18nmysqlpassword: translate(lang, 'page_mysqlpassword'),
                                    i18nnextbutton: translate(lang, 'page_globalnext'),
                                    i18nsubmittingdiscord: translate(lang, 'page_submittingdiscord'),
                                    i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                                    i18nheadertitle: translate(lang, 'page_configheader'),
                                    i18nsteptwo: translate(lang, 'page_configstep2')
                                });
                            }
                        }
                    })
                        .catch(err => { // Prefill values, if they aren't defined in the config, give default values
                            if (mysqlconf.hostname !== undefined) {
                                var hostname = mysqlconf.hostname
                            } else {
                                var hostname = "localhost"
                            }
                            if (mysqlconf.username !== undefined) {
                                var username = mysqlconf.username
                            } else {
                                var username = "btsbot"
                            }
                            if (mysqlconf.database !== undefined) {
                                var database = mysqlconf.database
                            } else {
                                var database = "btsbot"
                            }
                            if (mysqlconf.tableprefix !== undefined) {
                                var tableprefix = mysqlconf.tableprefix
                            } else {
                                var tableprefix = ""
                            }
                            if (mysqlconf.language !== undefined) {
                                getlang().then(conflang => {
                                    global.setlang = conflang
                                })
                            } else {
                                var setlang = uniconf.defaultlanguage
                            }
                            res.status(200);
                            geti18n().then(langs => {
                                res.render('../src/server/pages/config-1.ejs', { // Render the page
                                    i18npagetitle: translate(lang, 'page_configpagetitle'),
                                    i18ngdescription: translate(lang, 'page_globaldesc'),
                                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                                    i18ngithub: translate(lang, 'page_globalgithub'),
                                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                                    i18nheadertitle: translate(lang, 'page_configheader'),
                                    i18nstepone: translate(lang, 'page_configstep1'),
                                    i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                                    i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                                    i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                                    i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                                    i18ndiscordserver: translate(lang, 'global_discorderver'),
                                    i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                                    i18dbaccessdenied: translate(lang, 'page_accessdeniedconfig1'),
                                    i18dbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig1'),
                                    i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                                    i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig1'),
                                    i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig1'),
                                    i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig1'),
                                    i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                                    i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                                    i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                                    i18nunknownerror: translate(lang, 'page_confunknownerror'),
                                    i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                                    i18ndefaultlanguage: translate(lang, 'page_defaultlanguagelabel'),
                                    i18ndbhost: translate(lang, 'page_dbhostlabel'),
                                    i18ndbusermame: translate(lang, 'page_dbusernamelabel'),
                                    i18ndbpassword: translate(lang, 'page_dbpasswordlabel'),
                                    i18ndb: translate(lang, 'page_dblabel'),
                                    i18ndbtableprefix: translate(lang, 'page_dbtableprefixlabel'),
                                    i18nnextbutton: translate(lang, 'page_globalnext'),
                                    i18nsubmittingmysql: translate(lang, 'page_submittingmysql'),
                                    page_globalneedhelp: translate(lang, 'i18nneedhelp'),
                                    i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                                    defaultlanguage: setlang,
                                    projname: uniconf.projname,
                                    metadomain: uniconf.metadomain,
                                    metaurl: "https://" + uniconf.metadomain,
                                    wikiurl: "https://wiki." + uniconf.metadomain,
                                    discord: uniconf.discord,
                                    langs: langs,
                                    hostname: hostname,
                                    username: username,
                                    database: database,
                                    tableprefix: tableprefix
                                });
                            })
                        })
                } else {
                    res.status(200);
                    // Get all of the language files so that they can be represented when asking the user to select what language they wish to set as their display language
                    geti18n().then(langs => {
                        res.render('../src/server/pages/config-1.ejs', { // Render the page
                            i18npagetitle: translate(lang, 'page_configpagetitle'),
                            i18ngdescription: translate(lang, 'page_globaldesc'),
                            i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                            i18ndiscord: translate(lang, 'page_globaldiscord'),
                            i18ngithub: translate(lang, 'page_globalgithub'),
                            i18ndashboard: translate(lang, 'page_noconfdashboard'),
                            i18nheadertitle: translate(lang, 'page_configheader'),
                            i18nstepone: translate(lang, 'page_configstep1'),
                            i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                            i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                            i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                            i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                            i18ndiscordserver: translate(lang, 'global_discorderver'),
                            i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                            i18dbaccessdenied: translate(lang, 'page_accessdeniedconfig1'),
                            i18dbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig1'),
                            i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                            i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig1'),
                            i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig1'),
                            i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig1'),
                            i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                            i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                            i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                            i18nunknownerror: translate(lang, 'page_confunknownerror'),
                            i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                            i18ndefaultlanguage: translate(lang, 'page_defaultlanguagelabel'),
                            i18ndbhost: translate(lang, 'page_dbhostlabel'),
                            i18ndbusermame: translate(lang, 'page_dbusernamelabel'),
                            i18ndbpassword: translate(lang, 'page_dbpasswordlabel'),
                            i18ndb: translate(lang, 'page_dblabel'),
                            i18ndbtableprefix: translate(lang, 'page_dbtableprefixlabel'),
                            i18nnextbutton: translate(lang, 'page_globalnext'),
                            i18nsubmittingmysql: translate(lang, 'page_submittingmysql'),
                            page_globalneedhelp: translate(lang, 'i18nneedhelp'),
                            i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                            defaultlanguage: uniconf.defaultlanguage,
                            projname: uniconf.projname,
                            metadomain: uniconf.metadomain,
                            metaurl: "https://" + uniconf.metadomain,
                            wikiurl: "https://wiki." + uniconf.metadomain,
                            discord: uniconf.discord,
                            langs: langs,
                            hostname: "localhost",
                            username: "btsbot",
                            database: "btsbot",
                            tableprefix: ""
                        });
                    })
                }
            }
            else if (err == "MISSING_FIELDS") {
                const conf = require('../configs/conf.json')
                if (!fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json')) && (conf.hostname === undefined || conf.username === undefined || conf.db === undefined || conf.tableprefix === undefined || conf.language == undefined)) { // Check if MySQL conf exists, if not present page
                    if (conf.hostname !== undefined) { // If any are missing, fill with default
                        var hostname = conf.hostname
                    } else var hostname = "localhost"
                    if (conf.language !== undefined) {
                        var defaultlanguage = conf.language
                    } else var defaultlanguage = uniconf.defaultlanguage
                    if (conf.username !== undefined) {
                        var username = conf.username
                    } else var username = "btsbot"
                    if (conf.tableprefix !== undefined) {
                        var tableprefix = conf.tableprefix
                    } else var tableprefix = ""
                    if (conf.db !== undefined) {
                        var db = conf.db
                    } else var db = "btsbot"
                    geti18n().then(langs => {
                        res.render('../src/server/pages/config-1.ejs', { // Render the page
                            i18npagetitle: translate(lang, 'page_configpagetitle'),
                            i18ngdescription: translate(lang, 'page_globaldesc'),
                            i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                            i18ndiscord: translate(lang, 'page_globaldiscord'),
                            i18ngithub: translate(lang, 'page_globalgithub'),
                            i18ndashboard: translate(lang, 'page_noconfdashboard'),
                            i18nheadertitle: translate(lang, 'page_configheader'),
                            i18nstepone: translate(lang, 'page_configstep1'),
                            i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                            i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                            i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                            i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                            i18ndiscordserver: translate(lang, 'global_discorderver'),
                            i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                            i18dbaccessdenied: translate(lang, 'page_accessdeniedconfig1'),
                            i18dbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig1'),
                            i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                            i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig1'),
                            i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig1'),
                            i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig1'),
                            i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                            i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                            i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                            i18nunknownerror: translate(lang, 'page_confunknownerror'),
                            i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                            i18ndefaultlanguage: translate(lang, 'page_defaultlanguagelabel'),
                            i18ndbhost: translate(lang, 'page_dbhostlabel'),
                            i18ndbusermame: translate(lang, 'page_dbusernamelabel'),
                            i18ndbpassword: translate(lang, 'page_dbpasswordlabel'),
                            i18ndb: translate(lang, 'page_dblabel'),
                            i18ndbtableprefix: translate(lang, 'page_dbtableprefixlabel'),
                            i18nnextbutton: translate(lang, 'page_globalnext'),
                            i18nsubmittingmysql: translate(lang, 'page_submittingmysql'),
                            page_globalneedhelp: translate(lang, 'i18nneedhelp'),
                            i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                            defaultlanguage: defaultlanguage,
                            projname: uniconf.projname,
                            metadomain: uniconf.metadomain,
                            metaurl: "https://" + uniconf.metadomain,
                            wikiurl: "https://wiki." + uniconf.metadomain,
                            discord: uniconf.discord,
                            langs: langs,
                            hostname: hostname,
                            username: username,
                            database: db,
                            tableprefix: tableprefix
                        });
                    })
                } else if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json')) && (conf.hostname === undefined || conf.username === undefined || conf.db === undefined || conf.tableprefix === undefined || conf.language === undefined)) { // Create conf.json again if MySQL conf does exist
                    const mysqlconf = require('../configs/mysqlconfinterim.json')
                    if (mysqlconf.hostname !== undefined || mysqlconf.username !== undefined || mysqlconf.password !== undefined || mysqlconf.db !== undefined || mysqlconf.tableprefix !== undefined || mysqlconf.language !== undefined) {
                        if (conf.owner === undefined) {
                            if (conf.token !== undefined) { // Create owner value if undefined
                                fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Get owner IDs
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bot ${conf.token}`,
                                        'Transfer-Encoding': 'chunked'
                                    }
                                })
                                    .then(res => res.json())
                                    .then(applicationinfo => {
                                        var owner = []
                                        if (applicationinfo.team != undefined) { // Check if team, if team add all members to the conf
                                            for (var i in applicationinfo.team.members) {
                                                owner.push(`"${applicationinfo.team.members[i].user.id}"`)
                                            }
                                            var owner = "[" + owner + "]"
                                        } else if (json.message) {
                                            var owner = "?" // This is a ZWNJ, which should not be in an ID, and no one would put it there, people wouldd set their owner ID to be blank for whatever reason though
                                        } else {
                                            var owner = `"${applicationinfo.owner.id}"`
                                        }
                                    }).catch(err => {
                                        if (err.name == "FetchError") {
                                            global.owner = "?"
                                        }
                                    })
                            } else var owner = conf.owner
                            if (owner == "?") { // ZWNJ
                                var owner = "" // Legitimately blank
                            } else {
                                var owner = `\n  "owner": ${owner}` // Plonk owner ID
                            }
                        } else {
                            if (Array.isArray(conf.owner)) {
                                var owner = []
                                for (var i in conf.owner) {
                                    owner.push("\"" + conf.owner[i] + "\"")
                                }
                                var owner = "[" + owner + "]"
                            } else {
                                var owner = conf.owner
                            }
                            var owner = `\n  "owner": ${owner}` // Owner ID
                        }
                        if (conf.password !== undefined) { // Check if any Discord conf settings are missing before putting them into the conf
                            var password = `\n  "password": "${conf.password}",`
                        } else var password = ""
                        if (conf.token !== undefined) {
                            var token = `\n  "token": "${conf.token}",`
                        } else var token = ""
                        if (conf.clientsecret !== undefined) {
                            var clientsecret = `\n  "clientsecret": "${conf.clientsecret}",`
                        } else var clientsecret = ""
                        if (conf.ostatus !== undefined) {
                            var ostatus = `\n  "ostatus": "${conf.ostatus}",`
                        } else var ostatus = ""
                        if (conf.pstatus !== undefined) {
                            var pstatus = `\n  "pstatus": "${conf.pstatus}",`
                        } else var pstatus = ""
                        if (conf.moderatorsroleid !== undefined) {
                            var moderatorsroleid = `\n  "moderatorsroleid": "${conf.moderatorsroleid}",`
                        } else var moderatorsroleid = ""
                        if (conf.guildid !== undefined) {
                            var guildid = `\n  "guildid": "${conf.guildid}",`
                        } else var guildid = ""
                        fs.writeFile('src/configs/conf.json', `{\n  "language": "${mysqlconf.language}",\n  "hostname": "${mysqlconf.hostname}",\n  "db": "${mysqlconf.database}",\n  "username": "${mysqlconf.username}",${password}\n  "tableprefix": "${mysqlconf.tableprefix}",${token}${clientsecret}${ostatus}${pstatus}${moderatorsroleid}${guildid}${owner}\n}`, function (err) { // Save conf file
                            if (err) throw err;
                            if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json'))) { // Delete interim conf files
                                fs.unlink('src/configs/mysqlconfinterim.json', function (err) {
                                    if (err) throw err;
                                })
                            }
                            if (fs.existsSync(path.join(__dirname, '..', 'configs', 'discordconfinterim.json'))) {
                                fs.unlink('src/configs/discordconfinterim.json', function (err) {
                                    if (err) throw err;
                                })
                            }
                        })
                        res.redirect('/')
                    } else {
                        if (mysqlconf.hostname !== undefined) { // If any are missing, fill with default
                            var hostname = mysqlconf.hostname
                        } else var hostname = "localhost"
                        if (mysqlconf.language !== undefined) {
                            var defaultlanguage = mysqlconf.language
                        } else var defaultlanguage = uniconf.defaultlanguage
                        if (mysqlconf.username !== undefined) {
                            var username = mysqlconf.username
                        } else var username = "btsbot"
                        if (mysqlconf.tableprefix !== undefined) {
                            var tableprefix = mysqlconf.tableprefix
                        } else var tableprefix = ""
                        if (mysqlconf.db !== undefined) {
                            var db = mysqlconf.db
                        } else var db = "btsbot"
                        geti18n().then(langs => {
                            log.temp('line 983')
                            res.render('../src/server/pages/config-1.ejs', { // Render the page
                                i18npagetitle: translate(lang, 'page_configpagetitle'),
                                i18ngdescription: translate(lang, 'page_globaldesc'),
                                i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                i18ndiscord: translate(lang, 'page_globaldiscord'),
                                i18ngithub: translate(lang, 'page_globalgithub'),
                                i18ndashboard: translate(lang, 'page_noconfdashboard'),
                                i18nheadertitle: translate(lang, 'page_configheader'),
                                i18nstepone: translate(lang, 'page_configstep1'),
                                i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                                i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                                i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                                i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                                i18ndiscordserver: translate(lang, 'global_discorderver'),
                                i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                                i18dbaccessdenied: translate(lang, 'page_accessdeniedconfig1'),
                                i18dbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig1'),
                                i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                                i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig1'),
                                i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig1'),
                                i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig1'),
                                i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                                i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                                i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                                i18nunknownerror: translate(lang, 'page_confunknownerror'),
                                i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                                i18ndefaultlanguage: translate(lang, 'page_defaultlanguagelabel'),
                                i18ndbhost: translate(lang, 'page_dbhostlabel'),
                                i18ndbusermame: translate(lang, 'page_dbusernamelabel'),
                                i18ndbpassword: translate(lang, 'page_dbpasswordlabel'),
                                i18ndb: translate(lang, 'page_dblabel'),
                                i18ndbtableprefix: translate(lang, 'page_dbtableprefixlabel'),
                                i18nnextbutton: translate(lang, 'page_globalnext'),
                                i18nsubmittingmysql: translate(lang, 'page_submittingmysql'),
                                page_globalneedhelp: translate(lang, 'i18nneedhelp'),
                                i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                                defaultlanguage: defaultlanguage,
                                projname: uniconf.projname,
                                metadomain: uniconf.metadomain,
                                metaurl: "https://" + uniconf.metadomain,
                                wikiurl: "https://wiki." + uniconf.metadomain,
                                discord: uniconf.discord,
                                langs: langs,
                                hostname: hostname,
                                username: username,
                                database: db,
                                tableprefix: tableprefix
                            });
                        })
                    }
                } else if (!fs.existsSync(path.join(__dirname, '..', 'configs', 'discordconfinterim.json')) && (conf.password === undefined || conf.token === undefined || conf.clientsecret === undefined || conf.ostatus === undefined || conf.pstatus === undefined || conf.moderatorsroleid === undefined)) {
                    if (conf.ostatus !== undefined) { // If any are missing, fill with default again
                        var ostatus = conf.ostatus
                    } else var ostatus = "online"
                    if (conf.pstatus !== undefined) {
                        var pstatus = conf.pstatus
                    } else var pstatus = ""
                    if (conf.moderatorsroleid !== undefined) {
                        var moderatorsroleid = conf.moderatorsroleid
                    } else var moderatorsroleid = ""
                    if (conf.guildid !== undefined) {
                        var guildid = conf.guidid
                    } else var guildid = ""

                    if (ostatus == "online") {
                        var onlineselected = "selected "
                    }
                    else if (ostatus == "idle") {
                        var idleselected = "selected "
                    }
                    else if (ostatus == "dnd") {
                        var dndselected = "selected "
                    }
                    else if (ostatus == "invisible") {
                        var invisibleselected = "selected "
                    }
                    res.status(200);
                    log.temp('line 1061')
                    res.render('../src/server/pages/config-2.ejs', {
                        projname: uniconf.projname,
                        metadomain: uniconf.metadomain,
                        metaurl: "https://" + uniconf.metadomain,
                        wikiurl: "https://wiki." + uniconf.metadomain,
                        discord: uniconf.discord,
                        unknownerror: false,
                        badclientsecret: false,
                        onlineselected: onlineselected,
                        idleselected: idleselected,
                        dndselected: dndselected,
                        invisibleselected: invisibleselected,
                        guildid: guildid,
                        pstatus: pstatus,
                        moderatorsroleid: moderatorsroleid,
                        i18npagetitle: translate(lang, 'page_configpagetitle'),
                        i18ngithub: translate(lang, 'page_globalgithub'),
                        i18ngdescription: translate(lang, 'page_globaldescription'),
                        i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                        i18ndiscord: translate(lang, 'page_globaldiscord'),
                        i18ndashboard: translate(lang, 'page_noconfdashboard'),
                        i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                        i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                        i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                        i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                        i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                        i18ndiscordserver: translate(lang, 'global_discordserver'),
                        i18ndbaccessdenied: translate(lang, 'page_accessdenied'),
                        i18ndbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig2'),
                        i18nrefreshthepage: translate(lang, 'page_globalrefreshthepage'),
                        i18nmysqlconfinterimdeleted: translate(lang, 'page_mysqlconfinterimdeleted'),
                        i18nmysqlconfinterimdeleteddiag: translate(lang, 'page_mysqlconfinterimdeleteddiag'),
                        i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                        i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig2'),
                        i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig2'),
                        i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig2'),
                        i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                        i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                        i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                        i18ninvalidtoken: translate(lang, 'page_tokeninvalid'),
                        i18ninvalidtokendiag: translate(lang, 'page_tokeninvaliddiag'),
                        i18nbadclientsecret: translate(lang, 'page_badclientsecret'),
                        i18nbadclientsecretdiag: translate(lang, 'page_badclientsecretdiag'),
                        i18nunknownerror: translate(lang, 'page_confunknownerror'),
                        i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                        i18ncannotconnecttodiscord: translate(lang, 'page_cannotconnecttodiscord'),
                        i18ncannotconnecttodiscorddiag: translate(lang, 'page_cannotconnecttodiscorddiag'),
                        i18nunknowndiscorderror: translate(lang, 'page_unknowndiscorderror'),
                        i18ndiscordtoken: translate(lang, 'page_discordtoken'),
                        i18nclientsecret: translate(lang, 'page_clientsecret'),
                        i18nplayingstatus: translate(lang, 'page_playingstatus'),
                        i18nstatus: translate(lang, 'page_status'),
                        i18nonline: translate(lang, 'page_online'),
                        i18nidle: translate(lang, 'page_invisible'),
                        i18ndnd: translate(lang, 'page_dnd'),
                        i18ninvisible: translate(lang, 'page_invisible'),
                        i18nsupportguildid: translate(lang, 'page_supportguildid'),
                        i18nmoderatorsroleid: translate(lang, 'page_moderatorsroleid'),
                        i18nmysqlpassword: translate(lang, 'page_mysqlpassword'),
                        i18nnextbutton: translate(lang, 'page_globalnext'),
                        i18nsubmittingdiscord: translate(lang, 'page_submittingdiscord'),
                        i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                        i18nheadertitle: translate(lang, 'page_configheader'),
                        i18nsteptwo: translate(lang, 'page_configstep2')
                    });
                } else if (fs.existsSync(path.join(__dirname, '..', 'configs', 'discordconfinterim.json')) && (conf.password === undefined || conf.token === undefined || conf.clientsecret === undefined || conf.ostatus === undefined || conf.pstatus === undefined || conf.moderatorsroleid === undefined || conf.guildid === undefined)) {
                    var discordconf = require('../configs/discordconfinterim.json')
                    if (discordconf.mysqlpassword === undefined || discordconf.token === undefined || discordconf.clientsecret === undefined || discordconf.ostatus === undefined || discordconf.pstatus === undefined || discordconf.moderatorsroleid === undefined || conf.guildid === undefined) {
                        log.temp('line 1130')
                        if (discordconf.ostatus !== undefined) { // If any are missing, fill with default again
                            var ostatus = discordconf.ostatus
                        } else var ostatus = "online"
                        if (discordconf.pstatus !== undefined) {
                            var pstatus = discordconf.pstatus
                        } else var pstatus = ""
                        if (discordconf.moderatorsroleid !== undefined) {
                            var moderatorsroleid = discordconf.moderatorsroleid
                        } else var moderatorsroleid = ""
                        if (discordconf.guildid !== undefined) {
                            var guildid = discordconf.guidid
                        } else var guildid = ""

                        if (ostatus == "online") {
                            var onlineselected = "selected "
                        }
                        else if (ostatus == "idle") {
                            var idleselected = "selected "
                        }
                        else if (ostatus == "dnd") {
                            var dndselected = "selected "
                        }
                        else if (ostatus == "invisible") {
                            var invisibleselected = "selected "
                        }
                        res.status(200);
                        log.temp('1156')
                        res.render('../src/server/pages/config-2.ejs', {
                            projname: uniconf.projname,
                            metadomain: uniconf.metadomain,
                            metaurl: "https://" + uniconf.metadomain,
                            wikiurl: "https://wiki." + uniconf.metadomain,
                            discord: uniconf.discord,
                            unknownerror: false,
                            badclientsecret: false,
                            onlineselected: onlineselected,
                            idleselected: idleselected,
                            dndselected: dndselected,
                            invisibleselected: invisibleselected,
                            guildid: guildid,
                            pstatus: pstatus,
                            moderatorsroleid: moderatorsroleid,
                            i18npagetitle: translate(lang, 'page_configpagetitle'),
                            i18ngithub: translate(lang, 'page_globalgithub'),
                            i18ngdescription: translate(lang, 'page_globaldescription'),
                            i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                            i18ndiscord: translate(lang, 'page_globaldiscord'),
                            i18ndashboard: translate(lang, 'page_noconfdashboard'),
                            i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                            i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                            i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                            i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                            i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                            i18ndiscordserver: translate(lang, 'global_discordserver'),
                            i18ndbaccessdenied: translate(lang, 'page_accessdenied'),
                            i18ndbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig2'),
                            i18nrefreshthepage: translate(lang, 'page_globalrefreshthepage'),
                            i18nmysqlconfinterimdeleted: translate(lang, 'page_mysqlconfinterimdeleted'),
                            i18nmysqlconfinterimdeleteddiag: translate(lang, 'page_mysqlconfinterimdeleteddiag'),
                            i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                            i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig2'),
                            i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig2'),
                            i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig2'),
                            i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                            i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                            i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                            i18ninvalidtoken: translate(lang, 'page_tokeninvalid'),
                            i18ninvalidtokendiag: translate(lang, 'page_tokeninvaliddiag'),
                            i18nbadclientsecret: translate(lang, 'page_badclientsecret'),
                            i18nbadclientsecretdiag: translate(lang, 'page_badclientsecretdiag'),
                            i18nunknownerror: translate(lang, 'page_confunknownerror'),
                            i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                            i18ncannotconnecttodiscord: translate(lang, 'page_cannotconnecttodiscord'),
                            i18ncannotconnecttodiscorddiag: translate(lang, 'page_cannotconnecttodiscorddiag'),
                            i18nunknowndiscorderror: translate(lang, 'page_unknowndiscorderror'),
                            i18ndiscordtoken: translate(lang, 'page_discordtoken'),
                            i18nclientsecret: translate(lang, 'page_clientsecret'),
                            i18nplayingstatus: translate(lang, 'page_playingstatus'),
                            i18nstatus: translate(lang, 'page_status'),
                            i18nonline: translate(lang, 'page_online'),
                            i18nidle: translate(lang, 'page_invisible'),
                            i18ndnd: translate(lang, 'page_dnd'),
                            i18ninvisible: translate(lang, 'page_invisible'),
                            i18nsupportguildid: translate(lang, 'page_supportguildid'),
                            i18nmoderatorsroleid: translate(lang, 'page_moderatorsroleid'),
                            i18nmysqlpassword: translate(lang, 'page_mysqlpassword'),
                            i18nnextbutton: translate(lang, 'page_globalnext'),
                            i18nsubmittingdiscord: translate(lang, 'page_submittingdiscord'),
                            i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                            i18nheadertitle: translate(lang, 'page_configheader'),
                            i18nsteptwo: translate(lang, 'page_configstep2')
                        });
                    } else {
                        checkdiscord(discordconf.token).then(result => { // Validate token
                            if (result == "ASSUME_CLIENT_SECRET_IS_CORRECT") {
                                getid(discordconf.token).then(id => {
                                    if (!req.query.code) {
                                        if (req.headers['x-forwarded-host']) {
                                            var hostname = encodeURIComponent('http://' + req.headers['x-forwarded-host'])
                                        } else {
                                            var hostname = encodeURIComponent('http://' + req.headers.host)
                                        }
                                        res.redirect('https://discord.com/oauth2/authorize?client_id=' + id + '&redirect_uri=' + hostname + '/config&response_type=code&scope=identify&prompt=none') // Redirect to OAuth2 page
                                    } else {
                                        fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Get owner IDs
                                            method: 'GET',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bot ${discordconf.token}`,
                                                'Transfer-Encoding': 'chunked'
                                            }
                                        })
                                            .then(res => res.json())
                                            .then(applicationinfo => {
                                                if (applicationinfo.team != undefined) { // Check if team, if team add all members to the conf
                                                    var owner = []
                                                    for (var i in applicationinfo.team.members) {
                                                        owner.push(`"${applicationinfo.team.members[i].user.id}"`)
                                                    }
                                                    var owner = "[" + owner + "]"
                                                } else {
                                                    var owner = `"${applicationinfo.owner.id}"`
                                                }
                                                if (conf.hostname !== undefined) { // Check if any MySQL conf settings are missing before putting them into the conf
                                                    var hostname = `\n  "hostname": "${conf.hostname}",`
                                                } else var hostname = ""
                                                if (conf.username !== undefined) {
                                                    var username = `\n  "username": "${conf.username}",`
                                                } else var username = ""
                                                if (conf.tableprefix !== undefined) {
                                                    var tableprefix = `\n  "tableprefix": "${conf.tableprefix}",`
                                                } else var tableprefix = ""
                                                if (conf.db !== undefined) {
                                                    var db = `\n  "db": "${conf.db}",`
                                                } else var db = ""
                                                if (conf.language !== undefined) {
                                                    var language = `\n  "language": "${conf.language}",`
                                                } else var language = ""
                                                fs.writeFile('src/configs/conf.json', `{${language}${hostname}${username}\n  "password": "${discordconf.mysqlpassword}",${db}${tableprefix}\n  "token": "${discordconf.token}",\n  "clientsecret": "${discordconf.clientsecret}",\n  "ostatus": "${discordconf.ostatus}",\n  "pstatus": "${discordconf.pstatus}",\n  "moderatorsroleid": "${discordconf.moderatorsroleid}",\n  "guildid": "${discordconf.guildid}",\n  "owner": ${owner}\n}`, function (err) { // Save conf file
                                                    if (err) throw err;
                                                    if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json'))) { // Delete interim conf files
                                                        fs.unlink('src/configs/mysqlconfinterim.json', function (err) {
                                                            if (err) throw err;
                                                        })
                                                    }
                                                    if (fs.existsSync(path.join(__dirname, '..', 'configs', 'discordconfinterim.json'))) {
                                                        fs.unlink('src/configs/discordconfinterim.json', function (err) {
                                                            if (err) throw err;
                                                        })
                                                    }
                                                    res.redirect('/')
                                                    restart()
                                                })
                                            })
                                    }
                                })
                            }
                        }).catch(err => {
                            if (err === "TOKEN_INVALID" || err === "UNKNOWN_DISCORD_ERROR") {
                                if (discordconf.ostatus !== undefined) { // If any are missing, fill with default again
                                    var ostatus = discordconf.ostatus
                                } else var ostatus = "online"
                                if (discordconf.pstatus !== undefined) {
                                    var pstatus = discordconf.pstatus
                                } else var pstatus = ""
                                if (discordconf.moderatorsroleid !== undefined) {
                                    var moderatorsroleid = discordconf.moderatorsroleid
                                } else var moderatorsroleid = ""
                                if (discordconf.guildid !== undefined) {
                                    var guildid = discordconf.guidid
                                } else var guildid = ""

                                if (ostatus == "online") {
                                    var onlineselected = "selected "
                                }
                                else if (ostatus == "idle") {
                                    var idleselected = "selected "
                                }
                                else if (ostatus == "dnd") {
                                    var dndselected = "selected "
                                }
                                else if (ostatus == "invisible") {
                                    var invisibleselected = "selected "
                                }
                                res.status(200);
                                log.temp('line 1275')
                                res.render('../src/server/pages/config-2.ejs', {
                                    projname: uniconf.projname,
                                    metadomain: uniconf.metadomain,
                                    metaurl: "https://" + uniconf.metadomain,
                                    wikiurl: "https://wiki." + uniconf.metadomain,
                                    discord: uniconf.discord,
                                    unknownerror: false,
                                    badclientsecret: false,
                                    onlineselected: onlineselected,
                                    idleselected: idleselected,
                                    dndselected: dndselected,
                                    invisibleselected: invisibleselected,
                                    guildid: guildid,
                                    pstatus: pstatus,
                                    moderatorsroleid: moderatorsroleid,
                                    i18npagetitle: translate(lang, 'page_configpagetitle'),
                                    i18ngithub: translate(lang, 'page_globalgithub'),
                                    i18ngdescription: translate(lang, 'page_globaldescription'),
                                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                                    i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
                                    i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
                                    i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
                                    i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
                                    i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
                                    i18ndiscordserver: translate(lang, 'global_discordserver'),
                                    i18ndbaccessdenied: translate(lang, 'page_accessdenied'),
                                    i18ndbaccessdenieddiag: translate(lang, 'page_accessdenieddiagconfig2'),
                                    i18nrefreshthepage: translate(lang, 'page_globalrefreshthepage'),
                                    i18nmysqlconfinterimdeleted: translate(lang, 'page_mysqlconfinterimdeleted'),
                                    i18nmysqlconfinterimdeleteddiag: translate(lang, 'page_mysqlconfinterimdeleteddiag'),
                                    i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
                                    i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiagconfig2'),
                                    i18ndbbadcreds: translate(lang, 'page_dbbadcredsconfig2'),
                                    i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiagconfig2'),
                                    i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
                                    i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
                                    i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
                                    i18ninvalidtoken: translate(lang, 'page_tokeninvalid'),
                                    i18ninvalidtokendiag: translate(lang, 'page_tokeninvaliddiag'),
                                    i18nbadclientsecret: translate(lang, 'page_badclientsecret'),
                                    i18nbadclientsecretdiag: translate(lang, 'page_badclientsecretdiag'),
                                    i18nunknownerror: translate(lang, 'page_confunknownerror'),
                                    i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
                                    i18ncannotconnecttodiscord: translate(lang, 'page_cannotconnecttodiscord'),
                                    i18ncannotconnecttodiscorddiag: translate(lang, 'page_cannotconnecttodiscorddiag'),
                                    i18nunknowndiscorderror: translate(lang, 'page_unknowndiscorderror'),
                                    i18ndiscordtoken: translate(lang, 'page_discordtoken'),
                                    i18nclientsecret: translate(lang, 'page_clientsecret'),
                                    i18nplayingstatus: translate(lang, 'page_playingstatus'),
                                    i18nstatus: translate(lang, 'page_status'),
                                    i18nonline: translate(lang, 'page_online'),
                                    i18nidle: translate(lang, 'page_invisible'),
                                    i18ndnd: translate(lang, 'page_dnd'),
                                    i18ninvisible: translate(lang, 'page_invisible'),
                                    i18nsupportguildid: translate(lang, 'page_supportguildid'),
                                    i18nmoderatorsroleid: translate(lang, 'page_moderatorsroleid'),
                                    i18nmysqlpassword: translate(lang, 'page_mysqlpassword'),
                                    i18nnextbutton: translate(lang, 'page_globalnext'),
                                    i18nsubmittingdiscord: translate(lang, 'page_submittingdiscord'),
                                    i18nneedhelp: translate(lang, 'page_globalneedhelp'),
                                    i18nheadertitle: translate(lang, 'page_configheader'),
                                    i18nsteptwo: translate(lang, 'page_configstep2')
                                });
                            } else if (err === "CANNOT_CONNECT_TO_DISCORD") {
                                res.render('../src/server/pages/errorpage.ejs', {
                                    projname: uniconf.projname,
                                    metadomain: uniconf.metadomain,
                                    metaurl: "https://" + uniconf.metadomain,
                                    wikiurl: "https://wiki." + uniconf.metadomain,
                                    discord: uniconf.discord,
                                    error: translate(lang, 'page_wallcannotconnecttodiscord'),
                                    diag: translate(lang, 'page_wallcannotconnecttodiscorddiag'),
                                    i18npagetitle: translate(lang, 'page_configpagetitle'),
                                    i18ngithub: translate(lang, 'page_globalgithub'),
                                    i18ngdescription: translate(lang, 'page_globaldescription'),
                                    i18ndocumentation: translate(lang, 'page_globaldocumentation'),
                                    i18ndiscord: translate(lang, 'page_globaldiscord'),
                                    i18ndashboard: translate(lang, 'page_noconfdashboard')
                                })
                            }
                        })
                    }
                } else if (conf.owner === undefined) {
                    fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Get owner ofc
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bot ${conf.token}`,
                            'Transfer-Encoding': 'chunked'
                        }
                    })
                        .then(res => res.json())
                        .then(applicationinfo => {
                            if (applicationinfo.team != undefined) { // Check if team, if team add all members to the conf
                                var owner = []
                                for (var i in applicationinfo.team.members) {
                                    owner.push(`"${applicationinfo.team.members[i].user.id}"`)
                                }
                                var owner = "[" + owner + "]"
                            } else {
                                var owner = `"${applicationinfo.owner.id}"`
                            }
                            fs.writeFile('src/configs/conf.json', `{\n  "language": "${conf.language}",\n  "hostname": "${conf.hostname}",\n  "db": "${conf.db}",\n  "username": "${conf.username}",\n  "password": "${conf.password}",\n  "tableprefix": "${conf.tableprefix}",\n  "token": "${conf.token}",\n  "clientsecret": "${conf.clientsecret}",\n  "ostatus": "${conf.ostatus}",\n  "pstatus": "${conf.pstatus}",\n  "moderatorsroleid": "${conf.moderatorsroleid}",\n  "guildid": "${conf.guildid}",\n  "owner": ${owner}\n}`, function (err) { // Save conf file
                                if (err) throw err;
                                if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json'))) { // Delete interim conf files
                                    fs.unlink('src/configs/mysqlconfinterim.json', function (err) {
                                        if (err) throw err;
                                    })
                                }
                                if (fs.existsSync(path.join(__dirname, '..', 'configs', 'discordconfinterim.json'))) {
                                    fs.unlink('src/configs/discordconfinterim.json', function (err) {
                                        if (err) throw err;
                                    })
                                }
                                res.redirect('/')
                                log.info(translate(lang, 'log_conffilesaved') + path.join(__dirname, '..', '..', 'configs', 'conf.json'))
                                log.info(translate(lang.language, 'log_changestakeefect_part1') + uniconf.projname + translate(lang, 'log_changestakeefect_part2'))
                                setTimeout(function () { // Restart to be safe
                                    restart()
                                }, 250)
                            })
                        })
                        .catch(err => {
                            if (err.name == "FetchError") {
                                log.warn(translate(lang, 'log_cannotconnecttodiscordforownerid'))
                            }
                        })
                }
            }
        })
    })
})

module.exports = router;