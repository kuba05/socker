import { CategoryConstants, GroupConstants, TeamConstants, DataState } from '../constants';

export default function groupReducer(prevState = {}, action) {
  switch(action.type) {
    case GroupConstants.LOAD_IN_PROGRESS:
      return {
        state: DataState.LOAD_IN_PROGRESS,
        data: undefined
      };
    case GroupConstants.LOAD_SUCCESS:
      return {
        state: DataState.LOAD_SUCCESS,
        data: action.groups,
      };
    case GroupConstants.LOAD_FAILED:
      return {
        state: DataState.LOAD_FAILED,
        data: null,
      };
    case GroupConstants.SAVE_SUCCESS:
      return {
        state: DataState.LOAD_SUCCESS,
        data: prevState.data,
      };
    case GroupConstants.SAVE_FAILED:
      return {
        state: DataState.SAVE_FAILED,
        data: null,
      }
    // TODO: we should fail following actions if state is not LOAD_SUCCESS
    case GroupConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,group]) => group.id !== action.id)),
      };
    case GroupConstants.UPDATE_BY_ID:
      return {
        state: prevState.state,
        data: { ...prevState.data, [action.id]: action.payload },
      };
    // cascading deletes
    case CategoryConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,group]) => group.categoryId !== action.id)),
      };
    case TeamConstants.DELETE_BY_ID:
      // removes [action.id] from each group.teams
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).map(([id, group]) => [
            id, {...group, teams: group.teams.filter((id) => id !== action.id) }])),
      }
    default: 
      return prevState;
  }
}