/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File: getContactLink.js                 //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2023 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

// NOTES: This should only be called if checkConf() returns true

const nodemailer = require('nodemailer')
let expiryTime = 0 // 0 means that it meets the condition immediately
let address

async function getContactLink() {
    if (Math.floor(Date.now() / 1000) >= expiryTime) { // If current time is longer than expiry time, validate mail server
        expiryTime = Math.floor(Date.now() / 1000) + 14400 // Set expiry for 4 hours' time
        try {
            let transporter = nodemailer.createTransport({
                host: conf.smtpserver, // Conf should really exist when this is called
                port: conf.smtpport,
                secure: conf.smtpssl,
                auth: {
                    user: conf.emailusername,
                    pass: conf.emailpassword,
                },
            });
            await transporter.verify(); // Unfortunately, this may end up being slightly slow but so long we don't crash!
            address = "/contact" // If success, set to /contact so users can use the more convenient contat form
        } catch (err) { // If we can't authenticate, if email is blank in conf return the default email address
            try {
                if (conf.emailaddress == "") {
                    address = "mailto:" + uniconf.defaultemail;
                } else {
                    address = "mailto:" + conf.emailaddress; // If email is not blank return the one in conf
                }
            } catch (err) {
                address = "mailto:" + uniconf.defaultemail;
            }

        } finally {
            return address; // Return the address after and only after validation
        }
    } else { // If outside of the hour return the previous address
        return address;
    }
}

module.exports = getContactLink;