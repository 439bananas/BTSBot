/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//           File: checkConfOnRequest.js           //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const uniconf = require('../configs/uniconf.json')
const path = require('path')
const express = require('express')
const app = express()
const fs = require('fs')
const ejs = require('ejs')
const formidable = require('express-formidable')
const checkconf = require('../core/checkConfExists')
const checkmysql = require('../core/checkMySQL')
const router = express.Router()
const log = require('../core/logHandler')

router.use(formidable()) // Grab fields of form entered
router.get('/', (req, res, next) => { // When / is GET'd, if checkconf returns true, send the noconfintro file and fill variables with respective values, else send back the front page
    checkconf().catch(err => {
        if (err == false) {
            res.status(200);
            res.render('../src/server/pages/noconfintro.ejs', {
                confpath: path.join(__dirname, 'configs'),
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain,
                wikiurl: "https://wiki." + uniconf.metadomain,
                discord: uniconf.discord
            });
        }
        else {
            res.status(200);
            res.json({
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain,
                wikiurl: "https://wiki." + uniconf.metadomain,
                discord: uniconf.discord
            });
        }
    })
})

router.get('/config', (req, res, next) => { // Rinse and repeat but only serve at all if checkconf returns false
    checkconf().catch(err => {
        if (err === false) { // LET'S CHECKCONF CONF.JSON THEN CHECK CONF INTERIM FILE, IF INTERIM FILE BAD, RETURN CONFIG-1, ELSE CONFIG-2
            if (fs.existsSync(path.join(__dirname, '..', 'configs', 'mysqlconfinterim.json'))) { // Check if an interim file has been created
                const mysqlconf = require('../configs/mysqlconfinterim.json')
                checkmysql(mysqlconf.hostname, mysqlconf.username, mysqlconf.password, mysqlconf.database)
                    .then(confresult => {
                        console.log(confresult)
                        if (confresult == "OK") {
                            res.status(200);
                            res.render('../src/server/pages/config-2.ejs', {
                                metadomain: uniconf.metadomain,
                                metaurl: "https://" + uniconf.metadomain,
                                wikiurl: "https://wiki." + uniconf.metadomain,
                                discord: uniconf.discord,
                                hostname: "localhost",
                                username: "btsbot",
                                database: "btsbot",
                                tableprefix: ""
                            });
                        }
                    })
                    .catch(err => {
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
                        res.status(200);
                        res.render('../src/server/pages/config-1.ejs', {
                            metadomain: uniconf.metadomain,
                            metaurl: "https://" + uniconf.metadomain,
                            wikiurl: "https://wiki." + uniconf.metadomain,
                            discord: uniconf.discord,
                            hostname: hostname,
                            username: username,
                            database: database,
                            tableprefix: tableprefix
                        });
                    })
            } else {
                res.status(200);
                res.render('../src/server/pages/config-1.ejs', {
                    metadomain: uniconf.metadomain,
                    metaurl: "https://" + uniconf.metadomain,
                    wikiurl: "https://wiki." + uniconf.metadomain,
                    discord: uniconf.discord,
                    hostname: "localhost",
                    username: "btsbot",
                    database: "btsbot",
                    tableprefix: ""
                });
            }
        }
        else if (err == "MISSING_FIELDS") {
            res.status(404);
        }
        else if (err === undefined) { // I would use !err here but that apparently created ambiguity between checking the absence of err and checking if err == false, yielding a multiple headers error
            res.status(404);
            res.render('../src/server/pages/404.ejs', {
                conf: true,
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain,
                wikiurl: "https://wiki." + uniconf.metadomain,
                discord: uniconf.discord
            });
        }
    })
})

module.exports = router;