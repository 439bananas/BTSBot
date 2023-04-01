/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: config-complete.jsx                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const Layout = require('./components/layout');
const translate = require('./components/getLanguageString');

<Layout>
    <div class="container">
        <h1>{translate(lang, 'page_configcompleteheader', "express-engine-jsx")}</h1>
        <p>
            {translate(lang, 'page_confsuccessfulpart1', "express-engine-jsx") + uniconf.projname + translate(lang, 'page_confsuccessfulpart2', "express-engine-jsx")}
            <br />
            {translate(lang, 'page_confsuccessfuldiag', "express-engine-jsx")}
        </p>
        <input type='submit' class='button' value={translate(lang, 'page_globalnext', "express-engine-jsx")} title={translate(lang, 'page_globalnext', "express-engine-jsx")} id="ConfigCompleteNextButton" />
    </div>
</Layout>