import { CategoryConstants, DataState } from '../constants';

export default function categoryReducer(prevState = {}, action) {
  switch(action.type) {
    case CategoryConstants.LOAD_IN_PROGRESS:
      return {
        state: DataState.LOAD_IN_PROGRESS,
        data: undefined
      };
    case CategoryConstants.LOAD_SUCCESS:
      return {
        state: DataState.LOAD_SUCCESS,
        data: action.categories,
      };
    case CategoryConstants.LOAD_FAILED:
      return {
        state: DataState.LOAD_FAILED,
        data: null,
      };
// TODO: we should fail following actions if state is not LOAD_SUCCESS
    case CategoryConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,category]) => category.id !== action.id)),
      };
    case CategoryConstants.UPDATE_BY_ID:
      return {
        state: prevState.state, 
        data: { ...prevState.data, [action.id]: action.payload }, 
      };
    default: 
      return prevState;
  }
}