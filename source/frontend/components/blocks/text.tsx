import * as React from "react"
import { Typography, Box, Grid } from "@material-ui/core"

export interface Props
{
    header      : string,
    content     : string,
    width       : string,
    margin_left : string
}
export default function TextBlock(props: Props) 
{
    return (
        <Box height="100%" width={`calc(${props.width} - ${props.margin_left})`} bgcolor="primary.dark" ml={props.margin_left}>
            <Grid container direction="column" justify="flex-start" alignItems="center" style={{height: "100%", width: "100%"}}>

                <Box height="30%" pt="4px">
                    <Typography variant="h6" color="textPrimary">{props.header}</Typography>
                </Box>

                <Grid container justify="center" alignItems="center" style={{height: "35%", width: "100%"}}>
                    <Typography variant="h2" color="textPrimary">{props.content}</Typography>
                </Grid>
                
            </Grid>
        </Box>
    )
}