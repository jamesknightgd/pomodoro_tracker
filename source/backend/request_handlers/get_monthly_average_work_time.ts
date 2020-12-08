import * as express from "express"
import {promisify} from "util"
import * as fs from "fs"
import * as path from "path"

import WorkDay from "./../libraries/work_day/interface"
import cWorkDayFilePathFromDate from "../libraries/work_day/query/file_path_from_date"
import qWorkDayTotalWorkSeconds from "../libraries/work_day/query/total_work_seconds"

import HoursMinutesSeconds from "./../../shared/libraries/hours_minutes_seconds/interface"
import cHoursMinutesSecondsFromSeconds from "../../shared/libraries/hours_minutes_seconds/compute/from_seconds"

import cMonthFromNumber from "./../../shared/libraries/month/compute/from_number"

import qDateAsString from "./../../shared/libraries/date/query/as_string"

/* 
    Responsibility
        Handles requests for monthly average work time, i.e. the hours minutes and seconds of work each month.
*/
export default async function handleRequestMonthlyAverageWorkTime(app: express.Express)
{
    app.get("/api/MonthlyAverageWorkTime", async (request, response)=>
    {
        const monthToTotalSecondsWorkedInMonth : {[key : string] : number} = {}

        const pathToDataRoot : string = path.resolve("..", "..", "data")

        const filesInDataRoot          : fs.Dirent[] = await promisify(fs.readdir)(pathToDataRoot, {withFileTypes: true})
        const directoryNamesInDataRoot : string[]    = filesInDataRoot.filter(file => file.isDirectory()).map(directory => directory.name)        
        for(const directoryName of directoryNamesInDataRoot)
        {
            const pathToDirectory        : string      = path.resolve(pathToDataRoot, directoryName)
            const filesInDirectory       : fs.Dirent[] = await promisify(fs.readdir)(pathToDirectory, {withFileTypes: true})
            const workDayLogsInDirectory : string[]    = filesInDirectory.filter(file => file.name.includes(`.json`)).map(dirent => dirent.name)

            const month : number = parseInt( directoryName.split(`_`)[1] )

            monthToTotalSecondsWorkedInMonth[cMonthFromNumber(month - 1)] = 0

            for(const fileName of workDayLogsInDirectory)
            {
                const pathToWorkLog : string  = path.resolve(pathToDirectory, fileName)
                const workDay       : WorkDay = JSON.parse( (await promisify(fs.readFile)(pathToWorkLog)).toString() )

                monthToTotalSecondsWorkedInMonth[cMonthFromNumber(month - 1)] += qWorkDayTotalWorkSeconds(workDay)
            }
        }

        let totalSecondsWorked : number = 0
        for(const month in monthToTotalSecondsWorkedInMonth)
        {
            totalSecondsWorked += monthToTotalSecondsWorkedInMonth[month]
        }
        
        const averageSecondsWorked : number = totalSecondsWorked / Object.keys(monthToTotalSecondsWorkedInMonth).length

        const averageTimeWorked : HoursMinutesSeconds = cHoursMinutesSecondsFromSeconds(averageSecondsWorked)

        response.type(`application/json`).status(200).send(averageTimeWorked)
    })
}