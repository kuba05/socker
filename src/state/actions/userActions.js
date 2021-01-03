import { userConstants } from '../constants';
import { userService } from '../api';
import { alertActions } from './';                     
import { categoryActions, gradeActions, teamActions, groupActions, matchActions, tournamentActions, registrationActions } from '../';
//import { history } from '../helpers';

export const userActions = {
    login,
    logout,
    refreshToken,
};

function login(username, password, history) {
    return dispatch => {
        dispatch(_request({ username }));
        userService.login(username, password)
            .then(
                user => {   
                    dispatch(_success(user));
                    history.go(-1);
                    const expiresInSec = user.exp - user.iat;
                    const refreshInMs = Math.min(60000, expiresInSec * 2000 / 3);
                    console.log("refreshing token in " + (refreshInMs/1000) + " sec");
                    //TODO: make this a function/action    
                    dispatch(categoryActions.loadCategories());
                    dispatch(teamActions.loadTeams());
                    dispatch(groupActions.loadGroups());
                    dispatch(matchActions.loadMatches());
                    dispatch(gradeActions.loadGrades());
                    dispatch(tournamentActions.loadTournaments());
                    setTimeout(() => dispatch(refreshToken()), refreshInMs);
                },
                error => {
                    dispatch(_failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };


}

function refreshToken() {
    console.log("refreshToken");
    return dispatch => {
        userService.refreshToken()
            .then(
                user => {   
                    dispatch(_success(user));
                    const expiresInSec = user.exp - user.iat;
                    const refreshInMs = Math.min(60000, expiresInSec * 2000 / 3);
                    console.log("refreshing token in " + (refreshInMs/1000) + " sec")
                    setTimeout(() => dispatch(refreshToken()), refreshInMs);
                },
                error => {
                    dispatch(_failure(error));
                    dispatch(alertActions.error(error));
                }
            );        
    }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function _request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
function _success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
function _failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }