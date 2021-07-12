const log = require('../core/logHandler');
const checkconf = require('../core/checkConfExists');
const mysql = require('mysql');

var connection = mysql.createConnection({})