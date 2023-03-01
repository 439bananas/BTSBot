/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: config-complete.jsx                //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const Layout = require('./components/layout');
const translate = require('../../core/getLanguageString');

<Layout>
    <div class="container">
        <h1>{translate(lang, 'page_configcompleteheader')}</h1>
        <p>
            {translate(lang, 'page_confsuccessfulpart1') + uniconf.projname + translate(lang, 'page_confsuccessfulpart2')}
            <br />
            {translate(lang, 'page_confsuccessfuldiag')}
        </p>
        <input type='submit' class='button' value={translate(lang, 'page_globalnext')} title={translate(lang, 'page_globalnext')} id="ConfigCompleteNextButton" />
    </div>
</Layout>