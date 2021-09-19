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

function submitmysql() {
    $.ajax({
        url: '/api/submit-mysql/',
        type: 'post',
        data: $('#sqlform').serialize()
    })/*.then(function (response) {
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
