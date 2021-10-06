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

router.post('/', (req, res, next) => {
    if (req.fields.hostname === undefined || req.fields.username === undefined || req.fields.password === undefined || req.fields.database === undefined || req.fields.tableprefix === undefined) { // Check for necessary args, else return an error
        res.status(400);
        res.json({
            response: "MISSING_PARAMS"
        })
    }
    else {
        checkconf().catch(result => { // Check if conf.json exists, if not continue. Else, play dead
            console.log(result)
            if (result != true) {
                console.log(req.fields)
                if (result == false || result == "MISSING_FIELDS" || result == 'INCORRECT_CREDENTIALS' || result == "ACCESS_DENIED" || result == "CONNECTION_REFUSED" || result == "UNKNOWN_ERROR") {
                    // AT THIS POINT CHECK IF AN INTERIM FILE HAS BEEN CREATED
                    checkmysql(req.fields.hostname, req.fields.username, req.fields.password, req.fields.database).then(result => {
                        res.status(200)
                        res.json({
                            response: result
                        })
                        if (result == "OK") {
                            if (req.fields.tableprefix !== undefined) { // Because passing tableprefix is optional, we don't want a blatant "undefined" in our configuration file
                                var tableprefix = `, \n  "tableprefix":"${req.fields.tableprefix}"`
                            } else {
                                var tableprefix = `", \n  "tableprefix":""`
                            }
                            fs.writeFile('./src/configs/mysqlconfinterim.json', `{\n  "hostname": "${req.fields.hostname}",\n  "database": "${req.fields.database}",\n  "username": "${req.fields.username}"${tableprefix}\n}`, function (err) { // Create interim configuration file
                                if (err) throw err;
                                log.info(`MySQL configuration file saved to ${path.join(__dirname, 'src', 'configs', 'mysqlconfinterim.json')}`)
                            })
                        }
                    }).catch(err => {
                        res.status(200)
                        res.json({
                            response: err
                        })
                    })
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