import * as React from "react"
import { Card, CardContent, Typography, CardActions, Button, makeStyles, Box, Grid } from "@material-ui/core"
import { PlayArrow, Pause } from "@material-ui/icons"

export interface Props
{
    children: any,
    margin_top: string,
    margin: string
}
export default function BlockRow(props: Props) 
{
return (
        <Box height={`calc(100% - ${props.margin} - ${props.margin_top})`} width={`calc(100% - ${props.margin} * 2)`} m={props.margin} mt={props.margin_top}>

            <Grid container direction="row" justify="center" style={{height: "100%", width: "100%"}}>
                
                {...props.children}
                
            </Grid>
        </Box>
);
}