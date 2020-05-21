import { Api } from '../api';

let user = {
    email: '',
    role: '',
    logged: false
}

export class Auth {
    static login(u) {
        user.email = u;
        user.logged = true;

        const API = new Api()
        API.setup();
        API.postGetConditionalItems('users', 'email', '==', user.email)
        .then((res: any) => {
            // console.log(res.data.data[0])
            user.role = res.data.data[0].item.role
        })
    }

    static isLogged() {
        return user.logged;
    }

    static getUserEmail() {
        return user.email
    }

    static getUserRole() {
        return user.role
    }

    static logOut() {
        user.email = '';
        user.logged = false;
    }
}