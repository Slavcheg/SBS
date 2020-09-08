import { return_todays_datestamp } from "../global-helper"
import { types } from "mobx-state-tree"

export interface ICardy {
    trainer: string,
    client: string,
    datestampPayment: number,
    datestampStart: number,
    type: string,
    card_limit: string,
    price: string,
    realPrice: string,
    rate: string,
    whoPays: string,
    comment: string,
    visits: any,
    active?: boolean
}
export class Cardy implements ICardy {  
    active? = true
    trainer = ''
    client = ''
    datestampPayment = return_todays_datestamp()
    datestampStart = return_todays_datestamp()
    type = ''
    card_limit = ''
    price = ''
    realPrice: ''
    rate = ''
    whoPays = ''
    comment = ''
    visits = []
}


export const MCardItem = types.model({
    active : true,
    trainer : '',
    trainers: types.optional(types.array(types.string), []),
    client : '',
    clients: types.optional(types.array(types.string), []),
    datePayment : return_todays_datestamp(),
    dateStart : return_todays_datestamp(),
    type : '',
    card_limit : '',
    price : '',
    realPrice: '',
    rate : '',
    whoPays : '',
    comment : '',
    visits : types.optional(types.array(types.string), []),
})

export const MCardy = types.model({
    id: "",
    item: MCardItem
})
