/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//   File: resources.js & resources-original.js    //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

const express = require('express');
const router = express.Router();

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
    res.sendFile('./pages/resources/img/logo.png', { root: __dirname });
});

router.get('/60px.png', (req, res) => { // Sized down for homepage, sandi said it was slightly too big as 70px
    res.sendFile('./pages/resources/img/60px.png', { root: __dirname });
});

router.get('/h1.woff', (req, res) => { // A very poggers font
    res.sendFile('./pages/resources/fonts/h1.woff', { root: __dirname });
});

router.get('/twemoji-amazing.css', (req, res) => { // Allows for emojis; from now on is auto-generated
    res.sendFile('./pages/resources/css/twemoji-amazing.css', { root: __dirname });
});

module.exports = router; // This gets removed and replaced