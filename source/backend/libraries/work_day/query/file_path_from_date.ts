/*
    Responsibility
        Computes the file path to a work day file given a specific date. If not file exists,
        it will return null.

    Output
        string : the path to an existing work day file.
        null   : if the work day file does not exist.
*/

import * as path from "path"
import * as fs from "fs"

export default function computeWorkDayFilePathFromDate(date: Date) : string | null
{
    const year               : number  = date.getFullYear()
    const month              : number  = date.getMonth() + 1
    const pathToWorkMonthDir : string  = path.resolve("..", "..", "data", `${year}_${month}`)
    const pathToWorkDayFile  : string  = path.resolve(pathToWorkMonthDir, `${date.getDate()}.json`)
    const doesFileExist      : boolean = fs.existsSync(pathToWorkDayFile)

    return doesFileExist ? pathToWorkDayFile : null
}