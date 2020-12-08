import * as express from "express"
import {promisify} from "util"
import * as fs from "fs"

import WorkDay from "./../libraries/work_day/interface"
import cWorkDayFilePathFromDate from "../libraries/work_day/query/file_path_from_date"
import qWorkDayTotalWorkSeconds from "../libraries/work_day/query/total_work_seconds"

import HoursMinutesSeconds from "./../../shared/libraries/hours_minutes_seconds/interface"
import cHoursMinutesSecondsFromSeconds from "../../shared/libraries/hours_minutes_seconds/compute/from_seconds"

import qDateAsString from "./../../shared/libraries/date/query/as_string"

/* 
    Responsibility
        Handles requests for this months work time, i.e. gets work day records for each day this month and then
        aggregates into a single timing structure for the response.
*/
export default async function handleRequestThisMonthsWorkTime(app: express.Express)
{
    app.get("/api/ThisMonthsWorkTime", async (request, response)=>
    {
        const currentDate  : Date = new Date()
        const startOfMonth : Date = new Date()
        startOfMonth.setDate(1)

        let totalSecondsForMonth : number = 0
        for(let dayIndex = 0; dayIndex < currentDate.getDate(); ++dayIndex)
        {
            const date : Date = new Date()
            date.setDate(startOfMonth.getDate() + dayIndex)

            const pathToWorkDayFile    : string | null = cWorkDayFilePathFromDate(date)
            const doesWorkDayFileExist : boolean = pathToWorkDayFile !== null

            if(!doesWorkDayFileExist) continue

            const workDay  : WorkDay = JSON.parse( (await promisify(fs.readFile)(pathToWorkDayFile as string)).toString() )
            totalSecondsForMonth     += qWorkDayTotalWorkSeconds(workDay)
        }

        const totalWorkForMonth : HoursMinutesSeconds = cHoursMinutesSecondsFromSeconds(totalSecondsForMonth)

        response.type(`application/json`).status(200).send(totalWorkForMonth)
    })
}