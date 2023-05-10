    // if no google bearer token and there is a google client id:
    //      if no code in query and no error in query:
    //          get the google redirect url using getgoogletoken() and return "OAUTH_REDIRECT" with the returned link
    //      else if error in query, return the error
    //      else:
    //          try:
    //              get the google token
    //              send the google bearer token cookie
    //              rename the interim conf to conf.json
    //              in the callback:
    //                  if error, then return the error
    //                  else, show the config complete page and restart
    //          upon failure:
    //              switch/case the error:
    //                  if "BAD_GOOGLE_CLIENT_SECRET":
    //                      return "OAUTH_FAIL"
    //                  if "CANNOT_CONNECT_TO_GOOGLE":
    //                      return "CANNOT_CONNECT_TO_GOOGLE"
    //                  if "BAD_CODE":
    //                      return "OAUTH_REDIRECT" and then the oauth2 link for google (use getgoogletoken() once again)
    //                  else:
    //                      return the error
    // else if no google client id:
    //      rename the interim conf to conf.json
    //      in the callback:
    //          if error, then return the error
    //          else, show the config complete page and restart
    // else:
    //      make a request to google's userinfo api, convert response to json, etc
    //      with the response:
    //          if there is a response id:
    //              rename the interim conf to conf.json
    //              in the callback:
    //                  if error, then return the error
    //                  else, show the config complete page and restart
    //          else, clear the googlebearertoken cookie and respond with "OAUTH_REDIRECT" and the oauth2 url from getgoogletoken(
    //      upon failure:
    //          return "CANNOT_CONNECT_TO_GOOGLE"