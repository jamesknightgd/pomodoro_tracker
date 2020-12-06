import * as express from "express"
import * as path from "path"
import * as fs from "fs"
import {promisify} from "util"

const app                     : express.Express = express()
const port                    : number          = 8000
const pathToFrontendResources : string = path.resolve(`..`, `frontend`)

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



app.listen(port, ()=>{})