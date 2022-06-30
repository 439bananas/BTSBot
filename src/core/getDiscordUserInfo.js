/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//               File: getDiscordUserInfo.js               //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const fetch = require('node-fetch')

function getDiscordUser(bearertoken) { // Get the user's info from their bearer token
	return new Promise(function (resolve, reject) { // Get user information from their bearer token
	fetch('https://discord.com/api/v10/oauth2/@me', {
		method: "GET",
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${bearertoken}`,
			'Transfer-Encoding': 'chunked'
		}
	}).then(response => response.json())
		.then(response => {
			if (response.message == "401: Unauthorized") { // If unauthorized, we have a bad access token
				reject("BAD_ACCESS_TOKEN")
			}
			else if (!(response.scopes.includes("identify") && response.scopes.includes("email"))) { // We do at least need the identify and email scopes...
				reject("WRONG_SCOPES")
			}
			else if (response.scopes.includes("identify") && response.scopes.includes("email")) { // If we have them, we should be good
				resolve(response)
			} else { // If something weird, we possibly have an error, v10 shouldn't from this point in have any breaking changes (they should be issued in v11 or so)
				log.error(response.message)
				reject("UNKNOWN_ERROR")
            }
			
		}).catch(err => {
			if (err.name == "FetchError") {
				reject("CANNOT_CONNECT_TO_DISCORD")
			} else {
				reject("UNKNOWN_ERROR")
			}
		})
	})
}

module.exports = getDiscordUser