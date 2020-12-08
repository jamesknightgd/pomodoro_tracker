import * as express from "express"
import {promisify} from "util"
import * as fs from "fs"
import * as path from "path"

import WorkLog from "../../shared/libraries/work_log/interface"
import WorkDay from "./../libraries/work_day/interface"

import HoursMinutesSeconds from "./../../shared/libraries/hours_minutes_seconds/interface"
import cHoursMinutesSecondsFromSeconds from "../../shared/libraries/hours_minutes_seconds/compute/from_seconds"

import cDayString from "../../shared/libraries/day/compute/from_todays_date"

/* 
    Responsibility
        Handles requests for getting the daily average work time as {hours, minutes, seconds},
        which is computed from all the work day files of this day, i.e. average work time for Monday. 
*/
export default function handleRequestGetDailyAverageHoursForDay(app: express.Express) : void
{
    app.get("/api/DailyAverageWorkTime", async (request, response)=>
    {
        const day : string = cDayString()

        const pathToDataRoot : string = path.resolve("..", "..", "data")

        const filesInDataRoot          : fs.Dirent[] = await promisify(fs.readdir)(pathToDataRoot, {withFileTypes: true})
        const directoryNamesInDataRoot : string[]    = filesInDataRoot.filter(file => file.isDirectory()).map(directory => directory.name)

        let totalSeconds : number = 0
        let daysCounted  : number = 0
        
        for(const directoryName of directoryNamesInDataRoot)
        {
            const pathToDirectory        : string      = path.resolve(pathToDataRoot, directoryName)
            const filesInDirectory       : fs.Dirent[] = await promisify(fs.readdir)(pathToDirectory, {withFileTypes: true})
            const workDayLogsInDirectory : string[]    = filesInDirectory.filter(file => file.name.includes(`.json`)).map(dirent => dirent.name)

            for(const fileName of workDayLogsInDirectory)
            {
                const pathToWorkLog : string  = path.resolve(pathToDirectory, fileName)
                const workDay       : WorkDay = JSON.parse( (await promisify(fs.readFile)(pathToWorkLog)).toString() )

                const isTheCorrectDay : boolean = workDay.day === day
                if(!isTheCorrectDay) continue

                for(const workLog of workDay.workLogs)
                {
                    totalSeconds += workLog.seconds
                }    

                daysCounted += 1
            }
        }

        const hasNoRecordedDays : boolean = daysCounted === 0
        if(hasNoRecordedDays){ response.type(`application/json`).status(200).send({hours: 0, minutes: 0, seconds: 0}); return }

        const averageSeconds  : number              = totalSeconds / daysCounted
        const averageWorkTime : HoursMinutesSeconds = cHoursMinutesSecondsFromSeconds(averageSeconds)

        response.type(`application/json`).status(200).send(averageWorkTime)
    })
}