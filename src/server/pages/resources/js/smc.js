/////////////////////////////////////////////////////
//                                                 //
//                     BTS Bot                     //
//                                                 //
//                  File: smc.js                   //
//                                                 //
//         Written by: Thomas (439bananas)         //
//                                                 //
// Copyright 439bananas 2021. All rights reserved. //
//                                                 //
/////////////////////////////////////////////////////

async function submitmysql() {
    $('.submitnotifier').css('display', 'inline'); // Hide these so one will show at a time
    $('#accessdeniederror').css('display', 'none');
    $('#connectionrefusederror').css('display', 'none');
    $('#incorrectcredentialserror').css('display', 'none');
    $('#unknownerror').css('display', 'none');
    $('#wrongendpointerror').css('display', 'none');
    $('#cannotcontactservererror').css('display', 'none');
    $.ajax({ // I'm sure many people will rip my guts out for this but for now I'm using JQuery - in the future I may consider switching to fetch() but for now I just want it to work
        url: '/api/submit-mysql/',
        type: 'post',
        data: $('#sqlform').serialize()
    }).then(function (response) { // Upon response, hide the notifier
        $('.submitnotifier').css('display', 'none');
        console.info('Server response from /api/submit-mysql: ' + response.response)
        if (response.response == "OK") { // Reloading will mean that the user gets the second step of config
            location.reload()
        }
        else if (response.response == "WRONG_ENDPOINT") { // Show errors based on the response
            $('#wrongendpointerror').css('display', 'block');
        }
        else if (response.response == "INCORRECT_CREDENTIALS") {
            $('#incorrectcredentialserror').css('display', 'block')
        }
        else if (response.response == "ACCESS_DENIED") {
            $('#accessdeniederror').css('display', 'block')
        }
        else if (response.response == "CONNECTION_REFUSED") {
            $('#connectionrefusederror').css('display', 'block')
        }
        else {
            $('#unknownerror').css('display', 'block')
        }
    }).catch(function (error) {
        $('.submitnotifier').css('display', 'none'); // If some other error, show in log
        console.error("There was an error communicating with the API,", error)
        if (error.statusText == "error") {
            $('#cannotcontactservererror').css('display', 'block');
        }
    })
}
