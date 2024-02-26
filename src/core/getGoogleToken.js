/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: getGoogleToken.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import fetch from 'node-fetch';
import { google } from 'googleapis';

function getgoogletoken(clientid, clientsecret, scopes, redirecturi, code) { // Get the Google token in a function so shorter and easier code
    return new Promise(function (resolve, reject) {
        if (code == undefined) { // If code is undefined, return URL dictating that the caller should redirect the user to the OAuth2 page
            const oauth2Client = new google.auth.OAuth2(
                clientid,
                clientsecret,
                redirecturi
            );
            const authorisationUrl = oauth2Client.generateAuthUrl({
                scope: scopes,
                include_granted_scopes: true
            })
            resolve(authorisationUrl)
        } else { // If there is a code, proceed to get the token
            fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                body: JSON.stringify({
                    client_id: clientid,
                    client_secret: clientsecret,
                    code: code,
                    grant_type: "authorization_code",
                    redirect_uri: redirecturi
                })
            }).then(response => response.json())
                .then(async response => {
                    if (response.access_token) {
                        resolve(response.access_token)
                    } else if (response.error == "invalid_client") {
                        reject("BAD_GOOGLE_CLIENT_SECRET")
                    } else if (response.error == "invalid_grant") {
                        reject("BAD_CODE")
                    } else {
                        reject("UNKNOWN_GOOGLE_ERROR")
                        getlang().then(async lang => {
                            log.error(await translate(lang, "log_googleoautherrorpart1") + response.error)
                        })
                    }
                }).catch(err => {
                    if (err.name == "FetchError") {
                        reject("CANNOT_CONNECT_TO_GOOGLE")
                    }
                })
        }
    })
}

export default getgoogletoken;