/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                      File: smc.js                       //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

async function submitconfig() {
    $('#accessdeniederror').css('display', 'none'); // Hide these so one will show at a time
    $('#redisconnectionrefusederror').css('display', 'none');
    $('#wrongpasserror').css('display', 'none');
    $('#baddatabaseerror').css('display', 'none');
    $('#invalidurlerror').css('display', 'none');
    $('#unknowndiscorderror').css('display', 'none');
    $('#connectionrefusederror').css('display', 'none');
    $('#incorrectcredentialserror').css('display', 'none');
    $('#unknownerror').css('display', 'none');
    $('#wrongendpointerror').css('display', 'none');
    $('#confokerror').css('display', 'none');
    $('#cannotcontactservererror').css('display', 'none');
    $('#tokeninvaliderror').css('display', 'none');
    $('#badclientsecreterror').css('display', 'none');
    $('#cannotconnecttodiscorderror').css('display', 'none');
    $.ajax({ // I'm sure many people will rip my guts out for this but for now I'm using JQuery - in the future I may consider switching to fetch() but for now I just want it to work
        url: '/api/submit-config/',
        type: 'post',
        data: $("#configform").serialize()
    }).then(function (response) {
        console.info('Server response from /api/submit-config: ' + response.response) // Sadly without replacing sendfile with render in resources.js, we can't i14e these strings
        document.getElementById('userEnteredMySQLHostname').innerHTML = response.hostname
        document.getElementById('userEnteredRedisHostname').innerHTML = response.redishostname
        switch (response.response) { // Show errors based on the response
            case "VERIFY_CLIENT_SECRET": // Reloading will mean that the user gets the second step of config
                location.reload()
                break;
            case "WRONG_ENDPOINT": // Show errors based on the response
                $('#wrongendpointerror').css('display', 'block');
                break;
            case "CONF_OK":
                $('#confokerror').css('display', 'block')
                break;
            case "INCORRECT_CREDENTIALS":
                $('#incorrectcredentialserror').css('display', 'block')
                break;
            case "ACCESS_DENIED":
                $('#accessdeniederror').css('display', 'block')
                break;
            case "CONNECTION_REFUSED":
                $('#connectionrefusederror').css('display', 'block')
                break;
            case "REDIS_CONNECTION_REFUSED":
                $('#redisconnectionrefusederror').css('display', 'block')
                break;
            case "WRONGPASS":
                $('#wrongpasserror').css('display', 'block')
                break;
            case "BAD_DATABASE":
                $('#baddatabaseerror').css('display', 'block')
                break;
            case "INVALID_URL":
                $('#invalidurlerror').css('display', 'block')
                break;
            case "WRONG_ENDPOINT":
                $('#wrongendpointerror').css('display', 'block');
                break;
            case "ACCESS_DENIED":
                $('#accessdeniederror').css('display', 'block');
                break;
            case "NO_MYSQL_CONF":
                $('#nomysqlconferror').css('display', 'block');
                break;
            case "CANNOT_CONNECT_TO_DISCORD":
                $('#cannotconnecttodiscorderror').css('display', 'block');
                break;
            case "INCORRECT_CREDENTIALS":
                $('#incorrectcredentialserror').css('display', 'block');
                break;
            case "CONF_OK":
                $('#confokerror').css('display', 'block');
                break;
            case "TOKEN_INVALID":
                $('#tbreak;okeninvaliderror').css('display', 'block');
                break;
            case "UNKNOWN_DISCORD_ERROR":
                $('#unknowndiscorderror').css('display', 'block');
                break;
            default:
                $('#unknownerror').css('display', 'block')
                break;
        }
    }).catch(function (error) {
        $('.submitnotifier').css('display', 'none'); // If some other error, show in log
        console.error("There was an error communicating with the API,", error)
        if (error.statusText == "error") {
            $('#cannotcontactservererror').css('display', 'block');
        }
    })
}