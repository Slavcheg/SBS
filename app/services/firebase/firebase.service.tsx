import { Api } from "../api"
import { ICardy } from "../../models"

export const fbAddCard = (cardy: ICardy) => {
    const API = new Api()
    API.setup()
    API.postAddItem('cards', JSON.stringify(cardy))
        .then((res: any) => {
        //    console.log(res.data)
    })
}

export const fbUpdateCard = (id: string, cardy: ICardy) => {
    const API = new Api()
    API.setup()
    API.postUpdateItem('cards', id, JSON.stringify(cardy))
        .then((res: any) => {
        //    console.log(res)
    })
}