import { return_todays_date } from "../global-helper"

export interface ICardy {
    trainer: string,
    client: string,
    datePayment: string,
    dateStart: string,
    type: string,
    card_limit: string,
    price: string,
    rate: string,
    whoPays: string,
    comment: string,
    visits: string[]
    active?: boolean
}

export class Cardy implements ICardy {  
    active? = true
    trainer = ''
    client = ''
    datePayment = return_todays_date()
    dateStart = return_todays_date()
    type = ''
    card_limit = ''
    price = ''
    rate = ''
    whoPays = ''
    comment = ''
    visits = []    
}