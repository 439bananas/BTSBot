/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: ie-detect-error.jsx                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import translate from '../../core/getLanguageString';

<html>
    <head>
        <link rel='stylesheet' href='/resources/main.css' />
        <link href="/resources/bootstrap.css" rel="stylesheet" crossOrigin="anonymous" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
        <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js'></script>
        <meta name="charset" content="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{uniconf.projname}</title>
    </head>
    <body>
        <main>
            <div className="container">
                <center>
                    <h2>{translate(lang, "page_iewalltitle")}</h2>
                    <div style={{ padding: 1 + "rem" }}>
                        <img src="/resources/btsfrown.png" className="img-fluid" />
                    </div>
                    <p>
                        <div style={{ fontSize: 1.25 + "rem" }} >
                            {translate(lang, "page_iewalldescriptionpart1")} <a href="https://www.microsoft.com/en-us/edge/download"> {translate(lang, "page_iewalldescriptionpart2", "express-engine-jsx")}</a>{translate(lang, "page_iewalldescriptionpart3", "express-engine-jsx")}<a href="https://www.google.com/chrome/">{translate(lang, "page_iewalldescriptionpart4", "express-engine-jsx")}</a>{translate(lang, "page_iewalldescriptionpart5", "express-engine-jsx")}<a href="https://www.mozilla.org/en-GB/firefox/new/">{translate(lang, "page_iewalldescriptionpart6", "express-engine-jsx")}</a>
                        </div>
                    </p>
                </center>
            </div>
        </main>
    </body>
</html>