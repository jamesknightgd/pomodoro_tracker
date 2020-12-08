import * as express from "express"
import {promisify} from "util"
import * as fs from "fs"

import WorkDay from "./../libraries/work_day/interface"
import cWorkDayFilePathFromDate from "../libraries/work_day/query/file_path_from_date"
import qWorkDayTotalWorkSeconds from "../libraries/work_day/query/total_work_seconds"

import HoursMinutesSeconds from "./../../shared/libraries/hours_minutes_seconds/interface"
import cHoursMinutesSecondsFromSeconds from "../../shared/libraries/hours_minutes_seconds/compute/from_seconds"

/* 
    Responsibility
        Handles requests for this weeks work time, i.e. gets work day records for each day this week and then
        aggregates into a single timing structure for the response.
*/
export default async function handleRequestThisWeeksWorkTime(app: express.Express)
{
    app.get("/api/ThisWeeksWorkTime", async (request, response)=>
    {
        const today       : Date = new Date()
        const startOfWeek : Date = new Date()
        startOfWeek.setDate(today.getDate() - today.getDay())

        let totalSecondsForWeek : number = 0
        for(let dayIndex = 0; dayIndex <= today.getDay(); ++dayIndex)
        {
            const date : Date = new Date()
            date.setDate(startOfWeek.getDate() + dayIndex)

            const pathToWorkDayFile    : string | null = cWorkDayFilePathFromDate(date)
            const doesWorkDayFileExist : boolean = pathToWorkDayFile !== null

            if(!doesWorkDayFileExist) continue

            const workDay  : WorkDay = JSON.parse( (await promisify(fs.readFile)(pathToWorkDayFile as string)).toString() )
            totalSecondsForWeek      += qWorkDayTotalWorkSeconds(workDay)
        }

        const totalWorkForWeek : HoursMinutesSeconds = cHoursMinutesSecondsFromSeconds(totalSecondsForWeek)

        response.type(`application/json`).status(200).send(totalWorkForWeek)
    })
}