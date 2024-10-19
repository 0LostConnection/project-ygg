// Universal function to standardize logs
import colors from "colors"
import { table } from "table"

/**
 * Function that prints a formatted and colored message in the console.
 * @module log
 * @param {Object} logObject - The object containing the message and title to be printed.
 * @param {string} logObject.title - The custom title for the log.
 * @param {string} logObject.message - The message to be printed.
 * @param {"INFO"|"ERROR"|"SUCCESS"} level - The log level, which can be INFO, ERROR, or SUCCESS.
 * @returns {void} - The function does not return anything.
 * @default level - INFO
 * @requires colors - A module that allows adding colors to the text.
 * @example
 * // Example of using the log function
 * log({message: "Starting the application", title: "App Start"})
 * log({message: "Error connecting to the database", title: "DB Error"}, "error")
 * log({message: "User successfully registered", title: "Registration"}, "success")
 */
export function log({ title, message }, level = "INFO") {
    const colorsMap = {
        INFO: ({ message, title }) => {
            return colors.blue(`${title.bold}\n${message}\n`)
        },
        ERROR: ({ message, title }) => {
            return colors.red(`${title.bold}\n${message}\n`)
        },
        SUCCESS: ({ message, title }) => {
            return colors.green(`${title.bold}\n${message}\n`)
        },
    }

    console.log((colorsMap[level] ?? colorsMap["INFO"])({ title, message }))
}

/**
 * Function that prints a table with a formatted and colored title in the console.
 * @module consoleTable
 * @param {string} title - The title to be displayed above the table.
 * @param {Array[]} rows - The rows to be displayed in the table. Each row should be an array of strings.
 * @returns {void} - The function does not return anything.
 * @requires colors - A module that allows adding colors to the text.
 * @requires table - A module that formats data into a table.
 * @example
 * // Example of using the consoleTable function
 * const rows = [
 *     ["Title", ""],
 *     ["Row1Col1", "Row1Col2"],
 *     ["Row2Col1", "Row2Col2"]
 * ];
 * consoleTable("Table Title", rows);
 */
export function consoleTable(title, rows) {
    const tableConfig = {
        columns: [
            { alignment: "center", width: 10 },
        ],
        spanningCells: [
            { col: 0, row: 0, colSpan: 2 },
        ],
    }

    console.log(table([[`${title}`.blue.bold, ""]].concat(rows), tableConfig))
}
