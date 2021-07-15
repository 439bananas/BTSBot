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
//const device = require('express-device')
const checkconf = require('../core/checkConfExists')
const router = express.Router()

router.use(formidable())
router.get('/', (req, res, next) => {
    checkconf().then(result => {
        if (result == false) {
            res.status(200);
            res.render('../src/server/pages/noconfintro.ejs', {
                confpath: path.join(__dirname, 'configs'),
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain
            });
        }
    })
})

router.get('/config', (req, res, next) => {
    checkconf().then(result => {
        if (result == false) {
            res.status(200);
            res.render('../src/server/pages/config-1.ejs', {
                metadomain: uniconf.metadomain,
                metaurl: "https://" + uniconf.metadomain
            });
        }
    })
})

module.exports = router;