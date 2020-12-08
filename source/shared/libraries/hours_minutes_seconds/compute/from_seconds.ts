import HoursMinutesSeconds from "../interface"

export default function computeHoursMinutesSecondsFromSeconds(totalSeconds: number) : HoursMinutesSeconds
{
    const totalMinutes : number = Math.floor( totalSeconds / 60 )

    const hours   : number = Math.floor( totalMinutes / 60 )
    const minutes : number = totalMinutes - (hours * 60)
    const seconds : number = Math.floor( totalSeconds % 60 )

    return {hours, minutes, seconds}
}