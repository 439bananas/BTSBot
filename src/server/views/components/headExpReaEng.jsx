/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: headExpReaEng.jsx                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import translate from '../../../core/getLanguageString.cjs';

<head>
    <link rel='stylesheet' href='/resources/main.css' />
    <link href="/resources/bootstrap.css" rel="stylesheet" crossOrigin="anonymous" />
    <link rel='stylesheet' href='/resources/twemoji-amazing.css' />
    <meta charSet="UTF-8" />
    <meta name="title" content={props.uniconf.projname} />
    <meta name="description" content={translate(props.language, 'page_globaldesc')} />
    <meta name="keywords" content="bot, discord, test, testing, server, bots, discord bots, BTS, BTS Bot" />
    <meta name="author" content="439bananas" />
    <meta name="email" content="btsbot@439bananas.com" />
    <meta name="robots" content="index, follow" />
    <meta name="charset" content="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="image" content={"https://" + props.uniconf.metadomain + "/resources/logo.png"} />
    <meta property="twitter:url" content={"https://" + props.uniconf.metadomain} />
    <meta property="twitter:title" content={props.uniconf.projname} />
    <meta property="twitter:image" content={"https://" + props.uniconf.metadomain + "/resources/logo.png"} />
    <meta property="twitter:description" content={translate(props.language, 'page_globaldesc')} />
    <meta property="theme-color" content="#f0600f" />
    <title>{props.uniconf.projname}</title>
</head>