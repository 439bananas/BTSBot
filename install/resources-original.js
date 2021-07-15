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

router.get('/main.css', (req, res) => {
    res.sendFile('./pages/resources/main.css', { root: __dirname });
});

router.get('/bootstrap.css', (req, res) => {
    res.sendFile('./pages/resources/bootstrap.css', { root: __dirname });
});

router.get('/bootstrap.css.map', (req, res) => {
    res.sendFile('./pages/resources/bootstrap.css.map', { root: __dirname });
});

router.get('/logo.png', (req, res) => {
    res.sendFile('./pages/resources/logo.png', { root: __dirname });
});

router.get('/60px.png', (req, res) => {
    res.sendFile('./pages/resources/60px.png', { root: __dirname });
});

router.get('/h1.woff', (req, res) => {
    res.sendFile('./pages/resources/h1.woff', { root: __dirname });
});

router.get('/twemoji-amazing.css', (req, res) => {
    res.sendFile('./pages/resources/twemoji-amazing.css', { root: __dirname });
});

module.exports = router;