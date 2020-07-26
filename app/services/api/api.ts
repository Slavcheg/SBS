import { ApisauceInstance, create, ApiResponse } from "apisauce"
import { getGeneralApiProblem } from "./api-problem"
import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import * as Types from "./api.types"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * The underlying apisauce instance which performs the requests.
   */
  apisauce: ApisauceInstance

  /**
   * Configurable options.
   */
  config: ApiConfig

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
      },
    })
  }

// Start of Strong by science API calls

async postSendEmail(sentFrom: string, emailContent: string) {
  const body = `{
    "from":{
      "email": "slavcheg@uni.coventry.ac.uk"
    },
    "personalizations": [{
      "to": [{
        "email": "strongbysciencebulgaria@gmail.com"
      }],
      "dynamic_template_data": {
        "fromEmail": "${sentFrom}",
        "body": "${emailContent}"
      }
    }],
    "template_id": "d-a68b97c564864d2aa0075a7da87a170d"
  }`
  const response = await this.apisauce.post("/SendEmail", body)
  // const response = await this.apisauce.get("/Ping")
  return response.ok
}

async getPing() {
  const response = await this.apisauce.get("/Ping")
  return response;
}

async postCreateUser(email, password) {
  const response = await this.apisauce.post("/CreateUser",
    `{"email": "${email}", "password": "${password}"}`)
  return response;
}

async postSignInUser(email, password) {
  const response = await this.apisauce.post("/SignInUser",
    `{"email": "${email}", "password": "${password}"}`)
  return response;
}

async postSendResetPasswordEmail(email) {
  const response = await this.apisauce.post("/SendResetPasswordEmail",
    `{"email": "${email}"}`)
  return response;
}

async postAddItem(collection, item) {
  const response = await this.apisauce.post("/fbAddItem",
    `{"collection": "${collection}", "item": ${item}}`)
  return response;
}

async postGetAllItems(collection) {
  const response = await this.apisauce.post("/fbGetItems",
    `{"collection": "${collection}"}`)
  return response;
}

async postGetConditionalItems(collection, field, condition, value) {
  const response = await this.apisauce.post("/fbGetConditionalItems",
    `{
      "collection": "${collection}",
      "field": "${field}",
      "condition": "${condition}",
      "value": "${value}"
    }`)
  return response;
}

async postDeleteItem(collection, itemId) {
  const response = await this.apisauce.post("/fbDeleteItem",
    `{
      "collection": "${collection}",
      "itemId": "${itemId}"
    }`)
  return response;
}

async postUpdateItem(collection, itemId, item) {
  const response = await this.apisauce.post("/fbUpdateItem",
    `{
      "collection": "${collection}",
      "itemId": "${itemId}",
      "item": ${item}
    }`)
  return response;
}

// End of Strong by science API calls


  /**
   * Gets a list of users.
   */
  async getUsers(): Promise<Types.GetUsersResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    const convertUser = raw => {
      return {
        id: raw.id,
        name: raw.name,
      }
    }

    // transform the data into the format we are expecting
    try {
      const rawUsers = response.data
      const resultUsers: Types.User[] = rawUsers.map(convertUser)
      return { kind: "ok", users: resultUsers }
    } catch {
      return { kind: "bad-data" }
    }
  }

  /**
   * Gets a single user by ID
   */

  async getUser(id: string): Promise<Types.GetUserResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/users/${id}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultUser: Types.User = {
        id: response.data.id,
        name: response.data.name,
      }
      return { kind: "ok", user: resultUser }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
