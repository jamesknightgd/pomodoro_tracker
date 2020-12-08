import * as express from "express"
import {promisify} from "util"
import * as fs from "fs"
import * as path from "path"

import WorkLog from "../../shared/libraries/work_log/interface"

import WorkDay from "./../libraries/work_day/interface"
import cWorkDayFilePathFromDate from "../libraries/work_day/query/file_path_from_date"
import qWorkDayTotalWorkSeconds from "../libraries/work_day/query/total_work_seconds"

import HoursMinutesSeconds from "../../shared/libraries/hours_minutes_seconds/interface"
import cHoursMinutesSecondsFromSeconds from "../../shared/libraries/hours_minutes_seconds/compute/from_seconds"


/* 
    Responsibility
        Handles requests for todays work time, recoded in a work day file, as {hours, minutes, seconds}. 
*/
export default function handleRequestGetTodaysWorkTime(app: express.Express) : void
{
    app.get("/api/TodaysWorkTime", async (request, response)=>
    {
        const pathToWorkDayFile : string | null = cWorkDayFilePathFromDate(new Date())

        const doesWorkDayFileExist : boolean = pathToWorkDayFile !== null
        if(!doesWorkDayFileExist){ response.type(`application/json`).status(200).send({hours: 0, minutes: 0, seconds: 0}); return }

        const workDay  : WorkDay             = JSON.parse( (await promisify(fs.readFile)(pathToWorkDayFile as string)).toString() )
        const workTime : HoursMinutesSeconds = cHoursMinutesSecondsFromSeconds(qWorkDayTotalWorkSeconds(workDay))

        response.type(`application/json`).status(200).send(workTime)
    })
}