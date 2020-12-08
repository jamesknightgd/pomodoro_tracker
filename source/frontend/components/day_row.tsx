import * as React from "react"
import { Card, CardContent, Typography, CardActions, Button, makeStyles, Box, Grid } from "@material-ui/core"
import { PlayArrow, Pause } from "@material-ui/icons"

//import {BlockRow, TextBlock, ChartBlock} from "./../components/blocks"

import BlockRow from "./../components/blocks/row"
import TextBlock from "./../components/blocks/text"
import ChartBlock from "./../components/blocks/chart"

import HoursMinutesSeconds from "../../shared/libraries/hours_minutes_seconds/interface"

import cDayString from "../../shared/libraries/day/compute/from_todays_date"

export interface Props
{
    todaysWork        : HoursMinutesSeconds,
    dailyAverageWork  : HoursMinutesSeconds,
    dateToDailyWork   : {[key : string] : HoursMinutesSeconds}
}
export default function DayRow(props: Props) 
{
return (
    <BlockRow margin="6px" margin_top="0px">
        {/* Today */}
        <TextBlock width="25%" margin_left="0px" header="Today" content={`${props.todaysWork.hours}h ${props.todaysWork.minutes}m`}/>

        {/* Daily Average */}
        <TextBlock width="25%" margin_left="2px" header={`Daily Average ${cDayString()}`} content={`${props.dailyAverageWork.hours}h ${props.dailyAverageWork.minutes}m`}/>

        {/* Daily Average Graph */}
        <ChartBlock 
            width="50%" margin_left="2px" header={`Daily Average ${cDayString()}`} id="daily-average-chart"
            x_axis_labels={Object.keys(props.dateToDailyWork)}
            data={Object.values(props.dateToDailyWork).map(hms => hms.hours)}
            data_label="hours"
        />
    </BlockRow>
);
}