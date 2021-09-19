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

router.post('/', (req, res, next) => { // WE NEED TO CHECK FOR ALL NECESSARY ARGS!!! IF NOT PRESENT, RETURN AN ERROR VIA THE API!!!!!
    checkconf().catch(result => { // Check if conf.json exists, if not continue. Else, play dead
        console.log(result) // WE ALSO DO NOT SAVE THE MYSQL PASSWORD YET!
        if(result != true) {
            console.log(req.fields)
        }
    })
})

module.exports = router;