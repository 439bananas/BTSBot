/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: getAzureToken.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const msal = require('@azure/msal-node')

function getazuretoken(clientid, clientsecret, scopes, redirecturi, code) { // You get the point
    return new Promise(function (resolve, reject) {
        const clientConfig = { // Set client ID and secret
            auth: {
                clientId: clientid,
                clientSecret: clientsecret
            }
        };
        const cca = new msal.ConfidentialClientApplication(clientConfig); // Initialise our confidential client
        if (code == undefined) { // No code? REDIRECT TO OAUTH2
            const authCodeUrlParameters = {
                scopes: scopes,
                redirectUri: redirecturi,
            };
            cca.getAuthCodeUrl(authCodeUrlParameters).then((response) => {
                resolve(response)
            }).catch((error) => { reject(error) });
        } else {
            const tokenRequest = { // Request token
                code: code,
                redirectUri: redirecturi,
                scopes: scopes,
            };
            cca.acquireTokenByCode(tokenRequest).then((response) => { // Enact on that request declaration
                resolve(response.accessToken) // We should have the token now!
            }).catch((error) => {
                switch (error.errorCode) {
                    case "network_error": // Hopefully the only error to cause that is legitimately bad client secret, else DAMN MICROSOFT'S SOFTWARE
                        reject("BAD_CLIENT_SECRET_OR_CODE")
                        break;
                    default:
                        log.error(JSON.stringify(error))
                        reject("UNKNOWN_ERROR")
                }
            })
        }
    })
}

module.exports = getazuretoken;