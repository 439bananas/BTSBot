/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//              File: prerelease-warning.jsx               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const translate = require('./getLanguageString');
const React = require('react');

function PrereleaseWarning(props) {
    return (
        <div class="prerelease-warning">
            <strong>
                {translate(props.language, 'page_globalprereleasewarningpart1') + uniconf.projname + translate(props.language, 'page_globalprereleasewarningpart2')}
            </strong>
        </div>
    )
}

module.exports = PrereleaseWarning;