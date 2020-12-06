import * as React from "react"
import { Card, CardContent, Typography, CardActions, Button, makeStyles, Box, Grid } from "@material-ui/core"
import { PlayArrow, Pause } from "@material-ui/icons"

import DailyAverageChart from "./daily_average_chart"


export default function DayRow() 
{
return (
        <Box height="calc(100% - 4px)" width="calc(100% - 4px * 2)" m="4px" mt="0px">

            <Grid container direction="row" justify="center" style={{height: "100%", width: "100%"}}>
                
                {/* Today */}
                <Box height="100%" width="25%" bgcolor="primary.dark">
                    <Grid container direction="column" justify="flex-start" alignItems="center" style={{height: "100%", width: "100%"}}>

                        <Box height="30%" pt="4px">
                            <Typography variant="h6" color="textPrimary">{"Today"}</Typography>
                        </Box>

                        <Grid container justify="center" alignItems="center" style={{height: "35%", width: "100%"}}>
                            <Box>
                                <Typography variant="h2" color="textPrimary">{4}</Typography>
                            </Box>
                        </Grid>
                        
                    </Grid>
                </Box>

                {/* Daily Average */}
                <Box height="100%" width="calc(25% - 2px)" bgcolor="primary.dark" ml="2px">
                    <Grid container direction="column" justify="flex-start" alignItems="center" style={{height: "100%", width: "100%"}}>

                        <Box height="30%" pt="4px">
                            <Typography variant="h6" color="textPrimary">{"Daily Average (Monday)"}</Typography>
                        </Box>

                        <Grid container justify="center" alignItems="center" style={{height: "35%", width: "100%"}}>
                            <Box>
                                <Typography variant="h2" color="textPrimary">{4}</Typography>
                            </Box>
                        </Grid>
                        
                    </Grid>
                </Box>

                {/* Daily Average Graph */}
                <Box height="100%" width="calc(50% - 2px)" bgcolor="primary.dark" ml="2px">
                    <Grid container direction="column" justify="flex-start" alignItems="center" style={{height: "100%", width: "100%"}}>

                        <Box height="30%" pt="4px">
                            <Typography variant="h6" color="textPrimary">{"Daily Average (Monday)"}</Typography>
                        </Box>

                        <Grid container justify="center" alignItems="center" style={{height: "70%", width: "100%"}}>
                            <DailyAverageChart/>
                        </Grid>
                        
                    </Grid>
                </Box>
                
            </Grid>
        </Box>
);
}