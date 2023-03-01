/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                      File: 404.jsx                      //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const Layout = require('./components/layout');
const Footer = require('./components/footer');
const translate = require('../../core/getLanguageString');

function FooterIfConfPresent() {
    if (conf) {
        return <Footer />
    }
};

<span>
    <Layout>
        <div className="container" style={{ paddingTop: 1 + "rem" }}>
            <center>
                <h2>{translate(lang, 'page_404errortitle')}</h2>
                <div style={{ padding: 1 + "rem" }} >
                    <img src="/resources/btsthonk.png" className="img-fluid" />
                </div>
                <p>
                    <div style={{ fontSize: 1.25 + "rem" }}>
                        {translate(lang, 'page_404errordescription')}
                    </div>
                </p>
                <b style={{ fontSize: 1.5 + "rem" }}>404</b>
            </center>
        </div>
    </Layout>
    <FooterIfConfPresent />
</span>