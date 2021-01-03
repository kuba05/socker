import { userConstants } from '../constants';
import { decodeToken } from '../helpers'; 

const token = JSON.parse(localStorage.getItem('token'));
const initialState = token ? { loggedIn: true, user: decodeToken(token.access_token) } : {};

export default function authentication(state = initialState, action) {
    switch (action.type) {
    case userConstants.LOGIN_REQUEST:
        return {
        loggingIn: true,
        user: action.user
        };
    case userConstants.LOGIN_SUCCESS:
        return {
        loggedIn: true,
        user: action.user
        };
    case userConstants.LOGIN_FAILURE:
        return {};
    case userConstants.LOGOUT:
        return {};
    default:
        return state
    }
}