/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//          File: alwaysAvailablePages.js          //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const uniconf = require('../configs/uniconf.json')
const path = require('path')
const express = require('express')
const router = express.Router()
const ejs = require('ejs')
//const resourcesRoutes = require('./resources')

//router.use('/resources', resourcesRoutes)

// CHECK IF USER IS LOGGED IN
router.get(function(req, res) { // 404
    checkconf().catch(err => {
        if (err) {  // If error in conf, don't show things like login etc that couldn't possibly exist
            res.status(404);
            res.render('../src/server/pages/404.ejs', {
                conf: false
            });
        } else {
            res.render('../src/server/pages/404.ejs', {
                conf: true
            });
        }
    })
})

/*router.use(function (req, res, next) { // 404
    res.status(404).sendFile("../src/server/pages/404.ejs")
});
*/
module.exports = router;