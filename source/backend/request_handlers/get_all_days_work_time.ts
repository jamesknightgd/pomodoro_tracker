import * as express from "express"
import {promisify} from "util"
import * as fs from "fs"
import * as path from "path"

import WorkLog from "../../shared/libraries/work_log/interface"

import WorkDay from "../libraries/work_day/interface"
import qWorkDayTotalWorkSeconds from "../libraries/work_day/query/total_work_seconds"

import HoursMinutesSeconds from "../../shared/libraries/hours_minutes_seconds/interface"
import cHoursMinutesSecondsFromSeconds from "../../shared/libraries/hours_minutes_seconds/compute/from_seconds"

import cDayString from "../../shared/libraries/day/compute/from_todays_date"

/* 
    Responsibility
        Handles requests for all days work time for a day, i.e. get all records of work times for Monday.
*/
export default function handleRequestGetTodaysWorkTime(app: express.Express) : void
{
    app.get("/api/AllDaysWorkTime", async (request, response)=>
    {
        const day : string = cDayString()

        const pathToDataRoot : string = path.resolve("..", "..", "data")

        const filesInDataRoot          : fs.Dirent[] = await promisify(fs.readdir)(pathToDataRoot, {withFileTypes: true})
        const directoryNamesInDataRoot : string[]    = filesInDataRoot.filter(file => file.isDirectory()).map(directory => directory.name)

        const workTimesForDay : {[key: string] : HoursMinutesSeconds} = {}
        
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

                workTimesForDay[workDay.date] = cHoursMinutesSecondsFromSeconds(qWorkDayTotalWorkSeconds(workDay))
            }
        }

        response.type(`application/json`).status(200).send(workTimesForDay)
    })
}