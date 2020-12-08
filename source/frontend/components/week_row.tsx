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
    thisWeeksWork              : HoursMinutesSeconds,
    weekAverageWork            : HoursMinutesSeconds,
    weekStartDateToAverageWork : {[key : string] : HoursMinutesSeconds}
}
export default function WeekRow(props: Props) 
{
return (
    <BlockRow margin="6px" margin_top="0px">
        {/* This Week */}
        <TextBlock width="25%" margin_left="0px" header="This Week" content={`${props.thisWeeksWork.hours}h ${props.thisWeeksWork.minutes}m`}/>

        {/* Weekly Average */}
        <TextBlock width="25%" margin_left="2px" header={`Weekly Average`} content={`${props.weekAverageWork.hours}h ${props.weekAverageWork.minutes}m`}/>

        {/* Weekly Average Graph */}
        <ChartBlock 
            width="50%" margin_left="2px" header={`Weekly Average`} id="weekly-average-chart"
            x_axis_labels={Object.keys(props.weekStartDateToAverageWork)}
            data={Object.values(props.weekStartDateToAverageWork).map(hms => hms.hours)}
            data_label="hours"
        />
    </BlockRow>
);
}