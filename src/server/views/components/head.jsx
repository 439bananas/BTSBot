/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                      File: head.jsx                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react');
import translate from './getLanguageString';

function Head(props) {
    return (
        <head>
            <link rel='stylesheet' href='/resources/main.css' />
            <link href="/resources/bootstrap.css" rel="stylesheet" crossOrigin="anonymous" />
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
            <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>
            <script type="module" src="/resources/buttons.js" />
            <link rel='stylesheet' href='/resources/twemoji-amazing.css' />
            <meta charSet="UTF-8" />
            <meta name="title" content={uniconf.projname} />
            <meta name="description" content={translate(props.language, 'page_globaldesc', 'express-engine-jsx')} />
            <meta name="keywords" content="bot, discord, test, testing, server, bots, discord bots, BTS, BTS Bot" />
            <meta name="author" content="439bananas" />
            <meta name="email" content="btsbot@439bananas.com" />
            <meta name="robots" content="index, follow" />
            <meta name="charset" content="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="image" content={"https://" + uniconf.metadomain + "/resources/logo.png"} />
            <meta property="twitter:url" content={"https://" + uniconf.metadomain} />
            <meta property="twitter:title" content={uniconf.projname} />
            <meta property="twitter:image" content={"https://" + uniconf.metadomain + "/resources/logo.png"} />
            <meta property="twitter:description" content={translate(props.language, 'page_globaldesc', 'express-engine-jsx')} />
            <meta property="theme-color" content="#f0600f" />
        </head>
    )
}

module.exports = Head;