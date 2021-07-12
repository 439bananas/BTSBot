const log = require('../core/logHandler');
const checkconf = require('../core/checkConfExists');
const mysql = require('mysql');

async function checkmysql(hostname, username, password, database) {
    var connection = mysql.createConnection({
        
    })
}