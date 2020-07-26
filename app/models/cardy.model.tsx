import { return_todays_date } from "../global-helper"
import { types } from "mobx-state-tree"

export interface ICardy {
    trainer: string,
    client: string,
    datePayment: string,
    dateStart: string,
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
    datePayment = return_todays_date()
    dateStart = return_todays_date()
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
    client : '',
    datePayment : return_todays_date(),
    dateStart : return_todays_date(),
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




// export const FMCardy = FirebaseModel.named("MCardy")
//   .props({
//     _path: "todos",
//     active : true,
//     trainer : '',
//     client : '',
//     datePayment : return_todays_date(),
//     dateStart : return_todays_date(),
//     type : '',
//     card_limit : '',
//     price : '',
//     rate : '',
//     whoPays : '',
//     comment : '',
//     visits : types.map(types.optional(types.string, ""))
//   })
//   .actions((self) => {
    
//     return {      
//       addItem(newItem: ICardy){
//         self.active = newItem.active,
//         self.trainer = newItem.trainer,
//         self.client = newItem.client,
//         self.datePayment = newItem.datePayment,
//         self.dateStart = newItem.dateStart,
//         self.type = newItem.type,
//         self.card_limit = newItem.card_limit,
//         self.price = newItem.price,
//         self.rate = newItem.rate,
//         self.whoPays = newItem.whoPays,
//         self.comment = newItem.comment,
//         self.visits = newItem.visits

//       }
//     };
//   });