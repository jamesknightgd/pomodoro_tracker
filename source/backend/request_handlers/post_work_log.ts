/* 
    Responsibility
        Handles requests for posting a new work log, i.e. a record of seconds worked within a certain work type
        by the frontend.
*/

import * as express from "express"
import {promisify} from "util"
import * as fs from "fs"
import * as path from "path"

import WorkLog from "../../shared/libraries/work_log/interface"
import WorkDay from "./../libraries/work_day/interface"

import cDayStringFromNumber from "../../shared/libraries/day/compute/from_number"

import qDateAsString from "./../../shared/libraries/date/query/as_string"



export default function handleRequestPostWorkLog(app: express.Express) : void
{
    app.post("/api/WorkLog", async (request, response)=>
    {
        const workLog : WorkLog = request.body
        
        const date                 : Date    = new Date()
        const year                 : number  = date.getFullYear()
        const month                : number  = date.getMonth() + 1
        const day                  : number  = date.getDay()
        const pathToWorkMonthDir   : string  = path.resolve("..", "..", "data", `${year}_${month}`)
        const pathToWorkDayFile    : string  = path.resolve(pathToWorkMonthDir, `${date.getDate()}.json`)
        const doesWorkDayFileExist : boolean = fs.existsSync(pathToWorkDayFile)

        let workDay               : WorkDay = {day: "Monday", date: "", workLogs: []}
        const shouldCreateWorkDay : boolean = !doesWorkDayFileExist
        if(shouldCreateWorkDay) workDay = {day: cDayStringFromNumber(day), date: qDateAsString(date), workLogs: []}
        else                    workDay = JSON.parse((await promisify(fs.readFile)(pathToWorkDayFile)).toString())

        const doesWorkMonthDirectoryExist : boolean = doesWorkDayFileExist || fs.existsSync(pathToWorkMonthDir)
        const shouldCreateWorkMonthDir    : boolean = !doesWorkMonthDirectoryExist
        if(shouldCreateWorkMonthDir) await promisify(fs.mkdir)(pathToWorkMonthDir)

        workDay.workLogs.push(workLog)
        
        await promisify(fs.writeFile)(pathToWorkDayFile, JSON.stringify(workDay, null, 4))

        response.status(200).send()
    })
}