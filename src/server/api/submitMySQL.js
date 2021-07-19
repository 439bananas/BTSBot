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
const fs = require('fs')
const express = require('express');
const router = express.Router()

router.post('/', (req, res, next) => {
    checkconf().then(result => { // Check if conf.json exists, if not continue. Else, play dead
        //console.log(result)
        if(result != true && result != "NOSQL") {
            console.log(req.fields)
        }
    })
})

module.exports = router;