// reducers/index.js
import {combineReducers} from 'redux';
import alerts from './alertReducer';
import authentication from './authenticationReducer';
import categories from './categoryReducer';
import grades from './gradeReducer';
import groups from './groupReducer';
import teams from './teamReducer';
import matches from './matchReducer';
import tournaments from './tournamentReducer';
import groupPlanOffer from './groupPlanReducer';
// import registrations from './registrationReducer';
import { CategoryConstants, GradeConstants, TeamConstants, RegistrationConstants, DataState } from '../constants';
import { registrationReducer, registrationReducerCompute } from './registrationReducer'; 

const combinedReducer = combineReducers({
  // short hand property names
  alerts,
  authentication,
  categories,
  grades,
  groups,
  teams,
  matches,
  tournaments,
  registrations: registrationReducer,
  groupPlanOffer,
});

function beforeActionReducer(state, action) {
  switch (action.type) {
    case TeamConstants.UPDATE_BY_ID: {
console.log(action);    
        const team = action.payload; // state.teams.data[action.id];
        return {
           ...state,
           registrations: registrationReducer(state.registrations, {type: RegistrationConstants.SERVER_UPDATE, ...team, registered: true}),
        }    
    }

    case TeamConstants.DELETE_BY_ID: {
        const team = state.teams.data[action.id];
        return {
           ...state,
           registrations: registrationReducer(state.registrations, {type: RegistrationConstants.SERVER_UPDATE, ...team, id: -1, registered: false}),
        }    
    }
    
    default:
      return state
  }
}


function afterActionReducer(state, action) {
  switch (action.type) {
    case CategoryConstants.LOAD_SUCCESS:
    case GradeConstants.LOAD_SUCCESS:
    case TeamConstants.LOAD_SUCCESS:
        if (DataState.LOAD_SUCCESS === state.categories.state
            && DataState.LOAD_SUCCESS === state.grades.state
            && DataState.LOAD_SUCCESS === state.teams.state) {
        return {
           ...state,
           registrations: registrationReducerCompute(state.registrations, {type: RegistrationConstants.LOAD_SUCCESS}, state.categories.data, state.grades.data, state.teams.data),
        }    
    }
    // eslint-disable-next-line
    case CategoryConstants.LOAD_IN_PROGRESS: 
    case GradeConstants.LOAD_IN_PROGRESS:
    case TeamConstants.LOAD_IN_PROGRESS:
        return {
           ...state,
           registrations: { state: DataState.LOAD_IN_PROGRESS }
        }

    case CategoryConstants.LOAD_FAILED: 
    case GradeConstants.LOAD_FAILED:
    case TeamConstants.LOAD_FAILED:
        return {
           ...state,
           registrations: { state: DataState.LOAD_FAILED }
        }

    default:
      return state
  }
}

function rootReducer(state, action) {
  const initalState = beforeActionReducer(state, action)
console.log(initalState);  
  const intermediateState = combinedReducer(initalState, action)
  const finalState = afterActionReducer(intermediateState, action)
  return finalState
} 

export default rootReducer;
