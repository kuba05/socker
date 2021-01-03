// import config from 'config';
import { decodeToken } from '../helpers';

export const userService = {
    login,
    logout,
    refreshToken,
};

const realm = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 
process.env.REACT_APP_KEYCLOAK_REALM : 
window.location.hostname.split('.', 1)[0];
const config = {
    client_id: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
    tokenUrl: `${process.env.REACT_APP_KEYCLOAK_URL}/realms/${realm}/protocol/openid-connect/token`
};
    
function login(username, password) {
    const params = {
        client_id: config.client_id, 
        username: username, 
        password: password, 
        grant_type:'password'
    };
    
    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const requestOptions = {
        method: 'POST',
        mode : 'cors',
        headers: {
           //  'Access-Control-Allow-Origin': 'http://localhost:3000', 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': process.env.REACT_APP_AUTH_URL, // 'http://192.168.3.109:8080/', 
        },
        body: formBody
    };

    return fetch(config.tokenUrl, requestOptions)
        .then(handleResponse)
        .then(token => {
            //console.log("got data:");
            // console.log(token);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('token', JSON.stringify(token));
            // token.expires_in = user.exp - user.iat = 300
            return decodeToken(token.access_token);
        });
}


function refreshToken() {
    // do not refresh token, if user had logged out already
    if (!localStorage.getItem('token')) return Promise.reject("refusing to refresh token for logged out user");
    
    const token = JSON.parse(localStorage.getItem('token'));
//    console.log(token);
//    console.log(token.refresh_token);
    const params = {
        client_id: config.client_id, 
        refresh_token: token.refresh_token, 
        grant_type:'refresh_token'
    };
    
    var formBody = [];
    for (var property in params) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(params[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const requestOptions = {
        method: 'POST',
        mode : 'cors',
        headers: {
           //  'Access-Control-Allow-Origin': 'http://localhost:3000', 
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': process.env.REACT_APP_AUTH_URL, // 'http://192.168.3.109:8080/', 
        },
        body: formBody
    };

    return fetch(config.tokenUrl, requestOptions)
        .then(handleResponse)
        .then(token => {
            localStorage.setItem('token', JSON.stringify(token));

            return decodeToken(token.access_token);
        });
}


function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('token');
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
//        console.log("got response:");
//        console.log(response.status);
//        console.log(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
//                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}
