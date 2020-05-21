export const return_yesterdays_date = () => {
    const yesterday = new Date();
    // v 'getDate - 1' covers 01 to go to 30 or 31
    yesterday.setDate(yesterday.getDate()-1)
    return return_date_formated(yesterday)
} 

export const return_todays_date = () => {
    return return_date_formated(new Date())
}

    // current formt is
    // Apr-1-2020
export const return_date_formated = (date: Date): string => {
    return return_month_as_text_from_number(date.getMonth()) + '-' + date.getDate() + '-' + date.getFullYear()
}

export const today_vs_last_day = () => {
    return new Date().getDate() / return_last_day_of_month_number()
}

export const return_last_day_of_month_number = () => {
    const today = new Date();

    return new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
}

    // 0 -> Jan, 1 -> Feb
const return_month_as_text_from_number = (numbers) => {
    // console.log(numbers)
        switch(numbers) {
            case 0 : {
                return 'Jan'
            }
            case 1 : {
                return 'Feb'
            }
            case 2 : {
                return 'Mar'
            }
            case 3 : {
                return 'Apr'
            }
            case 4 : {
                return 'May'
            }
            case 5 : {
                return 'Jun'
            }
            case 6 : {
                return 'Jul'
            }
            case 7 : {
                return 'Aug'
            }
            case 8 : {
                return 'Sep'
            }
            case 9 : {
                return 'Oct'
            }
            case 10 : {
                return 'Nov'
            }
            case 11 : {
                return 'Dec'
            }
            default : {
                return 'NaN'
            }
        }
    }