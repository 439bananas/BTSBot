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
            return (translate(lang, 'page_noconfintrodiag'))
        case "MISSING_FIELDS":
            return (translate(lang, 'page_noconfintrodiag'))
        case "TOKEN_INVALID":
            return (translate(lang, 'page_noconfintrobadtokendiagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_noconfintrobadtokendiagpart2'))
        case "CONNECTION_REFUSED":
            return (translate(lang, 'page_noconfintroconnectionrefuseddiagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_noconfintroconnectionrefuseddiagpart2'))
        case "INCORRECT_CREDENTIALS":
            return (translate(lang, 'page_noconfintrodiag'))
        case "ACCESS_DENIED":
            return (translate(lang, 'page_noconfintroaccessdenieddiagpart1') + database + ".*" + translate(lang, 'page_noconfintroaccessdenieddiagpart2') + "\"" + dbusername + "\"" + "@" + "\"" + hostname + "\"")
        case "REDIS_CONNECTION_REFUSED":
            return (translate(lang, 'page_noconfintroconnectionrefuseddiagpart1') + translate(lang, 'page_globalnext') + translate(lang, 'page_noconfintroconnectionrefuseddiagpart2'))
        case "WRONGPASS":
            return (translate(lang, 'page_noconfintrodiag'))
        case "BAD_DATABASE":
            return <span>{translate(lang, "page_redisbaddatabasediagpart1") + translate(lang, 'page_globalnext') + translate(lang, 'page_redisbaddatabasediagpart2')} <code>conf.json</code> {translate(lang, "page_redisbaddatabasediagpart3")} <code>redis.conf</code></span>
        default:
            return <span>{translate(lang, "page_confunknownerrordiag")} <a href={uniconf.discord}> {translate(lang, 'global_discorderver')} </a> {translate(lang, 'page_serverlostconnectiondiagpart3')}</span>
    }
};

function ErrorMessage(props) {
    switch (err) {
        case "false":
            return (<p>{translate(lang, 'page_noconfintropart1')} <code>conf.json</code> {translate(lang, 'page_noconfintropart2') + path.join(__dirname, '..', '..', 'configs') + translate(lang, 'page_noconfintropart3') + uniconf.projname + translate(lang, 'page_noconfintropart4')}<br /><ErrorDiag /></p>)
        case "MISSING_FIELDS":
            return (<p>{translate(lang, 'page_noconfintromissingfieldspart1')} <code>conf.json</code> {translate(lang, 'page_noconfintromissingfieldspart2') + path.join(__dirname, '..', '..', 'configs') + translate(lang, 'page_noconfintromissingfieldspart3') + uniconf.projname + translate(lang, 'page_noconfintromissingfieldspart4')}<br /><ErrorDiag /></p>)
        case "TOKEN_INVALID":
            return (<p>{translate(lang, 'page_noconfintrobadtokenpart1')} <code>conf.json</code> {translate(lang, 'page_noconfintrobadtokenpart2') + path.join(__dirname, '..', '..', 'configs') + translate(lang, 'page_noconfintrobadtokenpart3') + uniconf.projname + translate(lang, 'page_noconfintrobadtokenpart4')}<br /><ErrorDiag /></p>)
        case "CONNECTION_REFUSED":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroconnectionrefused')}<br /><ErrorDiag /></p>)
        case "INCORRECT_CREDENTIALS":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroincorrectcredentials')}<br /><ErrorDiag /></p>)
        case "ACCESS_DENIED":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroaccessdenied')}<br /><ErrorDiag /></p>)
        case "REDIS_CONNECTION_REFUSED":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroredisconnectionrefused')}<br /><ErrorDiag /></p>)
        case "WRONGPASS":
            return (<p>{uniconf.projname + translate(lang, 'page_noconfintroincorrectcredentials')}<br /><ErrorDiag /></p>)
        case "BAD_DATABASE":
            return (<p>{translate(lang, 'page_redisbaddatabasepart1') + translate(lang, 'page_redisbaddatabasepart2')} <code>redis.conf</code> {translate(lang, 'page_redisbaddatabasepart3')}<br /><ErrorDiag /></p>)
        default:
            return (<p>{translate(lang, 'page_noconfintrounknowndiscorderror1') + uniconf.projname + translate(lang, 'page_noconfintrounknowndiscorderror2')}<br /><ErrorDiag /></p>)
    };
};

<Layout>
    <div className="global-intro-section">
        <div className="container">
            <h1>{translate(lang, 'page_noconfintroheader')}</h1>
        </div>
    </div>
    <div className="container" style={{ paddingTop: 1.25 + "em" }}>
        <ErrorMessage />
        <input type='submit' id="NextButton" className='button' value={translate(lang, 'page_globalnext')} title={translate(lang, 'page_globalnext')} />
    </div>
</Layout>