import { types } from "mobx-state-tree"
export interface IUser {
    email: string,
    picture: string,
    generic_number: number,
    password: string,
    first: string,
    last: string,
    referral: string
    isAdmin: boolean,
    isTrainer: boolean,
    isClient: boolean
}

export class User implements IUser {
    email = ''
    picture = ''
    generic_number = 0
    password = ''
    first = ''
    last = ''
    referral = ''
    isAdmin = false
    isTrainer = false
    isClient = false
}

export const MUserItem = types.model({
    email :'',
    picture : '',
    generic_number : 0,
    password : '',
    first : '',
    last : '',
    referral : '',
    isAdmin : false,
    isTrainer : false,
    isClient : false
}
)
export const MUSer = types.model({
    id: "",
    item: MUserItem
})
