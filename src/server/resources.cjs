/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//       File: resources.cjs & resources-original.js       //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();
const pkg = require('../../package.json');
const path = require('path')

// There are three copies of the same image file to signify the intent of the instance, this all depends on "mode" in package.json

router.get('/btsfrown.png', (req, res) => { // Image for if user uses Internet Explorer
    res.sendFile(path.resolve('./src/server/views/resources/img/btsfrown.png'));
});

router.get('/logo.png', (req, res) => { // Can't forget the iconic BTS robot that I totally did not steal from the Scratch Wiki
    if (pkg.mode == 'stable') {
        res.sendFile(path.resolve('./src/server/views/resources/img/logo.png'));
    }
    else if (pkg.mode == 'alpha') {
        res.sendFile(path.resolve('./src/server/views/resources/img/logoalpha.png'));
    }
    else if (pkg.mode == 'beta') {
        res.sendFile(path.resolve('./src/server/views/resources/img/logobeta.png'));
    }
    else if (pkg.mode == 'active-development' || pkg.mode == 'ad') {
        res.sendFile(path.resolve('./src/server/views/resources/img/logoad.png'));
    }
    else {
        res.sendFile(path.resolve('./src/server/views/resources/img/logo.png'));
    }
});

router.get('/60px.png', (req, res) => { // Sized down for homepage, sandi said it was slightly too big as 70px
    if (pkg.mode == 'stable') {
        res.sendFile(path.resolve('./src/server/views/resources/img/60px.png'));
    }
    else if (pkg.mode == 'alpha') {
        res.sendFile(path.resolve('./src/server/views/resources/img/60pxalpha.png'));
    }
    else if (pkg.mode == 'beta') {
        res.sendFile(path.resolve('./src/server/views/resources/img/60pxbeta.png'));
    }
    else if (pkg.mode == 'active-development' || pkg.mode == 'ad') {
        res.sendFile(path.resolve('./src/server/views/resources/img/60pxad.png'));
    }
    else {
        res.sendFile(path.resolve('./src/server/views/resources/img/60px.png'));
    }
});

router.get('/h1.woff', (req, res) => { // A very poggers font
    res.sendFile(path.resolve('./src/server/views/resources/fonts/h1.woff'));
});

router.get('/bundle.js', (req, res) => { // Bundler
    res.sendFile(path.resolve('./build/bundle.js'));
});

router.use(express.static(path.join(__dirname, '..', 'src', 'server', 'views', 'resources', 'js')))
router.use(express.static(path.join(__dirname, '..', 'src', 'server', 'views', 'resources', 'css')))
router.use(express.static(path.join(__dirname, '..', 'src', 'server', 'views', 'resources', 'emojis')))

router.get('/btsthonk.png', (req, res) => { // 404s
    res.sendFile(path.resolve('./src/server/views/resources/img/btsthonk.png'));
});

router.get('/appealdemo.png', (req, res) => { // Demo image for front page
    res.sendFile(path.resolve('./src/server/views/resources/img/appealdemo.png'));
});

router.get('/modmaildemo.png', (req, res) => { // Demo image for front page
    res.sendFile(path.resolve('./src/server/views/resources/img/modmaildemo.png'));
});

router.get('/restoredemo.png', (req, res) => { // Demo image for front page
    res.sendFile(path.resolve('./src/server/views/resources/img/restoredemo.png'));
});

router.get('/scamdemo.png', (req, res) => { // Demo image for front page
    res.sendFile(path.resolve('./src/server/views/resources/img/scamdemo.png'));
});

router.get('/verifydemo.png', (req, res) => { // Demo image for front page
    res.sendFile(path.resolve('./src/server/views/resources/img/verifydemo.png'));
});

router.get('/voicedemo.png', (req, res) => { // Demo image for front page
    res.sendFile(path.resolve('./src/server/views/resources/img/voicedemo.png'));
});

module.exports = router;