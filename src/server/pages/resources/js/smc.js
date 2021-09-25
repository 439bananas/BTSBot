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

/*async function submitmysql() {
    const response = await fetch('/api/submit-mysql/', {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: $('#sqlform').serialize()
    }).catch(e => {
            console.log(`Caugth error: ${e}`)
        })
    const data = await response.json()

    console.log(data.response)
}*/

async function submitmysql() {
    $('.submitnotifier').css('display', 'inline');
    $('#accessdeniederror').css('display', 'none');
    $('#connectionrefusederror').css('display', 'none');
    $('#incorrectcredentialserror').css('display', 'none');
    $('#unknownerror').css('display', 'none');
    $('#cannotcontactservererror').css('display', 'none');
    $.ajax({ // I'm sure many people will rip my guts out for this but for now I'm using JQuery - in the future I may consider switching to fetch() but for now I just want it to work
        url: '/api/submit-mysql/',
        type: 'post',
        data: $('#sqlform').serialize()
    }).then(function (response) {
        $('.submitnotifier').css('display', 'none');
        console.log(response)
    }).catch(function (error) {
        $('.submitnotifier').css('display', 'none');
        console.error("There was an error communicating with the API,", error)
        if (error.statusText == "error") {
            $('#cannotcontactservererror').css('display', 'block');
        }
    });
/*        .then(function (response) {
            response.text()
            console.log(response)
            console.log('Request succeeded with JSON response', response);
            console.log(response.obj)
        })
        .error(function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus)
        });
    /*.then(function (response) {
        document.getElementById('db').innerHTML = response.db
        document.getElementById('username').innerHTML = response.username
        document.getElementById('hostname').innerHTML = response.hostname
        document.getElementById('hostname2').innerHTML = response.hostname
        if (response.response == 'ACCESS_DENIED') {
            $('#ACCESS_DENIED').css('display', 'block');
        }
        if (response.response != 'ACCESS_DENIED') {
            $('#ACCESS_DENIED').css('display', 'none');
        }
        if (response.response == 'INSUFFICIENT_PERMISSIONS') {
            $('#INSUFFICIENT_PERMISSIONS').css('display', 'block');
        }
        if (response.response != 'INSUFFICIENT_PERMISSIONS') {
            $('#INSUFFICIENT_PERMISSIONS').css('display', 'none');
        }
        if (response.response == 'CONNECTION_REFUSED') {
            $('#CONNECTION_REFUSED').css('display', 'block');
        }
        if (response.response != 'CONNECTION_REFUSED') {
            $('#CONNECTION_REFUSED').css('display', 'none');
        }
        if (response.response == 'UNKNOWN_ERROR') {
            $('#UNKNOWN_ERROR').css('display', 'block');
        }
        if (response.response != 'UNKNOWN_ERROR') {
            $('#UNKNOWN_ERROR').css('display', 'none');
        }
    })*/
}
