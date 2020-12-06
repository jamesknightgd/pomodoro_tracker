import * as React from "react"
import { Card, CardContent, Typography, CardActions, Button, makeStyles, Box, Grid } from "@material-ui/core"
import { PlayArrow, Pause } from "@material-ui/icons"
import * as ChartJS from "chart.js"


export default function DailyAverageChart() 
{
    React.useEffect(()=>
    {
        const chartCanvas : HTMLCanvasElement = document.getElementById('daily-average-chart') as HTMLCanvasElement
        if(chartCanvas === null) throw `Failed to find daily-average-chart`

        var context : CanvasRenderingContext2D = chartCanvas.getContext('2d') as CanvasRenderingContext2D
        if(context === null) throw `Failed to get 2D context for daily-average-chart`

        chartCanvas.width  = chartCanvas.clientWidth
        chartCanvas.height = chartCanvas.clientHeight

        var myChart = new ChartJS.Chart(context, {
            type: 'line',
            data: {
                labels: [`12/12/2020`, `13/12/2020`, `14/12/2020`, `15/12/2020`, `16/12/2020`, `17/12/2020`, `18/12/2020`, `19/12/2020`, `20/12/2020`, `21/12/2020`, `22/12/2020`],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3, 4, 10, 21, 30, 19],
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
    })

return (
    <canvas id="daily-average-chart" style={{width: "100%", height: "100%"}}></canvas>
)
}