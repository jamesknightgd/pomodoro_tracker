import Day from "../interface"

import cDayStringFromNumber from "./from_number"

export default function computeDayStringFromNumber(): Day
{
    const date = new Date()
    return cDayStringFromNumber(date.getDay())
}