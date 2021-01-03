export function authHeader(headers) {
    // return authorization header with jwt token
    const token = JSON.parse(localStorage.getItem('token'));

    //console.log(token);
    if (token && token.access_token) {
        return new Headers({ 'Authorization': 'Bearer ' + token.access_token, ...headers});
    } else {
        return {...headers};
    }
}