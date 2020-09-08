import moment from 'moment'

export enum moment_date_formats {
    date_for_disply = 'MMM DD[,] YYYY',
    date_stamp_mill = 'x'
}

export const displayDateFromTimestamp = (stamp: number = return_todays_datestamp()): string => {
    return moment(stamp).format(moment_date_formats.date_for_disply)
}

export const return_yesterdays_datestamp = (): number => {
   return   +moment()
                .subtract(1, 'days')
                .format(moment_date_formats.date_stamp_mill)
}

export const return_todays_datestamp = (): number => {
    return  +moment()
                .format(moment_date_formats.date_stamp_mill)
}

export const getStampFromDate = (_date: Date): number => {
    return +moment(_date).format(moment_date_formats.date_stamp_mill)
}

export const today_vs_last_day = (): number => {
    return +moment().format('D') / +moment().endOf('month').format('D')
}