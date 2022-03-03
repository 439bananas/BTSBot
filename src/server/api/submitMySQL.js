/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File: submitMySQL.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const checkConf = require('../../core/checkConfExists')
const log = require('../../core/logHandler')
const checkMySQL = require('../../core/checkMySQL')
const uniconf = require('../../configs/uniconf.json')
const fs = require('fs')
const express = require('express');
const router = express.Router()
const path = require('path')
const restart = require('../../core/restartProcess')
const translate = require('../../core/getLanguageString')
const getlang = require('../../core/getLanguageJSON')

router.post('/', async (req, res, next) => {
    if (req.fields.language === undefined || req.fields.hostname === undefined || req.fields.username === undefined || req.fields.password === undefined || req.fields.database === undefined || req.fields.tableprefix === undefined) { // Check for necessary args, else return an error
        res.status(200);
        res.json({
            response: "MISSING_PARAMS"
        })
    }
    else {
        checkConf()
            .then(result => {
                if (result == true) {
                    // So that no one can submit the config while it's operational
                    res.status(200);
                    res.json({
                        response: "CONF_OK"
                    })
                }
            })
            .catch(err => { // Check if conf.json exists, if not continue. Else, play dead
                if (err != true) {
                    if (err == false || err == "MISSING_FIELDS" || err == 'INCORRECT_CREDENTIALS' || err == "ACCESS_DENIED" || err == "CONNECTION_REFUSED" || err == "UNKNOWN_ERROR") {
                        if (fs.existsSync(path.join(__dirname, '..', '..', 'configs', 'mysqlconfinterim.json'))) { // Check if an interim file has been created
                            const mysqlconf = require('../../configs/mysqlconfinterim.json')
                            checkMySQL(mysqlconf.hostname, mysqlconf.username, mysqlconf.password, mysqlconf.database)
                                .then(confresult => {
                                    if (confresult == "OK") { // So that no one can submit the config while MySQL is functional
                                        res.status(200);
                                        res.json({
                                            response: "WRONG_ENDPOINT"
                                        })
                                    }
                                })
                                .catch(err => { // If it exists but is bad, allow user to create another one
                                    checkMySQL(req.fields.hostname, req.fields.username, req.fields.password, req.fields.database)
                                        .then(result => {
                                            res.status(200)
                                            res.json({
                                                response: result
                                        })
                                        if (result == "OK") {
                                            if (req.fields.tableprefix !== undefined) { // Because passing tableprefix is optional, we don't want a blatant "undefined" in our configuration file
                                                var tableprefix = `, \n  "tableprefix": "${req.fields.tableprefix}"`
                                            } else {
                                                var tableprefix = `", \n  "tableprefix": ""`
                                            }
                                            fs.writeFile('./src/configs/mysqlconfinterim.json', `{\n  "language": "${req.fields.language}",\n  "hostname": "${req.fields.hostname}",\n  "database": "${req.fields.database}",\n  "username": "${req.fields.username}",\n  "password": "${req.fields.password}"${tableprefix}\n}`, function (err) { // Create interim configuration file; password gets saved for the sake of testing but DOES NOT GET USED WHEN SUBMITTING DISCORD CONFIG
                                                if (err) throw err;
                                                log.info(translate(mysqlconf.language, 'log_mysqlconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'mysqlconfinterim.json'))
                                                log.info(translate(mysqlconf.language, 'log_changestakeefect_part1') + uniconf.projname + translate(mysqlconf.language, 'log_changestakeefect_part2'))
                                                setTimeout(function () {
                                                    restart()
                                                }, 250)
                                            })
                                        }
                                    }).catch(err => {
                                        res.status(200)
                                        res.json({
                                            response: err,
                                            hostname: req.fields.hostname
                                        })
                                    })
                                })
                        } else {
                            checkMySQL(req.fields.hostname, req.fields.username, req.fields.password, req.fields.database)
                                .then(result => { // Repeating this code is probably janky and inefficient so if you find a better way, please, I beg, create a pull request. I was looking at creating a function until I was stupid enough to realise that there was a slight nuance in the code that meant it was not so straightforward
                                    res.status(200)
                                    res.json({
                                        response: result
                                    })
                                    if (result == "OK") {
                                        fs.writeFile('./src/configs/mysqlconfinterim.json', `{\n"language": "${req.fields.language}",\n  "hostname": "${req.fields.hostname}",\n  "database": "${req.fields.database}",\n  "username": "${req.fields.username}",\n  "password": "${req.fields.password}",\n  "tableprefix": "${req.fields.tableprefix}"\n}`, function (err) { // Create interim configuration file; password gets saved for the sake of testing but DOES NOT GET USED WHEN SUBMITTING DISCORD CONFIG
                                            if (err) throw err;
                                            const mysqlconf = require('../../configs/mysqlconfinterim.json')
                                            log.info(translate(mysqlconf.language, 'log_mysqlconffilesaved') + path.join(__dirname, '..', '..', 'configs', 'mysqlconfinterim.json'))
                                            log.info(translate(mysqlconf.language, 'log_changestakeefect_part1') + uniconf.projname + translate(mysqlconf.language, 'log_changestakeefect_part2'))
                                            setTimeout(function () {
                                                restart()
                                            }, 250)
                                        })
                                    }
                                }).catch(err => {
                                    res.status(200)
                                    res.json({
                                        response: err,
                                        hostname: req.fields.hostname
                                    })
                                })
                        }
                    }
                    else {
                        res.status(200);
                        res.json({
                            response: "WRONG_ENDPOINT"
                        })
                    }
                }
                else { // So that no one can submit the config while it's operational
                    res.status(200);
                    res.json({
                        response: "CONF_OK"
                    })
                }
            })
    }
})

router.get('/',  async(req, res, next) => { // This should totally not be GET'd
    checkConf().catch(err => {
        getlang(true)
            .then(langcode => {
                if (err) {  // If error in conf, don't show things like login etc that couldn't possibly exist
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
                        conf: false,
                        metadomain: uniconf.metadomain,
                        metaurl: "https://" + uniconf.metadomain
                    });
                } else {
                    res.status(404); // IF THE CONF EXISTS WE NEED TO SERVE BASED ON LANGUAGE USER HAS SET
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
                        i18ndashboard: translate(langcode, 'page_noconfdashboard'),
                        conf: true,
                        metadomain: uniconf.metadomain,
                        metaurl: "https://" + uniconf.metadomain
                    });
                }
            })
    })
});

module.exports = router;