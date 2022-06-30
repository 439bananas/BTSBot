/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                  File: displayConf.js                   //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const geti18n = require('../core/getI18nFiles')
let onlineselected
let idleselected
let dndselected
let invisibleselected
let smtpsslyesselected
let smtpsslnoselected
let imapsslyesselected
let imapsslnoselected

function showconf(res, lang, defaultlanguage, hostname, dbusername, database, tableprefix, pstatus, ostatus, guildid, moderatorsroleid, googleclientid, msclientid, smtpserver, smtpport, smtpssl, imapssl, imapserver, imapport, emailaddress, emailusername, badclientsecret) { // We'll comment this in a second // I really, REALLY wish there were fewer args to pass but unfortunately that's not really so easy with literally 24 different settings. Goddamnit SMTP.
    switch (ostatus) { // Choose which status is selected based on parameter
        case "idle":
            onlineselected = ""
            idleselected = "selected "
            dndselected = ""
            invisibleselected = ""
            break;
        case "dnd":
            onlineselected = ""
            idleselected = ""
            dndselected = "selected "
            invisibleselected = ""
            break;
        case "invisible":
            onlineselected = ""
            idleselected = ""
            dndselected = ""
            invisibleselected = "selected "
            break;
        default:
            onlineselected = "selected "
            idleselected = ""
            dndselected = ""
            invisibleselected = ""
            break;
    }

    if (badclientsecret != true) { // Check to see if bad client secret, if true show error, else don't
        var noclientsecret = false
    } else {
        var noclientsecret = true
    }

    if (smtpssl == false) {
        smtpsslyesselected = ""
        smtpsslnoselected = "selected "
    } else {
        smtpsslyesselected = "selected "
        smtpsslnoselected = ""
    }

    if (smtpssl == false) {
        sslyesselected = ""
        sslnoselected = "selected "
    } else {
        sslyesselected = "selected "
        sslnoselected = ""
    }

    if (imapssl == false) {
        imapsslyesselected = ""
        imapsslnoselected = "selected "
    } else {
        imapsslyesselected = "selected "
        imapsslnoselected = ""
    }

    geti18n().then(langs => {
        res.render('../src/server/pages/config.ejs', {
            conf: false, // Trying our best to keep all the config options and page variables in the same order and the i18n strings in the same order while not intertwining the two
            badclientsecret: noclientsecret,
            defaultlanguage: defaultlanguage,
            projname: uniconf.projname,
            metadomain: uniconf.metadomain,
            metaurl: "https://" + uniconf.metadomain,
            wikiurl: "https://wiki." + uniconf.metadomain,
            discord: uniconf.discord,
            hostname: hostname,
            dbusername: dbusername,
            database: database,
            tableprefix: tableprefix,
            pstatus: pstatus,
            onlineselected: onlineselected,
            idleselected: idleselected,
            dndselected: dndselected,
            invisibleselected: invisibleselected,
            guildid: guildid,
            moderatorsroleid: moderatorsroleid,
            googleclientid: googleclientid,
            msclientid: msclientid,
            smtpserver: smtpserver,
            smtpport: smtpport,
            smtpyesselected: smtpsslyesselected,
            smtpnoselected: smtpsslnoselected,
            imapyesselected: imapsslyesselected,
            imapnoselected: imapsslnoselected,
            imapserver: imapserver,
            imapport: imapport,
            emailaddress: emailaddress,
            emailusername: emailusername,
            i18npagetitle: translate(lang, 'page_configpagetitle'),
            i18ngdescription: translate(lang, 'page_globaldesc'),
            i18ndocumentation: translate(lang, 'page_globaldocumentation'),
            i18ndiscord: translate(lang, 'page_globaldiscord'),
            i18ngithub: translate(lang, 'page_globalgithub'),
            i18ndocumentation: translate(lang, 'page_globaldocumentation'),
            i18ndashboard: translate(lang, 'page_noconfdashboard'),
            i18nheadertitle: translate(lang, 'page_configheader'),
            i18nserverlostcontact1: translate(lang, 'page_serverlostconnectionpart1'),
            i18nserverlostcontact2: translate(lang, 'page_serverlostconnectionpart2'),
            i18nserverlostcontactdiag1: translate(lang, 'page_serverlostconnectiondiagpart1'),
            i18nserverlostcontactdiag2: translate(lang, 'page_serverlostconnectiondiagpart2'),
            i18ndiscordserver: translate(lang, 'global_discorderver'),
            i18nserverlostcontactdiag3: translate(lang, 'page_serverlostconnectiondiagpart3'),
            i18ndbaccessdenied: translate(lang, 'page_accessdenied'),
            i18ndbaccessdenieddiag: translate(lang, 'page_accessdenieddiag'),
            i18ndbconnectionrefused: translate(lang, 'page_dbconnectionrefused'),
            i18ndbconnectionrefuseddiag: translate(lang, 'page_dbconnectionrefuseddiag'),
            i18ndbbadcreds: translate(lang, 'page_dbbadcreds'),
            i18ndbbadcredsdiag: translate(lang, 'page_dbbadcredsdiag'),
            i18nwrongendpoint: translate(lang, 'page_wrongendpoint'),
            i18nwrongendpointdiag1: translate(lang, 'page_wrongendpointdiagpart1'),
            i18nwrongendpointdiag2: translate(lang, 'page_wrongendpointdiagpart2'),
            i18nunknownerror: translate(lang, 'page_confunknownerror'),
            i18nunknownerrordiag: translate(lang, 'page_confunknownerrordiag'),
            i18ninvalidtoken: translate(lang, 'page_tokeninvalid'),
            i18ninvalidtokendiag: translate(lang, 'page_tokeninvaliddiag'),
            i18nbadclientsecret: translate(lang, 'page_badclientsecret'),
            i18nbadclientsecretdiag: translate(lang, 'page_badclientsecretdiag'),
            i18ncannotconnecttodiscord: translate(lang, 'page_cannotconnecttodiscord'),
            i18ncannotconnecttodiscorddiag: translate(lang, 'page_cannotconnecttodiscorddiag'),
            i18nunknowndiscorderror: translate(lang, 'page_unknowndiscorderror'),
            i18nstep1: translate(lang, 'page_configstep1'),
            i18nstep2: translate(lang, 'page_configstep2'),
            i18nstep3: translate(lang, 'page_configstep3'),
            i18nstep4: translate(lang, 'page_configstep4'),
            i18ndefaultlanguage: translate(lang, 'page_defaultlanguagelabel'),
            i18ndbhost: translate(lang, 'page_dbhostlabel'),
            i18ndbusermame: translate(lang, 'page_dbusernamelabel'),
            i18ndbpassword: translate(lang, 'page_dbpasswordlabel'),
            i18ndb: translate(lang, 'page_dblabel'),
            i18ndbtableprefix: translate(lang, 'page_dbtableprefixlabel'),
            i18nnextbutton: translate(lang, 'page_globalnext'),
            i18nneedhelp: translate(lang, 'page_globalneedhelp'),
            i18ndiscordtoken: translate(lang, 'page_discordtoken'),
            i18nclientsecret: translate(lang, 'page_clientsecret'),
            i18nplayingstatus: translate(lang, 'page_playingstatus'),
            i18nstatus: translate(lang, 'page_status'),
            i18nonline: translate(lang, 'page_online'),
            i18nidle: translate(lang, 'page_invisible'),
            i18ndnd: translate(lang, 'page_dnd'),
            i18ninvisible: translate(lang, 'page_invisible'),
            i18nsupportguildid: translate(lang, 'page_supportguildid'),
            i18nmoderatorsroleid: translate(lang, 'page_moderatorsroleid'),
            i18ngoogleclientid: translate(lang, 'page_googleclientid'),
            i18ngoogleclientsecret: translate(lang, 'page_googleclientsecret'),
            i18nmsclientid: translate(lang, 'page_msclientid'),
            i18nmsclientsecret: translate(lang, 'page_msclientsecret'),
            i18nsmtpserver: translate(lang, 'page_smtpserver'),
            i18nsmtpport: translate(lang, 'page_smtpport'),
            i18nsmtpssl: translate(lang, 'page_smtpssl'),
            i18ndropdownyes: translate(lang, 'page_dropdownyes'),
            i18ndropdownno: translate(lang, 'page_dropdownno'),
            i18nimapssl: translate(lang, 'page_imapssl'),
            i18nimapserver: translate(lang, 'page_imapserver'),
            i18nimapport: translate(lang, 'page_imapport'),
            i18nemailaddress: translate(lang, 'page_configemailaddress'),
            i18nemailusername: translate(lang, 'page_configemailusername'),
            i18nemailpassword: translate(lang, 'page_configemailpassword'),
            i18nsubmitbutton: translate(lang, "page_globalsubmit")
        })
    })
}

module.exports = showconf;