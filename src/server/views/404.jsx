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

const Footer = require('./components/footer');
const translate = require('./components/getLanguageString');
const React = require('react');

function FooterIfConfPresent(props) {
    if (props.confExists) {
        return <Footer />
    }
};

function Error404(props) {
    return (
        <span>
            <div className="container" style={{ paddingTop: 1 + "rem" }}>
                <center>
                    <h2>{translate(props.language, 'page_404errortitle')}</h2>
                    <div style={{ padding: 1 + "rem" }} >
                        <img src="/resources/btsthonk.png" className="img-fluid" />
                    </div>
                    <p>
                        <div style={{ fontSize: 1.25 + "rem" }}>
                            {translate(props.language, 'page_404errordescription')}
                        </div>
                    </p>
                    <b style={{ fontSize: 1.5 + "rem" }}>404</b>
                </center>
            </div>
            <FooterIfConfPresent confExists={props.confExists} />
        </span>
    )
}

module.exports = Error404;