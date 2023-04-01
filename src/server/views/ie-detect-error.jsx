/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: ie-detect-error.jsx                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const Head = require('./components/head');
const translate = require('./components/getLanguageString');

<html>
    <head>
        <Head />
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
                            {translate(lang, "page_iewalldescriptionpart1")} <a href="https://www.microsoft.com/en-us/edge/download"> {translate(lang, "page_iewalldescriptionpart2")}</a>{translate(lang, "page_iewalldescriptionpart3")}<a href="https://www.google.com/chrome/">{translate(lang, "page_iewalldescriptionpart4")}</a>{translate(lang, "page_iewalldescriptionpart5")}<a href="https://www.mozilla.org/en-GB/firefox/new/">{translate(lang, "page_iewalldescriptionpart6")}</a>
                        </div>
                    </p>
                </center>
            </div>
        </main>
    </body>
</html>