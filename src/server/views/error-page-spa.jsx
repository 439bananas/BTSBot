/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                File: error-page-spa.jsx                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const React = require('react')
const translate = require('./components/getLanguageString')

function Error(props) {
    if (props.errorInfo) {
        return <div><p>{translate(props.language, "page_unknownerrorintro")}</p><pre><code>{JSON.stringify(props.errorInfo, null, 2)}</code></pre></div>
    } else {
        return null
    }
}

function ErrorPage(props) {
    return (
        <div className="container">
            <div className="alert-box danger text-wrap">
                {props.error}
                <br />
                {props.diag}
            </div>
            <Error language={props.language} errorInfo={props.errorInfo} />
        </div>
    )
}

module.exports = ErrorPage