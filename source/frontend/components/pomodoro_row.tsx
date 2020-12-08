import * as React from "react"
import { Box, Grid, Typography, Select, MenuItem, IconButton, withStyles } from "@material-ui/core"
import { PlayArrow, Pause } from "@material-ui/icons"

import BlockRow from "./blocks/row"
import TextBlock from "./blocks/text"
import ChartBlock from "./blocks/chart"
import AnyBlock from "./../components/blocks/any"

import colors from "../libraries/colors"

import WorkLog from "../../shared/libraries/work_log/interface"

type PomodoroState = "Not Started" | "In Progress" | "Paused"


export interface Props
{
    onPomodoroFinished : ()=>void
}
export default function CurrentPomodoroRow(props: Props): JSX.Element
{
    const [pomodoroState, setPomodoroState]                 = React.useState<PomodoroState>("Not Started")
    const [msRemainingInPomodoro, setMSRemainingInPomodoro] = React.useState<number>(computePomodoroDurationMS())
    const [msTimeOfLastUpdate, setMSTimeOfLastUpdate]       = React.useState<number | null>(null)
    const [msTimeSelectedFocus, setMSTimeSelectedFocus] = React.useState<number | null>(null)
    const [focuses, setFocuses]                             = React.useState<string[] | null>(null)
    const [selectedFocusIndex, setSelectedFocusIndex]       = React.useState<number | null>(null)

    React.useEffect(
        ()=>
        {
            if(msTimeOfLastUpdate !== null && pomodoroState === "In Progress")
            {
                const timerID = setTimeout(tick, 1000)
                return ()=>{clearTimeout(timerID)}
            }
            
            return
        },
        [msTimeOfLastUpdate, pomodoroState]
    )

    const hasInitialized = React.useRef<boolean>(false)
    React.useEffect(()=>{
        if(hasInitialized.current) return

        hasInitialized.current = true
        refreshFocuses()
    })

    async function refreshFocuses()
    {
        const response = await fetch("/api/focuses", {method: "get", headers:{"Accept": "application/json"}})

        const focuses : string[] = (await response.json()) as string[]

        setFocuses(focuses)
        setSelectedFocusIndex(focuses.length !== 0 ? 0 : null)
        setMSTimeSelectedFocus(Date.now())
    }

    function computePrintableTimeRemainingInPomodoro(): string
    {
        const secondsRemaining : number = Math.ceil( (msRemainingInPomodoro / 1000) % 60 )
        const minutesRemaining : number = Math.floor( (msRemainingInPomodoro / 1000) / 60 )

        const secondsRemainingPrintable : string = secondsRemaining >= 10 ? `${secondsRemaining}` : `0${secondsRemaining}`
        const minutesRemainingPrintable : string = minutesRemaining >= 10 ? `${minutesRemaining}` : `0${minutesRemaining}`
        
        return `${minutesRemainingPrintable}:${secondsRemainingPrintable}`
    }

    function computePomodoroDurationMS(): number
    {
        return 50 * 60 * 1000
    }

    function updateRemainingPomodoroTime() : void
    {
        if(msTimeOfLastUpdate === null) throw `Expected last update time to not be null.`

        const elapsedMSSinceLastUpdate : number  = Date.now() - msTimeOfLastUpdate
        const hasPomodoroFinished      : boolean = msRemainingInPomodoro < elapsedMSSinceLastUpdate
        if(hasPomodoroFinished)
        {
            setMSRemainingInPomodoro(0)
            setMSTimeOfLastUpdate(Date.now())
        }
        else
        {
            const msRemainingInPomodoroAfterUpdate = msRemainingInPomodoro - elapsedMSSinceLastUpdate
            setMSRemainingInPomodoro(msRemainingInPomodoroAfterUpdate)
            setMSTimeOfLastUpdate(Date.now())
        }
    }

    function tick(): void
    {
        if(pomodoroState !== "In Progress") return

        const hasPomodoroFinished : boolean = msRemainingInPomodoro === 0
        if(hasPomodoroFinished) handlePomodoroFinished()
        else                    updateRemainingPomodoroTime()
    }

    async function handlePomodoroFinished(): Promise<void>
    {
        await sendWorkLogToServer()
        setMSRemainingInPomodoro(computePomodoroDurationMS())
        setMSTimeOfLastUpdate(null)
        setPomodoroState("Not Started")

        new Notification('Pomodoro Finished.', {})
        const audio = new Audio(`/alarm.wav`)
        audio.volume = 1.0
        audio.play()        

        props.onPomodoroFinished()
    }

    function startPomodoro(): void
    {
        if(pomodoroState !== "Not Started") throw `Expected pomodoro state to be "Not Started". Pomodoro State: ${pomodoroState}.`

        Notification.requestPermission()
        resumePomodoro()
    }

    function resumePomodoro(): void
    {
        setMSTimeOfLastUpdate(Date.now())
        setMSTimeSelectedFocus(Date.now())
        setPomodoroState("In Progress")
    }

    async function pausePomodoro() : Promise<void>
    {
        updateRemainingPomodoroTime()
        sendWorkLogToServer()
        setMSTimeSelectedFocus(null)
        setPomodoroState("Paused")
    }

    function handleButtonClick(): void
    {
        const shouldNotStartAsFocusIsNotSelected : boolean = selectedFocusIndex === null
        if(shouldNotStartAsFocusIsNotSelected) return

        switch(pomodoroState)
        {
            case "Not Started": startPomodoro(); break;
            case "In Progress": pausePomodoro(); break;
            case "Paused": resumePomodoro(); break;
        }
        
    }

    function handleOnSelectChanged(event: React.ChangeEvent<{value: any}>) : void
    {
        if(focuses === null) throw `Expected focuses to not be null.`

        if(pomodoroState === "In Progress") sendWorkLogToServer()
        
        setSelectedFocusIndex(focuses.findIndex(focus => focus === event.target.value))
        setMSTimeSelectedFocus(Date.now())
    }

    async function sendWorkLogToServer() : Promise<void>
    {
        if(msTimeSelectedFocus === null)                      throw `Expected msTimeInSelectedFocus to not be null.`

        let msTimeInSelectedFocus : number = Date.now() - msTimeSelectedFocus

        const hasBeenInSelectedFocusForLongerThanPomodoroDuration : boolean = msTimeInSelectedFocus > (computePomodoroDurationMS() - msRemainingInPomodoro)
        if(hasBeenInSelectedFocusForLongerThanPomodoroDuration) msTimeInSelectedFocus = computePomodoroDurationMS() - msRemainingInPomodoro

        if(focuses === null) throw `Expected focuses to not be null.`
        if(selectedFocusIndex === null) throw `Expected selectedFocusIndex to not be null.`

        const workLog : WorkLog = {focus: focuses[selectedFocusIndex], seconds: Math.floor(msTimeInSelectedFocus / 1000)}

        await fetch("/api/WorkLog", {method: "Post", headers:{"Content-Type": "application/json"}, body: JSON.stringify(workLog)})
    }

    return ( 
        <BlockRow margin="6px" margin_top="6px">
            {/* Pomodoro Focus */}
            <AnyBlock width="33.33%" margin_left="0px" header={`Focus`}>
                <Select id="select-focus" value={selectedFocusIndex !== null && focuses !== null ? focuses[selectedFocusIndex] : ""} displayEmpty={selectedFocusIndex === null} onChange={handleOnSelectChanged}>
                    {
                        focuses !== null && selectedFocusIndex !== null ? focuses.map((focus)=>{return <MenuItem key={focus} value={focus} selected={focus === focuses[selectedFocusIndex]}>{focus}</MenuItem>}) : null
                    }
                </Select>
            </AnyBlock>

            {/* Start / Pause */}
            <AnyBlock width="33.33%" margin_left="2px" header={pomodoroState}>
                <IconButton style={{height: "50%", width: "50%"}} onClick={handleButtonClick}>
                    {
                        pomodoroState === "In Progress" 
                            ? <Pause style={{color: colors.primary.light, height: "50%", width: "50%"}}/>
                            : <PlayArrow style={{color: colors.primary.light, height: "50%", width: "50%"}}/>
                    }
                </IconButton>
            </AnyBlock>

            {/* Monthly Average Graph */}
            <TextBlock width="33.33%" margin_left="2px" header={`Time Remaining`} content={computePrintableTimeRemainingInPomodoro()}/>
        </BlockRow>
    )
}