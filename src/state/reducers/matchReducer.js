import { CategoryConstants, GroupConstants, TeamConstants, MatchConstants, DataState } from '../constants';

export default function matchReducer(prevState = {}, action) {
  switch(action.type) {
    case MatchConstants.LOAD_IN_PROGRESS:
      return {
        state: DataState.LOAD_IN_PROGRESS,
        data: undefined
      };
    case MatchConstants.LOAD_SUCCESS:
      return {
        state: DataState.LOAD_SUCCESS,
        data: action.matches,
      };
    case MatchConstants.LOAD_FAILED:
      return {
        state: DataState.LOAD_FAILED,
        data: null,
      };
    // TODO: we should fail following actions if state is not LOAD_SUCCESS    
    case MatchConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,match]) => match.id !== action.id)),
      };
    case MatchConstants.UPDATE_BY_ID:
      return {
        state: prevState.state,
        data: { ...prevState.data, [action.id]: action.payload },
      };  
    case MatchConstants.UPDATE_IN_PROGRESS:
      return {
        state: prevState.state,
        data: { ...prevState.data, [action.id]: { ...prevState.data[action.id], updateInProgress: true } },
      };  
    // cascading deletes
    case CategoryConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,match]) => match.categoryId !== action.id)),
      };
    case GroupConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,match]) => match.groupId !== action.id)),
      };
    case TeamConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,match]) => (match.teamA !== action.id && match.teamB !== action.id))),
      };
    default: 
      return prevState;
  }
}