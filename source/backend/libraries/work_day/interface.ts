import WorkLog from "../../../shared/libraries/work_log/interface"

import Day from "../../../shared/libraries/day/interface"

export default interface WorkDay
{
    day      : Day,         
    date     : string, /* Format: DD/MM/YYYY */        
    workLogs : WorkLog[]
}