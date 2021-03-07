import moment from "moment"

export enum moment_date_formats {
  date_for_display = "MMM DD[,] YYYY",
  date_stamp_mill = "x",
}

export const displayDateFromTimestamp = (stamp: number = return_todays_datestamp()): string => {
  return moment(stamp).format(moment_date_formats.date_for_display)
}

export const return_yesterdays_datestamp = (): number => {
  return +moment()
    .subtract(1, "days")
    .format(moment_date_formats.date_stamp_mill)
}

export const return_todays_datestamp = (): number => {
  return +moment().format(moment_date_formats.date_stamp_mill)
}

export const getStampFromDate = (_date: Date): number => {
  return +moment(_date).format(moment_date_formats.date_stamp_mill)
}

export const today_vs_last_day = (): number => {
  return (
    +moment().format("D") /
    +moment()
      .endOf("month")
      .format("D")
  )
}

export const displayDateFromTimestamp2 = (stamp: number = return_todays_datestamp()): string => {
  return moment(stamp).format("DD MMM")
}

export const displayDateFromTimestampFullMonth = (
  stamp: number = return_todays_datestamp(),
): string => {
  return moment(stamp).format("DD MMMM")
}

export const return_timeStamp_x_days_ago = (number: number = return_todays_datestamp()) => {
  return +moment()
    .subtract(number, "days")
    .format(moment_date_formats.date_stamp_mill)
}

export const subtractDaysFromDateStamp = (dateStamp: number, substractDays: number) => {
  return +moment(moment(dateStamp).toDate())
    .subtract(substractDays, "days")
    .format(moment_date_formats.date_stamp_mill)
}

export const addDaysFromDateStamp = (dateStamp: number, substractDays: number) => {
  return +moment(moment(dateStamp).toDate())
    .add(substractDays, "days")
    .format(moment_date_formats.date_stamp_mill)
}
