/* 
    Responsibility
        Produces a string in the format of DD/MM/YYYY.
*/
export default function queryDateAsString(date: Date) : string
{
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}