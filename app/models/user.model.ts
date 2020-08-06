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
    isClient: boolean,
    diary: any
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
    diary = []
}

export const diaryItems = types.model({
    date: '',
    weight: 0,
    calories: 0,
    protein: 0
})

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
    isClient : false,
    diary : types.optional(types.array(types.string), []),
}
)
export const MUSer = types.model({
    id: "",
    item: MUserItem
})
