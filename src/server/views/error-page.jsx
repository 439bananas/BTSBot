/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: error-page.jsx                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const Layout = require('./components/layout');
const Head = require('./components/head');
const Header = require('./components/header');

<div>
    <Head language={lang} uniconf={uniconf} />
    <Header language={lang} DiscordUser={DiscordUser} uniconf={uniconf} />
    <div className="container">
        <div className="alert-box danger text-wrap">
            {error}
            <br />
            {diag}
        </div>
    </div>
</div>