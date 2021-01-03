import { MatchConstants } from '../constants';
import { Api } from '../api';

export const matchActions = {
    loadMatches,
    startMatch,
    finishMatch,
    scoreGoalA,
    scoreGoalB,
};

function loadMatches() {
    return dispatch => {
        dispatch(request());
        Api.getAllMatches()
        .then(data => dispatch(success(data)))
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: MatchConstants.LOAD_IN_PROGRESS } }
    function success(matches) { return { type: MatchConstants.LOAD_SUCCESS, matches: matches } }
    function failure(error) { return { type: MatchConstants.LOAD_FAILED, error: error } }
}

function updateInProgress(matchId) { return { type: MatchConstants.UPDATE_IN_PROGRESS, id: matchId } }

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function startMatch(matchId) {
    return dispatch => {
        dispatch(updateInProgress(matchId));
        sleep(50).then(() =>
          Api.startMatch(matchId)
          .then(data => console.log("started"))
          .catch(error => console.log(error))
        )
    }
}

function finishMatch(matchId) {
    return dispatch => {
        dispatch(updateInProgress(matchId));
        sleep(50).then(() =>
          Api.finishMatch(matchId)
          .then(data => console.log("finished"))
          .catch(error => console.log(error))
        )
    }
}

function scoreGoalA(matchId) {
    return dispatch => {
        dispatch(updateInProgress(matchId));
        sleep(50).then(() =>
          Api.scoreGoalA(matchId)
          .then(data => console.log("scoredA"))
          .catch(error => console.log(error))
        )
    }
}

function scoreGoalB(matchId) {
    return dispatch => {
        dispatch(updateInProgress(matchId));
        sleep(50).then(() =>
          Api.scoreGoalB(matchId)
          .then(data => console.log("scoredB"))
          .catch(error => console.log(error))
        )
    }
}
