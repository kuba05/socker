import { TournamentConstants, DataState } from '../constants';

export default function groupPlanReducer(prevState = {}, action) {
  switch(action.type) {
    case TournamentConstants.GROUP_COMPUTE_IN_PROGRESS:
      return {
        state: DataState.LOAD_IN_PROGRESS,
        data: undefined
      };
    case TournamentConstants.GROUP_COMPUTE_SUCCESS:
      return {
        state: DataState.LOAD_SUCCESS,
        data: action.groupPlan,
      };
    case TournamentConstants.GROUP_COMPUTE_FAILED:
      return {
        state: DataState.LOAD_FAILED,
        data: null,
      };
            
    default: 
      return prevState;
  }
}