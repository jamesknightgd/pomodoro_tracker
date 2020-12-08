import * as express from "express"
import * as bodyParser from "body-parser"
import * as path from "path"
import * as fs from "fs"
import {promisify} from "util"

import handlePostWorkLog from "./request_handlers/post_work_log"
import handleGetFocuses from "./request_handlers/get_focuses"
import handleGetTodaysWorkTime from "./request_handlers/get_todays_work_time"
import handleGetDailyAverageWorkTime from "./request_handlers/get_daily_average_work_time"
import handleGetAllDaysWorkTime from "./request_handlers/get_all_days_work_time"
import handleGetThisWeekWorkTime from "./request_handlers/get_this_weeks_work_time"
import handleGetWeeklyAverageWorkTime from "./request_handlers/get_weekly_average_work_time"
import handleGetEachWeeksWorkTime from "./request_handlers/get_each_weeks_work_time"
import handleGetThisMonthWorkTime from "./request_handlers/get_this_months_work_time"
import hangleGetAverageMonthWorkTime from "./request_handlers/get_monthly_average_work_time"
import handleGetEachMonthsWorkTime from "./request_handlers/get_each_months_work_time"

const app                     : express.Express = express()
const port                    : number          = 8000
const pathToFrontendResources : string = path.resolve(`..`, `frontend`)

app.use(bodyParser.json())

/*
    Responsibility
        Respond to requests for the index.html file.      
*/
app.get(`/`, 
    async (request,response)=>
    {
        const pathToIndex   : string = path.resolve(pathToFrontendResources, "index.html")
        const indexFileData : string = (await promisify(fs.readFile)(pathToIndex)).toString()

        response.type('text/html').status(200).send(indexFileData)
    })

/*
    Responsibility
        Respond to requests for the entry.js file.      
*/
app.get(`/entry.js`, 
    async (request,response)=>
    {
        const pathToEntry   : string = path.resolve(pathToFrontendResources, "entry.js")
        const entryFileData : string = (await promisify(fs.readFile)(pathToEntry)).toString()

        response.type('text/javascript').status(200).send(entryFileData)
    })

/*
    Responsibility
        Respond to requests for the alarm file.      
*/
app.get(`/alarm.wav`, 
    async (request,response)=>
    {
        const pathToAlarm   : string = path.resolve(pathToFrontendResources, "alarm.wav")
        const alarmFileData : Buffer = (await promisify(fs.readFile)(pathToAlarm))

        response.type('audio/wav').status(200).send(alarmFileData)
    })

handlePostWorkLog(app)
handleGetFocuses(app)
handleGetTodaysWorkTime(app)
handleGetDailyAverageWorkTime(app)
handleGetAllDaysWorkTime(app)
handleGetThisWeekWorkTime(app)
handleGetWeeklyAverageWorkTime(app)
handleGetEachWeeksWorkTime(app)
handleGetThisMonthWorkTime(app)
hangleGetAverageMonthWorkTime(app)
handleGetEachMonthsWorkTime(app)

app.listen(port, ()=>{})