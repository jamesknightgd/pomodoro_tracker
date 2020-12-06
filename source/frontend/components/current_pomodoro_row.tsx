import * as React from "react"
import { Box, Grid, Typography, Select, MenuItem, IconButton } from "@material-ui/core"
import { PlayArrow, Pause } from "@material-ui/icons"

import colors from "../libraries/colors"

type PomodoroState = "Not Started" | "In Progress" | "Paused"

export default function CurrentPomodoroRow(): JSX.Element
{
    const [pomodoroState, setPomodoroState] = React.useState<PomodoroState>("Not Started")
    const [msRemainingInPomodoro, setMSRemainingInPomodoro] = React.useState<number>(computePomodoroDurationMS())
    const [msTimeOfLastUpdate, setMSTimeOfLastUpdate] = React.useState<number | null>(null)

    React.useEffect(
        ()=>
        {
            if(msTimeOfLastUpdate !== null && pomodoroState === "In Progress")
            {
                const timerID = setInterval(tick, 1000)
                return ()=>{clearInterval(timerID)}
            }
            
            return
        },
        [msTimeOfLastUpdate, pomodoroState]
    )

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
        return 1 * 4 * 1000
    }

    function updateRemainingPomodoroTime(): number
    {
        if(msTimeOfLastUpdate === null) throw `Expected last update time to not be null.`

        const elapsedMSSinceLastUpdate : number  = Date.now() - msTimeOfLastUpdate
        const hasPomodoroFinished      : boolean = msRemainingInPomodoro < elapsedMSSinceLastUpdate
        if(hasPomodoroFinished)
        {
            setMSRemainingInPomodoro(0)
            setMSTimeOfLastUpdate(Date.now())
            return 0
        }
        else
        {
            const msRemainingInPomodoroAfterUpdate = msRemainingInPomodoro - elapsedMSSinceLastUpdate
            setMSRemainingInPomodoro(msRemainingInPomodoroAfterUpdate)
            setMSTimeOfLastUpdate(Date.now())
            return msRemainingInPomodoroAfterUpdate
        }
    }

    function tick(): void
    {
        if(pomodoroState !== "In Progress") return

        const msRemainingInPomodoroAfterUpdate = updateRemainingPomodoroTime()

        const hasPomodoroFinished : boolean = msRemainingInPomodoroAfterUpdate === 0
        if(hasPomodoroFinished)
        {
            setMSRemainingInPomodoro(computePomodoroDurationMS())
            setMSTimeOfLastUpdate(null)
            setPomodoroState("Not Started")
            const n = new Notification('Pomodoro Finished.', {})
            const audio = new Audio(`/alarm.wav`)
            audio.volume = 1.0
            audio.play()
        }
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
        setPomodoroState("In Progress")
    }

    function pausePomodoro(): void
    {
        updateRemainingPomodoroTime()
        setPomodoroState("Paused")
    }

    function handleButtonClick(): void
    {
        switch(pomodoroState)
        {
            case "Not Started": startPomodoro(); break;
            case "In Progress": pausePomodoro(); break;
            case "Paused": resumePomodoro(); break;
        }
        
    }

    return ( 
        <Box height="calc(100% - 4px * 2)" width="calc(100% - 4px * 2)" m="4px">

            <Grid container direction="row" justify="center" style={{height: "100%", width: "100%"}}>
                
                {/* Select Focus */}
                <Box height="100%" width="33.33%" bgcolor="primary.dark">
                    <Grid container justify="center" alignItems="center" style={{height: "100%", width: "100%"}}>
                        <Select id="select-focus" value={10}>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                            <MenuItem value={40}>➕</MenuItem>
                        </Select>
                    </Grid>
                </Box>

                {/* Play, Pause */}
                <Box height="100%" width="calc(33.33% - 2px)" ml="2px" bgcolor="primary.dark">
                    <Grid container justify="center" alignItems="center" style={{height: "100%", width: "100%"}}>
                        <IconButton style={{height: "50%", width: "50%"}} onClick={handleButtonClick}>
                            {
                                pomodoroState === "In Progress" 
                                    ? <Pause style={{color: colors.primary.light, height: "50%", width: "50%"}}/>
                                    : <PlayArrow style={{color: colors.primary.light, height: "50%", width: "50%"}}/>
                            }
                        </IconButton>
                    </Grid>
                </Box>

                {/* Time remaining */}
                <Box height="100%" width="calc(33.33% - 2px)" ml="2px" bgcolor="primary.dark">
                    <Grid container justify="center" alignItems="center" style={{height: "100%", width: "100%"}}>
                        <Typography variant="h1" color="textPrimary">{computePrintableTimeRemainingInPomodoro()}</Typography>
                    </Grid>
                </Box>
                
            </Grid>
        </Box>
    )
}