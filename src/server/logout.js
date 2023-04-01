/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                     File: logout.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    if (req.cookies.discordbearertoken) { // If two respective cookies that allow user to be signed in, clear them
        res.clearCookie("discordbearertoken")
    }
    if (req.cookies.discordrefreshtoken) {
        res.clearCookie("discordrefreshtoken")
    }
    res.redirect('/') // Regardless of the presence of these cookies, redirect home since the user likely won't be able to do anything anyway
})

module.exports = router