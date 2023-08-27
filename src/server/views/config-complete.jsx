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

const translate = require('./components/getLanguageString');
const React = require('react');

function redirectHome() {
    window.location.href = '/';
}

function ConfigComplete(props) {
    return (
        <div className="container">
            <h1>{translate(props.language, 'page_configcompleteheader')}</h1>
            <p>
                {translate(props.language, 'page_confsuccessfulpart1') + props.uniconf.projname + translate(props.language, 'page_confsuccessfulpart2')}
                <br />
                {translate(props.language, 'page_confsuccessfuldiag')}
            </p>
            <input type='button' className='button' value={translate(props.language, 'page_globalnext')} title={translate(props.language, 'page_globalnext')} id="ConfigCompleteNextButton" onClick={redirectHome} />
        </div>
    )
}

module.exports = ConfigComplete;