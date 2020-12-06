import WorkLog from "./work_log"

export default interface WorkDay
{
    date: string,
    workLogs: WorkLog[]
}