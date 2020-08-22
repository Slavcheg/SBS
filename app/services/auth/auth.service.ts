import { Api } from '../api';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

export function googleInitialize() {
    GoogleSignin.configure({
        iosClientId: '1077690630800-bt3cqrn85q5g37datesf286mkuc37m78.apps.googleusercontent.com',
        webClientId: '1077690630800-4kbqjgj1fluvbsu111sa57dp17kdnedb.apps.googleusercontent.com',
        offlineAccess: false
    });
}

export async function onGoogleButtonPress(showLoader) {
    
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();
  
    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    showLoader()
    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

let user = {
    email: '',
    role: '',
    logged: false
}

export async function getAccessToken():Promise<String>{
    const {accessToken} = await GoogleSignin.getTokens();
    return accessToken;
}

export class Auth {
    user$: Promise<{}>;
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