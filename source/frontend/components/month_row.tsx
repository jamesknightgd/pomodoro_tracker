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
    thisMonthsWork              : HoursMinutesSeconds,
    monthAverageWork            : HoursMinutesSeconds,
    monthStartDateToAverageWork : {[key : string] : HoursMinutesSeconds}
}
export default function MonthRow(props: Props) 
{
return (
    <BlockRow margin="6px" margin_top="0px">
        {/* This Month */}
        <TextBlock width="25%" margin_left="0px" header="This Month" content={`${props.thisMonthsWork.hours}h ${props.thisMonthsWork.minutes}m`}/>

        {/* Monthly Average */}
        <TextBlock width="25%" margin_left="2px" header={`Monthly Average`} content={`${props.monthAverageWork.hours}h ${props.monthAverageWork.minutes}m`}/>

        {/* Monthly Average Graph */}
        <ChartBlock 
            width="50%" margin_left="2px" header={`Monthly Average`} id="monthly-average-chart"
            x_axis_labels={Object.keys(props.monthStartDateToAverageWork)}
            data={Object.values(props.monthStartDateToAverageWork).map(hms => hms.hours)}
            data_label="hours"
        />
    </BlockRow>
);
}