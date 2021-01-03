import { CategoryConstants, TeamConstants, DataState } from '../constants';

export default function teamReducer(prevState = {}, action) {
  switch(action.type) {
    case TeamConstants.LOAD_IN_PROGRESS:
      return {
        state: DataState.LOAD_IN_PROGRESS,
        data: undefined,
      };
    case TeamConstants.LOAD_SUCCESS: {
      return {
        state: DataState.LOAD_SUCCESS,
        data: action.teams,
      };
    }
    case TeamConstants.LOAD_FAILED:
      return {
        state: DataState.LOAD_FAILED,
        data: null,
      };  
// TODO: we should fail following actions if state is not LOAD_SUCCESS      
    case TeamConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,team]) => team.id !== action.id)),
      };
    case TeamConstants.UPDATE_BY_ID:
      return {
        state: prevState.state,
        data: { ...prevState.data, [action.id]: action.payload },
      }    
    case CategoryConstants.DELETE_BY_ID: // cascading delete
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,team]) => team.categoryId !== action.id)),
      };
    default: 
      return prevState;
  }
}