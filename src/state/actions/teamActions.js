import { TeamConstants } from '../constants';
import { Api } from '../api';

export const teamActions = {
    loadTeams,
    deleteAllTeams
};

function loadTeams() {
    return dispatch => {
        dispatch(request());
        Api.getAllTeams()
        .then(teams => dispatch(success(teams)))
        .catch(error => dispatch(failure(error)));
    }
    
    function request() { return { type: TeamConstants.LOAD_IN_PROGRESS } }
    function success(teams) { return { type: TeamConstants.LOAD_SUCCESS, teams: teams } }
    function failure(error) { return { type: TeamConstants.LOAD_FAILED, error: error } }
}

function deleteAllTeams(){
    return dispatch => {
        // FIXME: use teams from store instead
        Api.getAllTeams()
        .then(
            data => {
                Object.keys(data).forEach(teamId => Api.deleteTeam(teamId)
                    .then(
                        team => dispatch(success(team))
                    )
                    .catch(error => dispatch(failure(error)))
                )
           }
        ).catch(error => dispatch(failure(error)))
    }
    
//    function request() { return { type: TeamConstants.SAVE_IN_PROGRESS } }
    function success(team) { return { type: TeamConstants.SAVE_SUCCESS, team: team } }
    function failure(error) { return { type: TeamConstants.SAVE_FAILED, error: error } }
}