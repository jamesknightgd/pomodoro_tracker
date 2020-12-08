import * as React from "react"
import * as ReactDOM from "react-dom"
import { createMuiTheme, ThemeProvider, Theme, Grid, responsiveFontSizes, Box } from "@material-ui/core"
import ScopedCSSBaseline from "@material-ui/core/ScopedCssBaseline"

import CurrentPomodoroRow from "./components/pomodoro_row"
import DayRow from "./components/day_row"
import WeekRow from "./components/week_row"
import MonthRow from "./components/month_row"

import colors from "./libraries/colors"
import HoursMinutesSeconds from "../shared/libraries/hours_minutes_seconds/interface"

let theme: Theme = createMuiTheme(
    {
        palette:
        {
            ...colors    
        },
    }
)
theme = responsiveFontSizes(theme)

interface Props
{
}
function ReactRoot(props: Props)
{
    const [todaysWork, setTodaysWork]             = React.useState<HoursMinutesSeconds | null>(null)
    const [dailyAverageWork, setDailyAverageWork] = React.useState<HoursMinutesSeconds | null>(null)
    const [dateToDailyWork, setDateToDailyWork]   = React.useState<{[key : string] : HoursMinutesSeconds} | null>(null)

    const [thisWeeksWork, setThisWeeksWork]                           = React.useState<HoursMinutesSeconds | null>(null)
    const [weekAverageWork, setWeekAverageWork]                       = React.useState<HoursMinutesSeconds | null>(null)
    const [weekStartDateToAverageWork, setWeekStartDateToAverageWork] = React.useState<{[key : string] : HoursMinutesSeconds} | null>(null)

    const [thisMonthsWork, setThisMonthsWork]                           = React.useState<HoursMinutesSeconds | null>(null)
    const [monthAverageWork, setMonthAverageWork]                       = React.useState<HoursMinutesSeconds | null>(null)
    const [monthStartDateToAverageWork, setMonthStartDateToAverageWork] = React.useState<{[key : string] : HoursMinutesSeconds} | null>(null)

    const hasInitialized = React.useRef<boolean>(false)
    React.useEffect(()=>
    {
        if(hasInitialized.current) return

        hasInitialized.current = true
        refreshAll()
    })

    async function refreshTodaysWork()
    {
        const response = await fetch("/api/TodaysWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setTodaysWork(await response.json() as HoursMinutesSeconds)
    }

    async function refreshDailyAverageWork()
    {
        const response = await fetch("/api/DailyAverageWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setDailyAverageWork(await response.json() as HoursMinutesSeconds)
    }

    async function refreshDateToDailyWork()
    {
        const response = await fetch("/api/AllDaysWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setDateToDailyWork(await response.json() as {[key : string] : HoursMinutesSeconds})
    }

    async function refreshThisWeeksWork()
    {
        const response = await fetch("/api/ThisWeeksWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setThisWeeksWork(await response.json() as HoursMinutesSeconds)
    }

    async function refreshWeeklyAverageWork()
    {
        const response = await fetch("/api/WeeklyAverageWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setWeekAverageWork(await response.json() as HoursMinutesSeconds)
    }

    async function refreshWeekStartDateToAverageWork()
    {
        const response = await fetch("/api/EachWeeksWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setWeekStartDateToAverageWork(await response.json() as {[key : string] : HoursMinutesSeconds})
    }

    async function refreshThisMonthsWork()
    {
        const response = await fetch("/api/ThisMonthsWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setThisMonthsWork(await response.json() as HoursMinutesSeconds)
    }

    async function refreshAverageMonthsWork()
    {
        const response = await fetch("/api/MonthlyAverageWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setMonthAverageWork(await response.json() as HoursMinutesSeconds)
    }

    async function refreshEachMonthsWork()
    {
        const response = await fetch("/api/EachMonthsWorkTime", {method: "get", headers:{"Accept": "application/json"}})
        setMonthStartDateToAverageWork(await response.json() as {[key : string] : HoursMinutesSeconds})
    }

    function refreshAll()
    {
        refreshTodaysWork()
        refreshDailyAverageWork()
        refreshDateToDailyWork()
        refreshThisWeeksWork()
        refreshWeeklyAverageWork()
        refreshWeekStartDateToAverageWork()
        refreshThisMonthsWork()
        refreshAverageMonthsWork()
        refreshEachMonthsWork()
    }

    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor="primary.main" width="100%" height="100%">
                <Grid container direction="column" justify="center" alignItems="stretch" style={{height: "100%", width: "100%"}}>
                    <Grid item style={{height: "25%", width: "100%"}}>
                        <CurrentPomodoroRow onPomodoroFinished={refreshAll}/>
                    </Grid>
                    <Grid item style={{height: "25%", width: "100%"}}>
                        {
                            todaysWork === null || dailyAverageWork === null || dateToDailyWork === null
                            ? null 
                            : <DayRow todaysWork={todaysWork} dailyAverageWork={dailyAverageWork} dateToDailyWork={dateToDailyWork}/>
                        } 
                    </Grid>
                    <Grid item style={{height: "25%", width: "100%"}}>
                        {
                            thisWeeksWork === null || weekAverageWork === null || weekStartDateToAverageWork === null
                            ? null 
                            : <WeekRow thisWeeksWork={thisWeeksWork} weekAverageWork={weekAverageWork} weekStartDateToAverageWork={weekStartDateToAverageWork}/>
                        } 
                    </Grid>
                    <Grid item style={{height: "25%", width: "100%"}}>
                        {   
                            thisMonthsWork === null || monthAverageWork === null || monthStartDateToAverageWork === null
                            ? null 
                            : <MonthRow thisMonthsWork={thisMonthsWork} monthAverageWork={monthAverageWork} monthStartDateToAverageWork={monthStartDateToAverageWork}/>
                        } 
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

ReactDOM.render(<ReactRoot></ReactRoot>, document.getElementById("react-root"))