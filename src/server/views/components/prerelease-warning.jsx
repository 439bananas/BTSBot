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

import translate from './getLanguageString.cjs';
import React from 'react';

function PrereleaseWarning(props) {
    return (
        <div class="prerelease-warning">
            <strong>
                {translate(props.language, 'page_globalprereleasewarningpart1') + uniconf.projname + translate(props.language, 'page_globalprereleasewarningpart2')}
            </strong>
        </div>
    )
}

export default PrereleaseWarning;