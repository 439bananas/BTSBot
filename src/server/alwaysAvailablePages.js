// does conf exist? if it does, return "CONF_OK"
// else, does confinterim exist and return "ASSUME_CLIENT_SECRET_IS_CORRECT"? if it doesn't, return "NO_CONF"
// else:
//      const conf = require confinterim
//      redis redis redis blah blah blah
//      deal with redis disconnects but i don't think that's gonna work???
//      does discordbearertoken exist?
//          if not, does request query code exist?
//              if the request query code doesn't exist, return "OAUTH_REDIRECT" and discord's oauth2 page link
//              if it does exist:
//                  try getting the discord token
//                      set discordbearertoken and refreshtoken cookies
//                      return "REFRESH_PAGE"
//                  upon failure:
//                      if "BAD_CODE":
//                          return "OAUTH_REDIRECT" and a link to discord's oauth2 page
//                      if "BAD_DISCORD_CLIENT_SECRET":
//                          return "OAUTH_FAIL"
//                      if "TOKEN_INVALID":
//                          return "NO_CONF"
//                      else:
//                          return the error
//          if it does, try getting the discord user
//              we might well have to `void` the result so that the function actually gets called
//              if there is no msbearertoken and there is a msclientid in conf:
//                  if there is no code in req query:
//                      try to get the azure token (and not pass code, since that is undefined) and return "OAUTH_REDIRECT" with the returned URL
//                      upon failure, return the error and log.error() it
//                  else:
//                      try getting the azure token
//                      set the msbearertoken and return "REFRESH_PAGE"
//                      upon failure:
//                          if error is BAD_CLIENT_SECRET_OR_CODE, return "OAUTH_FAIL"
//                          else, return the error
//              else if there is no msclientid in conf, skip to google oauth2
//              else:
//                  try fetching the respective api and pass the user's bearer token
//                      with the response:
//                          if there is an error:
//                              if "InvalidAuthenticationToken":
//                                  if no query code, get the azure oauth2 link and return "OAUTH_REDIRECT" with the URL
//                                  if there is, try:
//                                      getting the bearer token, setting it as a cookie and returning "REFRESH_PAGE"
//                                  upon failure:
//                                      return "OAUTH_REDIRECT" and return the oauth2 link, after getting it again
//                              else:
//                                  return the error
//                          else if there is an email in the response, follow the google oauth2 procedure
//                          else, return the response back
//                  upon failure, return "CANNOT_CONNECT_TO_MICROSOFT"
//          upon failure of getting discord user:
//              try getting the bot's id
//                  switch/case error:
//                      "BAD_ACCESS_TOKEN":
//                          if no code in query, return "OAUTH_REDIRECT" to discord's oauth2 page
//                          else:
//                              try:
//                                  getting discord token
//                                  set bearer token and refresh token in cookies
//                                  return "REFRESH_PAGE"
//                              upon failure:
//                                  throw the error
//                      "WRONG_SCOPES":
//                          if no code in query, return "OAUTH_REDIRECT" to discord's oauth2 page
//                          else:
//                              try:
//                                  getting discord token
//                                  set bearer token and refresh token in cookies
//                                  return "REFRESH_PAGE"
//                              upon failure:
//                                  throw the error
//                      "CANNOT_CONNECT_TO_DISCORD":
//                          return "CANNOT_CONNECT_TO_DISCORD"
//                      else:
//                          return the error
//
//          upon failure:
//              switch/case error:
//                  if "TOKEN_INVALID":
//                      return "NO_CONF"
//                  if "CANNOT_CONNECT_TO_DISCORD":
//                      return "CANNOT_CONNECT_TO_DISCORD"
//                  if "BAD_CODE":
//                      return "OAUTH_REDIRECT" and the discord oauth2 link
//                  if "BAD_DISCORD_CLIENT_SECRET":
//                      return "OAUTH_FAIL"
//                  else:
//                      return the error
// disconnect from redis