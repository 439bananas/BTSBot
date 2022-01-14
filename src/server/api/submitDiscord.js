/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//             File: submitDiscord.js              //
//                                                 //
//           Author: Thomas (439bananas)           //
//                                                 //
// Copyright 439bananas 2022. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const checkconf = require('../../core/checkConfExists')
const log = require('../../core/logHandler')
const checkmysql = require('../../core/checkMySQL')
const checkdiscord = require('../../core/checkDiscord')
const uniconf = require('../../configs/uniconf.json')
const fs = require('fs')
const express = require('express');
const router = express.Router()
const path = require('path')
const restart = require('../../core/restartProcess')
const translate = require('../../core/getLanguageString')
const getlang = require('../../core/getLanguageJSON')
const checkforconf = require('../../core/checkConfExists')

router.post('/', async (req, res, next) => {
    if (req.fields.token === undefined || req.fields.clientsecret === undefined || req.fields.ostatus === undefined || req.fields.pstatus === undefined || req.fields.guildid === undefined || req.fields.moderatorsroleid === undefined || req.fields.mysqlpassword === undefined) { // Check for necessary args, else return an error
        res.status(200);
        res.json({
            response: "MISSING_PARAMS"
        })
    } else {
        getlang().then(lang => {
            checkconf()
                .then(result => {
                    if (result == true) { // So that no one can submit the config while it's operational
                        res.status(200);
                        res.json({
                            response: "CONF_OK"
                        })
                    }
                })
                .catch(err => {
                    if (err != true) {
                        if (err == 'INCORRECT_CREDENTIALS' || err == "ACCESS_DENIED" || err == "CONNECTION_REFUSED" || err == "UNKNOWN_ERROR") { // MySQL before Discord guys
                            res.status(200);
                            res.json({
                                response: "WRONG_ENDPOINT"
                            })
                        }
                        else {
                            if (fs.existsSync(path.join(__dirname, '..', '..', 'configs', 'mysqlconfinterim.json'))) {
                                const mysqlconf = require('../../configs/mysqlconfinterim.json')
                                checkmysql(mysqlconf.hostname, mysqlconf.username, mysqlconf.password, mysqlconf.database)
                                    .then(confresult => {
                                        if (confresult == "OK") {
                                            getlang().then(lang => {
                                                if (fs.existsSync(path.join(__dirname, '..', '..', 'configs', 'discordconfinterim.json'))) {
                                                    const discordconf = require('../../configs/discordconfinterim.json')
                                                    checkdiscord(discordconf.token) // If there's an error, allow user to enter new Discord creds
                                                        .then(confresult => {
                                                            if (confresult == "ASSUME_CLIENT_SECRET_IS_CORRECT") { // So that no one can submit the config while Discord is functional
                                                                res.status(200);
                                                                res.json({
                                                                    response: "WRONG_ENDPOINT"
                                                                })
                                                            }
                                                        })
                                                        .catch(err => {
                                                            checkdiscord(req.fields.token) // Validate the token
                                                                .then(result => { // Respond with "OK" and create Discord configuration
                                                                    res.status(200);
                                                                    res.json({
                                                                        response: "VERIFY_CLIENT_SECRET"
                                                                    })
                                                                    fs.writeFile('./src/configs/discordconfinterim.json', `{\n  "token": "${req.fields.token}",\n  "clientsecret": "${req.fields.clientsecret}",\n  "ostatus": "${req.fields.ostatus}",\n  "pstatus": "${req.fields.pstatus}",\n  "moderatorsroleid": "${req.fields.moderatorsroleid}",\n  "guildid": "${req.fields.guildid}",\n  "mysqlpassword": "${req.fields.mysqlpassword}"\n}`, function (err) { // Create interim configuration file; password gets saved for the sake of testing but DOES NOT GET USED WHEN SUBMITTING DISCORD CONFIG
                                                                        if (err) throw err;
                                                                        log.info(translate(lang, 'log_discordconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'discordconfinterim.json'))
                                                                    })
                                                                })
                                                                .catch(err => { // If bad token, send error as response
                                                                    res.status(200);
                                                                    res.json({
                                                                        response: err
                                                                    })
                                                                })
                                                        })
                                                } else {
                                                    checkdiscord(req.fields.token) // Janky time!
                                                        .then(result => { // Respond with "OK" and create Discord configuration
                                                            res.status(200);
                                                            res.json({
                                                                response: "VERIFY_CLIENT_SECRET"
                                                            })
                                                            if (result == "ASSUME_CLIENT_SECRET_IS_CORRECT") {
                                                                fs.writeFile('./src/configs/discordconfinterim.json', `{\n  "token": "${req.fields.token}",\n  "clientsecret": "${req.fields.clientsecret}",\n  "ostatus": "${req.fields.ostatus}",\n  "pstatus": "${req.fields.pstatus}",\n  "moderatorsroleid": "${req.fields.moderatorsroleid}",\n  "guildid": "${req.fields.guildid}",\n  "mysqlpassword": "${req.fields.mysqlpassword}"\n}`, function (err) { // Create interim configuration file; password gets saved for the sake of testing but DOES NOT GET USED WHEN SUBMITTING DISCORD CONFIG
                                                                    if (err) throw err;
                                                                    log.info(translate(lang, 'log_discordconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'discordconfinterim.json'))
                                                                })
                                                            }
                                                        })
                                                        .catch(err => { // If bad token, send error as response
                                                            res.status(200);
                                                            res.json({
                                                                response: err
                                                            })
                                                        })
                                                }
                                            })
                                        }
                                    })
                                    .catch(err => { // Catch the error of MySQL and send back a response
                                        res.status(200);
                                        res.json({
                                            response: err
                                        })
                                    })
                            }
                            else {
                                if (!fs.existsSync(path.join(__dirname, '..', '..', 'configs', 'conf.json'))) { // If no conf, give NO_MYSQL_CONF error
                                    res.status(200);
                                    res.json({
                                        response: "NO_MYSQL_CONF"
                                    })
                                } else {
                                    checkforconf().catch(err => {
                                        if (err == "INCORRECT_CREDENTIALS" || err == "ACCESS_DENIED" || err == "UNKNOWN_ERROR") { // If any MySQL settings are damaged, send back NO_MYSQL_CONF else create the interim conf file
                                            res.status(200);
                                            res.json({
                                                response: "NO_MYSQL_CONF"
                                            })
                                        } else if (err == "MISSING_FIELDS") {
                                            const conf = require('../../configs/conf.json')
                                            if (conf.language === undefined || conf.hostname === undefined || conf.db === undefined || conf.tableprefix === undefined || conf.username === undefined) {
                                                res.status(200);
                                                res.json({
                                                    response: "NO_MYSQL_CONF"
                                                })
                                            } else {
                                                checkdiscord(req.fields.token) // Janky time!
                                                    .then(result => { // Respond with "OK" and create Discord configuration
                                                        res.status(200);
                                                        res.json({
                                                            response: "VERIFY_CLIENT_SECRET"
                                                        })
                                                        if (result == "ASSUME_CLIENT_SECRET_IS_CORRECT") {
                                                            fs.writeFile('./src/configs/discordconfinterim.json', `{\n  "token": "${req.fields.token}",\n  "clientsecret": "${req.fields.clientsecret}",\n  "ostatus": "${req.fields.ostatus}",\n  "pstatus": "${req.fields.pstatus}",\n  "moderatorsroleid": "${req.fields.moderatorsroleid}",\n  "guildid": "${req.fields.guildid}",\n  "mysqlpassword": "${req.fields.mysqlpassword}"\n}`, function (err) { // Create interim configuration file; password gets saved for the sake of testing but DOES NOT GET USED WHEN SUBMITTING DISCORD CONFIG
                                                                if (err) throw err;
                                                                log.info(translate(lang, 'log_discordconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'discordconfinterim.json'))
                                                            })
                                                        }
                                                    })
                                            }
                                        }
                                    })
                                }
                            }
                        }
                    }
                    else { // So that no one can submit the config while it's operational
                        res.status(200);
                        res.json({
                            response: "CONF_OK"
                        })
                    }

                })
        })
    }
})

router.get('/', (req, res, next) => { // This should totally not be GET'd
    checkconf().catch(err => {
        if (err) {  // If error in conf, don't show things like login etc that couldn't possibly exist
            res.status(404);
            res.render('../src/server/pages/404.ejs', {
                conf: false,
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain,
                projname: uniconf.projname,
                wikiurl: "https://wiki." + uniconf.metadomain,
                discord: uniconf.discord,
                i18npagetitle: translate(langcode, 'page_404pagetitle'),
                i18ntitle: translate(langcode, 'page_404errortitle'),
                i18ndescription: translate(langcode, 'page_404errordescription'),
                i18ngithub: translate(langcode, 'page_globalgithub'),
                i18ngdescription: translate(langcode, 'page_globaldescription'),
                i18ndocumentation: translate(langcode, 'page_globaldocumentation'),
                i18ndiscord: translate(langcode, 'page_globaldiscord')
            });
        } else {
            res.status(404);
            res.render('../src/server/pages/404.ejs', {
                projname: uniconf.projname,
                wikiurl: "https://wiki." + uniconf.metadomain,
                discord: uniconf.discord,
                i18npagetitle: translate(langcode, 'page_404pagetitle'),
                i18ntitle: translate(langcode, 'page_404errortitle'),
                i18ndescription: translate(langcode, 'page_404errordescription'),
                i18ngithub: translate(langcode, 'page_globalgithub'),
                i18ngdescription: translate(langcode, 'page_globaldescription'),
                i18ndocumentation: translate(langcode, 'page_globaldocumentation'),
                i18ndiscord: translate(langcode, 'page_globaldiscord'),
                conf: true,
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain
            });
        }
    })
});

module.exports = router;