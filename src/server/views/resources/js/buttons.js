/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                    File: buttons.js                     //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

let uniconf
fetch('/api/uniconf').then(response => response.json()).then(conf => {
    uniconf = conf
})

try {
    document.getElementById('NextButton').addEventListener('click', (event) => {
        window.location.href = '/config'
    });
} catch (err) {
    void err
}

try {
    document.getElementById('dashboard-button').addEventListener('click', (event) => {
        window.location.href = 'https://' + uniconf.metadomain
    });
} catch (err) {
    void err
}

try {
    document.getElementById('SubmitConfButton').addEventListener('click', (event) => {
        window.event.preventDefault();
        submitconfig();
    });
} catch (err) {
    void err
}

try {
    document.getElementById('ConfigCompleteNextButton').addEventListener('click', (event) => {
        window.location.href = '/'
    });
} catch (err) {
    void err
}

try {
    document.getElementById('SignInButton').addEventListener('click', (event) => {
        window.location.href = '/login'
    });
} catch (err) {
    void err
}