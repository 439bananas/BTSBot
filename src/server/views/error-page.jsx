/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: error-page.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import Head from './components/headExpReaEng';
import Header from './components/wallHeader';

<div>
    <Head language={lang} uniconf={uniconf} />
    <Header language={lang} DiscordUser={DiscordUser} uniconf={uniconf} pkg={pkg} />
    <div className="container">
        <div className="alert-box danger text-wrap">
            {error}
            <br />
            {diag}
        </div>
    </div>
</div>