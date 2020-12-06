export default interface WorkLog
{
    type: number,   /* Reference of a type of work, from work_types.json */
    seconds: number /* How many seconds were recorded in the work log */
}