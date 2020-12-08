import * as React from "react"
import * as ChartJS from "chart.js"
import { Typography, Box, Grid } from "@material-ui/core"

export interface Props
{
    header      : string,
    width       : string,
    margin_left : string,
    id          : string,

    x_axis_labels : string[],
    data          : number[],
    data_label    : string
}
export default function ChartBlock(props: Props) 
{
    React.useEffect(()=>
    {
        const chartCanvas : HTMLCanvasElement = document.getElementById(props.id) as HTMLCanvasElement
        if(chartCanvas === null) throw `Failed to find daily-average-chart`

        var context : CanvasRenderingContext2D = chartCanvas.getContext('2d') as CanvasRenderingContext2D
        if(context === null) throw `Failed to get 2D context for daily-average-chart`

        chartCanvas.width  = chartCanvas.clientWidth
        chartCanvas.height = chartCanvas.clientHeight

        new ChartJS.Chart(context, {
            type: 'line',
            data: {
                labels: props.x_axis_labels,
                datasets: [{
                    label: props.data_label,
                    data: props.data,
                    borderWidth: 1,
                    backgroundColor: "cyan"
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                responsive: false
            }
        });
    }, [props.data, props.data_label, props.x_axis_labels])

    return (
        <Box height="100%" width={`calc(${props.width} - ${props.margin_left})`} bgcolor="primary.dark" ml={props.margin_left}>
            <Grid container direction="column" justify="flex-start" alignItems="center" style={{height: "100%", width: "100%"}}>

                <Box height="15%" pt="4px">
                    <Typography variant="h6" color="textPrimary">{props.header}</Typography>
                </Box>

                <Grid container justify="center" alignItems="center" style={{height: "85%", width: "100%"}}>
                    <canvas id={props.id} style={{width: "100%", height: "100%"}}></canvas>
                </Grid>
                
            </Grid>
        </Box>
    )
}