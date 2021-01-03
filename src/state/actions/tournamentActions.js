import { TournamentConstants } from '../constants';
import { Api } from '../api';

export const tournamentActions = {
    loadTournaments,
    changeActiveTournament,
    prepareGroups,
    saveGroups,
    closeRegistrations,
    openRegistrations,
    closeSetup,
    openSetup,
    draftTeams,
    draftMatches
};

function loadTournaments() {
    return dispatch => {
        dispatch(request());
        Api.getAllTournaments()
        .then(data => { console.log(data); dispatch(success(data)); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.LOAD_IN_PROGRESS } }
    function success(tournaments) { return { type: TournamentConstants.LOAD_SUCCESS, tournaments: tournaments } }
    function failure(error) { return { type: TournamentConstants.LOAD_FAILED, error: error } }
}

function changeActiveTournament(tournamentId) {
    return dispatch => {
        dispatch(change(tournamentId));
    }
    
    function change(tournamentId) { return { type: TournamentConstants.ACTIVE_TOURNAMENT_CHANGED, tournamentId } }
}

function prepareGroups(tournamentSetup) {
    return dispatch => {
        dispatch(request());
        Api.prepareGroups(tournamentSetup)
        .then(data => { console.log(data); dispatch(success(data)); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.GROUP_COMPUTE_IN_PROGRESS } }
    function success(groupPlan) { return { type: TournamentConstants.GROUP_COMPUTE_SUCCESS, groupPlan: groupPlan } }
    function failure(error) { return { type: TournamentConstants.GROUP_COMPUTE_FAILED, error: error } }
}

function saveGroups(tournamentSetup) {
    return dispatch => {
        dispatch(request());
        Api.saveGroups(tournamentSetup)
        .then(data => { console.log(data); dispatch(success(data)); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.GROUP_SAVE_IN_PROGRESS } }
    function success(groupPlan) { return { type: TournamentConstants.GROUP_SAVE_SUCCESS, groupPlan: groupPlan } }
    function failure(error) { return { type: TournamentConstants.GROUP_SAVE_FAILED, error: error } }
}

function closeRegistrations(tournamentId) {
    return dispatch => {
        dispatch(request());
        Api.closeRegistrations(tournamentId)
        .then(data => { console.log(data); dispatch(success()); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.REGISTRATION_CLOSING_IN_PROGRESS } }
    function success() { return { type: TournamentConstants.REGISTRATION_CLOSING_SUCCESS} }
    function failure(error) { return { type: TournamentConstants.REGISTRATION_CLOSING_FAILED, error: error } }
}

function openRegistrations(tournamentId) {
    return dispatch => {
        dispatch(request());
        Api.openRegistrations(tournamentId)
        .then(data => { console.log(data); dispatch(success()); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.REGISTRATION_OPENING_IN_PROGRESS } }
    function success() { return { type: TournamentConstants.REGISTRATION_OPENING_SUCCESS} }
    function failure(error) { return { type: TournamentConstants.REGISTRATION_OPENING_FAILED, error: error } }
}

function closeSetup(tournamentId) {
    return dispatch => {
        dispatch(request());
        Api.closeSetup(tournamentId)
        .then(data => { console.log(data); dispatch(success()); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.SETUP_CLOSING_IN_PROGRESS } }
    function success() { return { type: TournamentConstants.SETUP_CLOSING_SUCCESS} }
    function failure(error) { return { type: TournamentConstants.SETUP_CLOSING_FAILED, error: error } }
}

function openSetup(tournamentId) {
    return dispatch => {
        dispatch(request());
        Api.openSetup(tournamentId)
        .then(data => { console.log(data); dispatch(success()); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.SETUP_OPENING_IN_PROGRESS } }
    function success() { return { type: TournamentConstants.SETUP_OPENING_SUCCESS} }
    function failure(error) { return { type: TournamentConstants.SETUP_OPENING_FAILED, error: error } }
}

function draftTeams(tournamentId, categoriesId) {
    return dispatch => {
        dispatch(request());
        Api.draftTeams(tournamentId, categoriesId)
        .then(data => { console.log(data); dispatch(success()); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.DRAFT_TEAMS_IN_PROGRESS } }
    function success() { return { type: TournamentConstants.DRAFT_TEAMS_SUCCESS} }
    function failure(error) { return { type: TournamentConstants.DRAFT_TEAMS_FAILED, error: error } }
}

function draftMatches(tournamentId, categoriesId) {
    return dispatch => {
        dispatch(request());
        Api.draftMatches(tournamentId, categoriesId)
        .then(data => { console.log(data); dispatch(success()); })
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: TournamentConstants.DRAFT_MATCHES_IN_PROGRESS } }
    function success() { return { type: TournamentConstants.DRAFT_MATCHES_SUCCESS} }
    function failure(error) { return { type: TournamentConstants.DRAFT_MATCHES_FAILED, error: error } }
}