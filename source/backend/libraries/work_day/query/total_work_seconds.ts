/*
    Responsibility
        Computes the total work seconds for the provided work day.

    Output
        number : the number of work seconds for the provided work day.
*/

import WorkDay from "./../interface"

export default function computeTotalWorkDaySeconds(workDay: WorkDay) : number
{
    let totalSecondsWorkedInDay : number = 0
    for(const workLog of workDay.workLogs)
    {
        totalSecondsWorkedInDay += workLog.seconds
    }

    return totalSecondsWorkedInDay
}