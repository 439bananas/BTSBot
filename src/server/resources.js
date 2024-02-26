/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                   File: resources.js                    //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import { Router } from 'express';
import express from 'express';
const router = Router();
import { mode } from '../../package.json';
import { resolve, join } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// There are three copies of the same image file to signify the intent of the instance, this all depends on "mode" in package.json

router.get('/btsfrown.png', (req, res) => { // Image for if user uses Internet Explorer
    res.sendFile(resolve('./src/server/views/resources/img/btsfrown.png'));
});

router.get('/logo.png', (req, res) => { // Can't forget the iconic BTS robot that I totally did not steal from the Scratch Wiki
    if (mode == 'stable') {
        res.sendFile(resolve('./src/server/views/resources/img/logo.png'));
    }
    else if (mode == 'alpha') {
        res.sendFile(resolve('./src/server/views/resources/img/logoalpha.png'));
    }
    else if (mode == 'beta') {
        res.sendFile(resolve('./src/server/views/resources/img/logobeta.png'));
    }
    else if (mode == 'active-development' || mode == 'ad') {
        res.sendFile(resolve('./src/server/views/resources/img/logoad.png'));
    }
    else {
        res.sendFile(resolve('./src/server/views/resources/img/logo.png'));
    }
});

router.get('/60px.png', (req, res) => { // Sized down for homepage, sandi said it was slightly too big as 70px
    if (mode == 'stable') {
        res.sendFile(resolve('./src/server/views/resources/img/60px.png'));
    }
    else if (mode == 'alpha') {
        res.sendFile(resolve('./src/server/views/resources/img/60pxalpha.png'));
    }
    else if (mode == 'beta') {
        res.sendFile(resolve('./src/server/views/resources/img/60pxbeta.png'));
    }
    else if (mode == 'active-development' || mode == 'ad') {
        res.sendFile(resolve('./src/server/views/resources/img/60pxad.png'));
    }
    else {
        res.sendFile(resolve('./src/server/views/resources/img/60px.png'));
    }
});

router.get('/h1.woff', (req, res) => { // A very poggers font
    res.sendFile(resolve('./src/server/views/resources/fonts/h1.woff'));
});

router.get('/bundle.js', (req, res) => { // Bundler
    res.sendFile(resolve('./build/bundle.js'));
});

router.use(express.static(join(__dirname, '..', 'src', 'server', 'views', 'resources', 'js')))
router.use(express.static(join(__dirname, '..', 'src', 'server', 'views', 'resources', 'css')))
router.use(express.static(join(__dirname, '..', 'src', 'server', 'views', 'resources', 'emojis')))

router.get('/btsthonk.png', (req, res) => { // 404s
    res.sendFile(resolve('./src/server/views/resources/img/btsthonk.png'));
});

router.get('/appealdemo.png', (req, res) => { // Demo image for front page
    res.sendFile(resolve('./src/server/views/resources/img/appealdemo.png'));
});

router.get('/modmaildemo.png', (req, res) => { // Demo image for front page
    res.sendFile(resolve('./src/server/views/resources/img/modmaildemo.png'));
});

router.get('/restoredemo.png', (req, res) => { // Demo image for front page
    res.sendFile(resolve('./src/server/views/resources/img/restoredemo.png'));
});

router.get('/scamdemo.png', (req, res) => { // Demo image for front page
    res.sendFile(resolve('./src/server/views/resources/img/scamdemo.png'));
});

router.get('/verifydemo.png', (req, res) => { // Demo image for front page
    res.sendFile(resolve('./src/server/views/resources/img/verifydemo.png'));
});

router.get('/voicedemo.png', (req, res) => { // Demo image for front page
    res.sendFile(resolve('./src/server/views/resources/img/voicedemo.png'));
});

export default router;