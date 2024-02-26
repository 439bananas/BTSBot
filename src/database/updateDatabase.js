/////////////////////////////////////////////////////////////
//                                                         //
//                         BTS Bot                         //
//                                                         //
//                 File updateDatabase.js                  //
//                                                         //
//               Author: Thomas (439bananas)               //
//                                                         //
// Copyright 439bananas 2024 under the Apache 2.0 license. //
//                                                         //
/////////////////////////////////////////////////////////////

import globaliseMySQL from './mySQLGlobaliser'
import tables from '../configs/databaseTables.json'
import { mode, version } from '../../package.json'
import updateDb from './updateDatabaseVersion'
let lang = await getlang()

async function addTables() {
    if (mode == "alpha" || mode == "beta" || mode == "active-development" || mode == "ad") {
        log.warn(uniconf.projname + await translate(lang, "log_prereleasewarning"))
    } // Warn user if pre-release version in use. pkg.mode can be anything and BTS Bot would accept it as stable so ad/active-development/beta/alpha are the key words to look out for

    let re = await globaliseMySQL() // Initialise the MySQL client

    log.error("updateDatabase needs implementation of foreign keys and indexed keys")

    if (re.protocolVersion) {
        let queriesMade = 0
        let promises = []
        for (const tableName in tables) { // For each table, check if it exists and if it does not, create it
            try {
                let columns = await MySQLConnection.query("SHOW COLUMNS FROM " + tableName + ";") // Bad practice usually but it's really *only* the server's fault if anything gets injected
                for (let proposedColumnIndex in tables[tableName]) { // This is janky, I apologise, but this won't be used on a huge scale
                    let proposedColumn = tables[tableName][proposedColumnIndex]
                    let found = false
                    for (let columnIndex in columns[0]) {
                        let column = columns[0][columnIndex]
                        if (column.Field == proposedColumn[0]) {
                            found = true
                            break
                        }
                    }

                    if (!found) { // https://www.mysqltutorial.org/mysql-add-column/ - Check if necessary columns exist in current table
                        queriesMade++
                        try {
                            let addColumnSuccess = await MySQLConnection.query("ALTER TABLE " + tableName + " ADD COLUMN " + proposedColumn[0] + " " + proposedColumn[1] + ";") // Again, inherently bad but sadly the prepared statement only enters in strings
                            if (addColumnSuccess) {
                                promises.push(addColumnSuccess)
                                log.warn(await translate(lang, "log_newcolumncreated") + tableName + ": " + proposedColumn[0]) // Also since when did Node.JS not print a statement with undefined in it and just not print the statement at all if that's the case???
                            }
                        } catch (err) {
                            log.error(await translate(lang, "log_tableupdateerror") + tableName + ": " + err.code)
                            console.log(err)
                        }
                    } // I doubt there's much point in ensuring the types match to what's in the JSON file
                }
            } catch (err) {
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

                        let query = "CREATE TABLE IF NOT EXISTS " + tableName + "(" + columns + constraint + ");"
                        queriesMade++
                        try {
                            let newTableSuccess = await MySQLConnection.query(query) // Create the table
                            if (newTableSuccess) {
                                promises.push(newTableSuccess)
                                log.warn(await translate(lang, "log_newtablecreated") + tableName)
                                if (tableName.toLowerCase() == "botconfig") {
                                    queriesMade++
                                    let newRecordSuccess = await MySQLConnection.query('INSERT INTO BotConfig(property, value) VALUES ("dbVersion", ?), ("lastCheckedGuildCount", 0), ("lastCheckedInstanceCount",0), ("lastCheckedTime", 0)', [version])
                                    promises.push(newRecordSuccess) // ^^ Add properties to botConfig table
                                }
                            }
                        } catch (error) {
                            log.error(await translate(lang, "log_newtablecreationerror") + tableName + ": " + error.code)
                            console.log(error)
                            log.fatal(uniconf.projname + await translate(lang, "log_fatalupdatedb"))
                        }
                        break
                    default:
                        log.error("************************************************")
                        console.log(err)
                        log.fatal(await translate(lang, "log_queryingdbcolumnsfailedpart1") + err.code + await translate(lang, "log_queryingdbcolumnsfailedpart2") + uniconf.projname + await translate(lang, "log_queryingdbcolumnsfailedpart2"))
                }
            }
        }
        if (queriesMade == promises.length) {
            await updateDb()
        }
    }
}

export default addTables