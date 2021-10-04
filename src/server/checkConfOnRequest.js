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
const ejs = require('ejs')
const formidable = require('express-formidable')
const checkconf = require('../core/checkConfExists')
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
        if (err === false) {
            res.status(200);
            res.render('../src/server/pages/config-1.ejs', {
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain,
                wikiurl: "https://wiki." + uniconf.metadomain,
                discord: uniconf.discord
            });
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