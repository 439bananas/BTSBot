/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//              File: submitMySQL.js               //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const checkconf = require('../../core/checkConfExists')
const log = require('../../core/logHandler')
const checkmysql = require('../../core/checkMySQL')
const uniconf = require('../../configs/uniconf.json')
const fs = require('fs')
const express = require('express');
const router = express.Router()
const path = require('path')
const restart = require('../../core/restartProcess')

router.post('/', (req, res, next) => {
    if (req.fields.hostname === undefined || req.fields.username === undefined || req.fields.password === undefined || req.fields.database === undefined || req.fields.tableprefix === undefined) { // Check for necessary args, else return an error
        res.status(200);
        res.json({
            response: "MISSING_PARAMS"
        })
    }
    else {
        checkconf()
            .then(result => {
                if (result == true) {
                    // So that no one can submit the config while it's operational
                    res.status(404);
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
                            checkmysql(mysqlconf.hostname, mysqlconf.username, mysqlconf.password, mysqlconf.database)
                                .then(confresult => {
                                    if (confresult == "OK") { // So that no one can submit the config while MySQL is functional
                                        res.status(200);
                                        res.json({
                                            response: "WRONG_ENDPOINT"
                                        })
                                    }
                                })
                                .catch(err => { // If it exists but is bad, allow user to create another one
                                    checkmysql(req.fields.hostname, req.fields.username, req.fields.password, req.fields.database).then(result => {
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
                                            fs.writeFile('./src/configs/mysqlconfinterim.json', `{\n  "hostname": "${req.fields.hostname}",\n  "database": "${req.fields.database}",\n  "username": "${req.fields.username}",\n  "password": "${req.fields.password}"${tableprefix}\n}`, function (err) { // Create interim configuration file; password gets saved for the sake of testing but DOES NOT GET USED WHEN SUBMITTING DISCORD CONFIG
                                                if (err) throw err;
                                                log.info(`MySQL configuration file saved to ${path.join(__dirname, '..', '..', 'configs', 'mysqlconfinterim.json')}`)
                                                log.info(`For the configuration changes to properly take effect, ${uniconf.projname} will need to restart`)
                                                restart()
                                            })
                                        }
                                    }).catch(err => {
                                        res.status(200)
                                        res.json({
                                            response: err
                                        })
                                    })
                                })
                        } else {
                            checkmysql(req.fields.hostname, req.fields.username, req.fields.password, req.fields.database).then(result => { // Repeating this code is probably janky and inefficient so if you find a better way, please, I beg, create a pull request
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
                                    fs.writeFile('./src/configs/mysqlconfinterim.json', `{\n  "hostname": "${req.fields.hostname}",\n  "database": "${req.fields.database}",\n  "username": "${req.fields.username}",\n  "password": "${req.fields.password}"${tableprefix}\n}`, function (err) { // Create interim configuration file; password gets saved for the sake of testing but DOES NOT GET USED WHEN SUBMITTING DISCORD CONFIG
                                        if (err) throw err;
                                        log.info(`MySQL configuration file saved to ${path.join(__dirname, '..', '..', 'configs', 'mysqlconfinterim.json')}`)
                                        log.info(`For the configuration changes to properly take effect, ${uniconf.projname} will need to restart`)
                                        restart()
                                    })
                                }
                            }).catch(err => {
                                res.status(200)
                                res.json({
                                    response: err
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
                    res.status(404);
                    res.json({
                        response: "CONF_OK"
                    })
                }
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
                metaurl: "https://" + uniconf.metadomain
            });
        } else {
            res.status(404);
            res.render('../src/server/pages/404.ejs', {
                conf: true,
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain
            });
        }
    })
});

module.exports = router;