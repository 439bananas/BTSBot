/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//       File: resources.js & resources-original.js        //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const pkg = require('../../package.json')

// There are three copies of the same image file to signify the intent of the instance, this all depends on "mode" in package.json

router.get('/main.css', (req, res) => { // CSS file
    res.sendFile('./pages/resources/css/main.css', { root: __dirname });
});

router.get('/bootstrap.css', (req, res) => { // Bootstrap
    res.sendFile('./pages/resources/css/bootstrap.css', { root: __dirname });
});

router.get('/bootstrap.css.map', (req, res) => { // Edge yelled at me for forgetting this
    res.sendFile('./pages/resources/css/bootstrap.css.map', { root: __dirname });
});

router.get('/logo.png', (req, res) => { // Can't forget the iconic BTS robot that I totally did not steal from the Scratch Wiki
    if (pkg.mode == 'stable') {
        res.sendFile('./pages/resources/img/logo.png', { root: __dirname });
    }
    else if (pkg.mode == 'alpha') {
        res.sendFile('./pages/resources/img/logoalpha.png', { root: __dirname });
    }
    else if (pkg.mode == 'beta') {
        res.sendFile('./pages/resources/img/logobeta.png', { root: __dirname });
    }
    else if (pkg.mode == 'active-development') {
        res.sendFile('./pages/resources/img/logoad.png', { root: __dirname });
    }
    else {
        res.sendFile('./pages/resources/img/logo.png', { root: __dirname });
    }
});

router.get('/60px.png', (req, res) => { // Sized down for homepage, sandi said it was slightly too big as 70px
    if (pkg.mode == 'stable') {
        res.sendFile('./pages/resources/img/60px.png', { root: __dirname });
    }
    else if (pkg.mode == 'alpha') {
        res.sendFile('./pages/resources/img/60pxalpha.png', { root: __dirname });
    }
    else if (pkg.mode == 'beta') {
        res.sendFile('./pages/resources/img/60pxbeta.png', { root: __dirname });
    }
    else if (pkg.mode == 'active-development') {
        res.sendFile('./pages/resources/img/60pxad.png', { root: __dirname });
    }
    else {
        res.sendFile('./pages/resources/img/60px.png', { root: __dirname });
    }
});

router.get('/h1.woff', (req, res) => { // A very poggers font
    res.sendFile('./pages/resources/fonts/h1.woff', { root: __dirname });
});

router.get('/twemoji-amazing.css', (req, res) => { // Allows for emojis
    res.sendFile('./pages/resources/css/twemoji-amazing.css', { root: __dirname });
});

router.get('/smc.js', (req, res) => { // Submit MySQL frontend script from now on is auto-generated
    res.sendFile('./pages/resources/js/smc.js', { root: __dirname });
});

router.get('/btsthonk.png', (req, res) => { // 404s
    res.sendFile('./pages/resources/img/btsthonk.png', { root: __dirname });
});

module.exports = router;