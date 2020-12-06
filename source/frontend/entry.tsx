import * as React from "react"
import * as ReactDOM from "react-dom"
import { createMuiTheme, ThemeProvider, Theme, Grid, responsiveFontSizes, Box } from "@material-ui/core"
import ScopedCSSBaseline from "@material-ui/core/ScopedCssBaseline"

import CurrentPomodoroRow from "./components/current_pomodoro_row"
import DayRow from "./components/day_row"

import colors from "./libraries/colors"

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
    return (
        <ThemeProvider theme={theme}>
            <Box bgcolor="primary.main" width="100%" height="100%">
                <Grid container direction="column" justify="center" alignItems="stretch" style={{height: "100%", width: "100%"}}>
                    <Grid item style={{height: "25%", width: "100%"}}>
                        <CurrentPomodoroRow/>
                    </Grid>
                    <Grid item style={{height: "25%", width: "100%"}}>
                        <DayRow/>
                    </Grid>
                    <Grid item style={{height: "25%", width: "100%"}}>
                    </Grid>
                    <Grid item style={{height: "25%", width: "100%"}}>
                    </Grid>
                </Grid>
            </Box>
        </ThemeProvider>
    )
}

ReactDOM.render(<ReactRoot></ReactRoot>, document.getElementById("react-root"))