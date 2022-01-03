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

router.use(formidable()) // Grab fields of form entered
router.get('/', async (req, res, next) => { // When / is GET'd, if checkconf returns true, send the noconfintro file and fill variables with respective values, else send back the front page
    checkconf().catch(err => {
        getlang().then(lang => {
            if (err == false) {
                res.status(200);
                res.render('../src/server/pages/noconfintro.ejs', {
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
        checkconf().catch(err => {
            if (err === false) {
                if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json'))) { // Check if an interim file has been created
                    const mysqlconf = require('../configs/mysqlconfinterim.json')
                    checkmysql(mysqlconf.hostname, mysqlconf.username, mysqlconf.password, mysqlconf.database)
                        .then(confresult => {
                            if (confresult == "OK") {
                                if (fs.existsSync(path.join(__dirname, '..', 'configs', 'discordconfinterim.json'))) {
                                    const discordconf = require('../configs/discordconfinterim.json')
                                    checkdiscord(discordconf.token)
                                        .then(discordresult => {
                                            if (discordresult == "ASSUME_CLIENT_SECRET_IS_CORRECT") {
                                                // THIS IS WHERE WE VALIDATE CLIENT SECRET
                                                if (req.query.code == undefined) { // If there's no code, get Discord to provide one
                                                    fetch('https://discord.com/api/v9/oauth2/applications/@me', { // Validate the token this way, we used Discord.JS to validate the token and validating the token that way barfed all sorts of weird errors
                                                        method: 'GET',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bot ${discordconf.token}`,
                                                            'Transfer-Encoding': 'chunked'
                                                        }
                                                    })
                                                        .then(response => response.json())
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
                                                                        res.render('../src/server/pages/config-3.ejs', { // prepare for next commit

                                                                        })
                                                                    }
                                                                })
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
                                getlang.then(conflang => {
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
                res.status(404);
            }
            else if (err === undefined) { // I would use !err here but that apparently created ambiguity between checking the absence of err and checking if err == false, yielding a multiple headers error
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
                    i18ndashboard: translate(lang, 'page_noconfdashboard'),
                });
            }
        })
    })
})

module.exports = router;