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
const uniconf = require('../../configs/uniconf.json')
const fs = require('fs')
const express = require('express');
const router = express.Router()

router.post('/', (req, res, next) => { // WE NEED TO CHECK FOR ALL NECESSARY ARGS!!! IF NOT PRESENT, RETURN AN ERROR VIA THE API!!!!!
    checkconf().catch(result => { // Check if conf.json exists, if not continue. Else, play dead
        console.log(result) // WE ALSO DO NOT SAVE THE MYSQL PASSWORD YET!
        if (result != true) {
            console.log(req.fields)
            if (result == false || result == "MISSING_FIELDS" || result == 'INCORRECT_CREDENTIALS' || result == "ACCESS_DENIED" || result == "CONNECTION_REFUSED" || result == "UNKNOWN_ERROR") {
                // AT THIS POINT, SAVE THE INTERIM FILE
            }
            else {
                console.log('this is the point of which we 404 with wrong endpoint')
            }
        }
        else { // So that no one can submit the config while it's operational
            res.status(404);
            res.json({
                response: "CONF_OK"
            })
        }
    })
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