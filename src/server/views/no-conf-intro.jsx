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

const translate = require('./components/getLanguageString');
const path = require('path');
const React = require('react');

function ErrorDiag(props) {
    switch (props.err) {
        case "false":
            return (translate(props.language, 'page_noconfintrodiag'))
        case "MISSING_FIELDS":
            return (translate(props.language, 'page_noconfintrodiag'))
        case "TOKEN_INVALID":
            return (translate(props.language, 'page_noconfintrobadtokendiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintrobadtokendiagpart2'))
        case "CONNECTION_REFUSED":
            return (translate(props.language, 'page_noconfintroconnectionrefuseddiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintroconnectionrefuseddiagpart2'))
        case "INCORRECT_CREDENTIALS":
            return (translate(props.language, 'page_noconfintrodiag'))
        case "ACCESS_DENIED":
            return (translate(props.language, 'page_noconfintroaccessdenieddiagpart1') + database + ".*" + translate(props.language, 'page_noconfintroaccessdenieddiagpart2') + "\"" + dbusername + "\"" + "@" + "\"" + hostname + "\"")
        case "REDIS_CONNECTION_REFUSED":
            return (translate(props.language, 'page_noconfintroconnectionrefuseddiagpart1') + translate(props.language, 'page_globalnext') + translate(props.language, 'page_noconfintroconnectionrefuseddiagpart2'))
        case "WRONGPASS":
            return (translate(props.language, 'page_noconfintrodiag'))
        case "BAD_DATABASE":
            return <span>{translate(props.language, "page_redisbaddatabasediagpart1") + translate(props.language, 'page_globalnext') + translate(props.language, 'page_redisbaddatabasediagpart2')} <code>conf.json</code> {translate(props.language, "page_redisbaddatabasediagpart3")} <code>redis.conf</code></span>
        default:
            return <span>{translate(props.language, "page_confunknownerrordiag")} <a href={uniconf.discord}> {translate(props.language, 'global_discorderver')} </a> {translate(props.language, 'page_serverlostconnectiondiagpart3')}</span>
    }
};

function ErrorMessage(props) {
    switch (props.err) {
        case "false":
            return (<p>{translate(props.language, 'page_noconfintropart1')} <code>conf.json</code> {translate(props.language, 'page_noconfintropart2') + path.join(__dirname, '..', '..', '..', 'configs') + translate(props.language, 'page_noconfintropart3') + uniconf.projname + translate(props.language, 'page_noconfintropart4')}<br /><ErrorDiag err={props.err} /></p>)
        case "MISSING_FIELDS":
            return (<p>{translate(props.language, 'page_noconfintromissingfieldspart1')} <code>conf.json</code> {translate(props.language, 'page_noconfintromissingfieldspart2') + path.join(__dirname, '..', '..', '..', 'configs') + translate(props.language, 'page_noconfintromissingfieldspart3') + uniconf.projname + translate(props.language, 'page_noconfintromissingfieldspart4')}<br /><ErrorDiag err={props.err} /></p>)
        case "TOKEN_INVALID":
            return (<p>{translate(props.language, 'page_noconfintrobadtokenpart1')} <code>conf.json</code> {translate(props.language, 'page_noconfintrobadtokenpart2') + path.join(__dirname, '..', '..', '..', 'configs') + translate(props.language, 'page_noconfintrobadtokenpart3') + uniconf.projname + translate(props.language, 'page_noconfintrobadtokenpart4')}<br /><ErrorDiag err={props.err} /></p>)
        case "CONNECTION_REFUSED":
            return (<p>{uniconf.projname + translate(props.language, 'page_noconfintroconnectionrefused')}<br /><ErrorDiag err={props.err} /></p>)
        case "INCORRECT_CREDENTIALS":
            return (<p>{uniconf.projname + translate(props.language, 'page_noconfintroincorrectcredentials')}<br /><ErrorDiag err={props.err} /></p>)
        case "ACCESS_DENIED":
            return (<p>{uniconf.projname + translate(props.language, 'page_noconfintroaccessdenied')}<br /><ErrorDiag err={props.err} /></p>)
        case "REDIS_CONNECTION_REFUSED":
            return (<p>{uniconf.projname + translate(props.language, 'page_noconfintroredisconnectionrefused')}<br /><ErrorDiag err={props.err} /></p>)
        case "WRONGPASS":
            return (<p>{uniconf.projname + translate(props.language, 'page_noconfintroincorrectcredentials')}<br /><ErrorDiag err={props.err} /></p>)
        case "BAD_DATABASE":
            return (<p>{translate(props.language, 'page_redisbaddatabasepart1') + translate(props.language, 'page_redisbaddatabasepart2')} <code>redis.conf</code> {translate(props.language, 'page_redisbaddatabasepart3')}<br /><ErrorDiag err={props.err} /></p>)
        default:
            return (<p>{translate(props.language, 'page_noconfintrounknowndiscorderror1') + uniconf.projname + translate(props.language, 'page_noconfintrounknowndiscorderror2')}<br /><ErrorDiag err={props.err} /></p>)
    };
};
function Noconfintro(props) {
    return (
        <div>
            <title>{uniconf.projname + " - " + translate(props.language, 'page_configpagetitle')}</title>
            <div className="global-intro-section">
                <div className="container">
                    <h1>{translate(props.language, 'page_noconfintroheader')}</h1>
                </div>
            </div>
            <div className="container" style={{ paddingTop: 1.25 + "em" }}>
                <ErrorMessage err={props.confErr} />
                <input type='submit' id="NextButton" className='button' value={translate(props.language, 'page_globalnext')} title={translate(props.language, 'page_globalnext')} />
            </div>
        </div>
    )
}

module.exports = Noconfintro