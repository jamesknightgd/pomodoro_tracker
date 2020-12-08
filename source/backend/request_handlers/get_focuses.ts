import * as express from "express"
import {promisify} from "util"
import * as fs from "fs"
import * as path from "path"

import WorkDay from "../libraries/work_day/interface"
import cWorkDayFilePathFromDate from "../libraries/work_day/query/file_path_from_date"
import qWorkDayTotalWorkSeconds from "../libraries/work_day/query/total_work_seconds"

import HoursMinutesSeconds from "../../shared/libraries/hours_minutes_seconds/interface"
import cHoursMinutesSecondsFromSeconds from "../../shared/libraries/hours_minutes_seconds/compute/from_seconds"

import cMonthFromNumber from "../../shared/libraries/month/compute/from_number"

import qDateAsString from "../../shared/libraries/date/query/as_string"

/* 
    Responsibility
        Handles requests for getting the work time of each week.
*/
export default async function handle(app: express.Express)
{
    app.get("/api/focuses", async (request, response)=>
    {
        const pathToFocuses   : string = path.resolve("..", "..", "data", "focuses.json")
        const focusesFileData : {}     = JSON.parse( (await promisify(fs.readFile)(pathToFocuses)).toString() )

        response.status(200).type(`application/json`).send(focusesFileData)
    })
}