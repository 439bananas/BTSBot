/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: no-conf-intro.jsx                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const Layout = require('./components/layout');
const translate = require('../../core/getLanguageString');
const path = require('path');

function ErrorDiag(props) {
    switch (err) {
        case "false":
            return (translate(lang, 'page_noconfintrodiag', 'express-engine-jsx'))
        case "MISSING_FIELDS":
            return (translate(lang, 'page_noconfintrodiag', 'express-engine-jsx'))
        case "TOKEN_INVALID":
            return (translate(lang, 'page_noconfintrobadtokendiagpart1', 'express-engine-jsx') + translate(lang, 'page_globalnext', 'express-engine-jsx') + translate(lang, 'page_noconfintrobadtokendiagpart2', 'express-engine-jsx'))
        case "CONNECTION_REFUSED":
            return (translate(lang, 'page_noconfintroconnectionrefuseddiagpart1', 'express-engine-jsx') + translate(lang, 'page_globalnext', 'express-engine-jsx') + translate(lang, 'page_noconfintroconnectionrefuseddiagpart2', 'express-engine-jsx'))
        case "INCORRECT_CREDENTIALS":
            return (translate(lang, 'page_noconfintrodiag', 'express-engine-jsx'))
        case "ACCESS_DENIED":
            return (translate(lang, 'page_noconfintroaccessdenieddiagpart1', 'express-engine-jsx') + database + ".*" + translate(lang, 'page_noconfintroaccessdenieddiagpart2', 'express-engine-jsx') + "\"" + dbusername + "\"" + "@" + "\"" + hostname + "\"")
        case "REDIS_CONNECTION_REFUSED":
            return (translate(lang, 'page_noconfintroconnectionrefuseddiagpart1', 'express-engine-jsx') + translate(lang, 'page_globalnext', 'express-engine-jsx') + translate(lang, 'page_noconfintroconnectionrefuseddiagpart2', 'express-engine-jsx'))
        case "WRONGPASS":
            return (translate(lang, 'page_noconfintrodiag', 'express-engine-jsx'))
        case "BAD_DATABASE":
            return <span>{translate(lang, "page_redisbaddatabasediagpart1", 'express-engine-jsx') + translate(lang, 'page_globalnext', 'express-engine-jsx') + translate(lang, 'page_redisbaddatabasediagpart2', 'express-engine-jsx')} <code>conf.json</code> {translate(lang, "page_redisbaddatabasediagpart3", 'express-engine-jsx')} <code>redis.conf</code></span>
        default:
            return <span>{translate(lang, "page_confunknownerrordiag", 'express-engine-jsx')} <a href={uniconf.discord}> {translate(lang, 'global_discorderver', 'express-engine-jsx')} </a> {translate(lang, 'page_serverlostconnectiondiagpart3', 'express-engine-jsx')}</span>
    }
};

function ErrorMessage(props) {
    switch (err) {
        case "false":
            return (<p>{translate(lang, 'page_noconfintropart1', 'express-engine-jsx')} <code>conf.json</code> {translate(lang, 'page_noconfintropart2', 'express-engine-jsx') + path.join(__dirname, '..', '..', '..', 'configs') + translate(lang, 'page_noconfintropart3', 'express-engine-jsx') + uniconf.projname + translate(lang, 'page_noconfintropart4', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        case "MISSING_FIELDS":
            return (<p>{translate(lang, 'page_noconfintromissingfieldspart1', 'express-engine-jsx')} <code>conf.json</code> {translate(lang, 'page_noconfintromissingfieldspart2', 'express-engine-jsx') + path.join(__dirname, '..', '..', '..', 'configs') + translate(lang, 'page_noconfintromissingfieldspart3', 'express-engine-jsx') + uniconf.projname + translate(lang, 'page_noconfintromissingfieldspart4', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        case "TOKEN_INVALID":
            return (<p>{translate(lang, 'page_noconfintrobadtokenpart1', 'express-engine-jsx')} <code>conf.json</code> {translate(lang, 'page_noconfintrobadtokenpart2', 'express-engine-jsx') + path.join(__dirname, '..', '..', '..', 'configs', 'express-engine-jsx') + translate(lang, 'page_noconfintrobadtokenpart3', 'express-engine-jsx') + uniconf.projname + translate(lang, 'page_noconfintrobadtokenpart4', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        case "CONNECTION_REFUSED":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroconnectionrefused', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        case "INCORRECT_CREDENTIALS":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroincorrectcredentials', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        case "ACCESS_DENIED":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroaccessdenied', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        case "REDIS_CONNECTION_REFUSED":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroredisconnectionrefused', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        case "WRONGPASS":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroincorrectcredentials', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        case "BAD_DATABASE":
            return (<p>{translate(lang, 'page_redisbaddatabasepart1', 'express-engine-jsx') + translate(lang, 'page_redisbaddatabasepart2', 'express-engine-jsx')} <code>redis.conf</code> {translate(lang, 'page_redisbaddatabasepart3', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
        default:
            return (<p>{translate(lang, 'page_noconfintrounknowndiscorderror1', 'express-engine-jsx') + uniconf.projname + translate(lang, 'page_noconfintrounknowndiscorderror2', 'express-engine-jsx')}<br /><ErrorDiag /></p>)
    };
};

<Layout>
    <div className="global-intro-section">
        <div className="container">
            <h1>{translate(lang, 'page_noconfintroheader', 'express-engine-jsx')}</h1>
        </div>
    </div>
    <div className="container" style={{ paddingTop: 1.25 + "em" }}>
        <ErrorMessage />
        <input type='submit' id="NextButton" className='button' value={translate(lang, 'page_globalnext', 'express-engine-jsx')} title={translate(lang, 'page_globalnext', 'express-engine-jsx')} />
    </div>
</Layout>