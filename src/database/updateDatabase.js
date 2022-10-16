/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File updateDatabase.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2022 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

const tables = require('../configs/databaseTables.json')
const pkg = require('../../package.json')
let lang = getlang()

if (pkg.mode == "alpha" || pkg.mode == "beta" || pkg.mode == "active-development" || pkg.mode == "ad") {
    log.warn(uniconf.projname + translate(lang, "log_prereleasewarning"))
} // Warn user if pre-release version in use. pkg.mode can be anything and BTS Bot would accept it as stable so ad/active-development/beta/alpha are the key words to look out for

for (const tableName in tables) { // For each table, check if it exists and if it does not, create it
    MySQLConnection.query("SHOW COLUMNS FROM " + tableName + ";").then(response => { // Bad practice usually but it's really *only* the server's fault if anything gets injected
        let found
        let column
        for (proposedColumnIndex in tables[tableName]) { // This is janky, I apologise, but this won't be used on a huge scale
            let proposedColumn = tables[tableName][proposedColumnIndex]
            found = false
            for (columnIndex in response[0]) {
                column = response[0][columnIndex]
                if (column.Field == proposedColumn[0]) {
                    found = true
                    break
                }
            }
            if (!found) { // https://www.mysqltutorial.org/mysql-add-column/ - Check if necessary columns exist in current table
                MySQLConnection.query("ALTER TABLE " + tableName + " ADD COLUMN " + proposedColumn[0] + " " + proposedColumn[1] + ";").then(success => { // Again, inherently bad but sadly the prepared statement only enters in strings
                    log.warn(translate(lang, "log_newcolumncreated") + tableName + ": " + proposedColumn[0]) // Also since when did Node.JS not print a statement with undefined in it and just not print the statement at all if that's the case???
                }).catch(err => {
                    log.error(translate(lang, "log_tableupdateerror") + tableName + ": " + err.code)
                    console.log(err)
                })
            } // I doubt there's much point in ensuring the types match to what's in the JSON file
        }
    }).catch(err => {
        switch (err.code) {
            case "ER_NO_SUCH_TABLE": // If there is no table in question, create it
                let options
                let columns = ""
                let primary = ""
                let constraint
                let ppk
                for (const column in tables[tableName]) { // Gather the columns necessary from the DB tables JSON
                    if (columns != "") {
                        columns += ", "
                    }

                    options = tables[tableName][column] 
                    columns += options[0] + " " + options[1] // When creating a table, you need to supply each column with the type for the column

                    if (options[1].toLowerCase() == "bigint") { // Big integers in this case are not going to be negative
                        columns += " UNSIGNED"
                    }

                    if (options[2] == "pk") { // Change behaviour on whether each column is a primary or partial primary key
                        primary = options[0]
                        ppk = false
                    } else if (options[2] == "ppk") {
                        if (primary != "") {
                            primary += ", "
                        }
                        primary += options[0]
                        ppk = true
                    }
                }
                if (primary && ppk) { // Add constraint if there is a partial primary key
                    constraint = ", CONSTRAINT " + options[0] + "_pk PRIMARY KEY (" + primary + ")"
                }
                else if (primary && !ppk) { // If there is only a primary key, add the primary key
                    constraint = ", PRIMARY KEY (" + primary + ")"
                }
                else { // Add nothing if there is no primary key
                    constraint = ""
                }

                let query = "CREATE TABLE " + tableName + "(" + columns + constraint + ");"
                MySQLConnection.query(query).then(response => { // Create the table
                    log.warn(translate(lang, "log_newtablecreated") + tableName)
                    if (tableName.toLowerCase() == "botconfig") {
                        MySQLConnection.query('INSERT INTO botConfig(property, value) VALUES ("dbVersion", ?), ("lastCheckedGuildCount", 0), ("lastCheckedInstanceCount",0), ("lastCheckedTime", 0)', [pkg.version]).catch(err => {
                            log.error("************************************************") // ^^ Add properties to botConfig table
                            console.log(err)
                            log.fatal(translate(lang, "log_queryingdbcolumnsfailedpart1") + err.code + translate(lang, "log_queryingdbcolumnsfailedpart2") + uniconf.projname + translate(lang, "log_queryingdbcolumnsfailedpart2"))
                        })
                    }
                }).catch(error => {
                    log.error(translate(lang, "log_newtablecreationerror") + tableName + ": " + error.code)
                    console.log(error)
                    log.fatal(uniconf.projname + translate(lang, "log_fatalupdatedb"))
                })
                break
            default:
                log.error("************************************************")
                console.log(err)
                log.fatal(translate(lang, "log_queryingdbcolumnsfailedpart1") + err.code + translate(lang, "log_queryingdbcolumnsfailedpart2") + uniconf.projname + translate(lang, "log_queryingdbcolumnsfailedpart2"))
        }
    })
}