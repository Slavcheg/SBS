export type T_client_short = {
  Name: string
  FamilyName: string
  ClientNumber: number
  ID: string
}

export type T_trainer_short = {
  Name: string
  ID: string
}

export type T_client_full = {
  ID: string
  Name: string
  FamilyName: string
  ClientNumber: number
  email: string
  isClient: boolean
  isTrainer: boolean
  Clients: T_client_short[]
  Trainers?: T_trainer_short[]
  userDiary: any
}
