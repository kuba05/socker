import { GradeConstants, DataState } from '../constants';

export default function gradeReducer(prevState = {}, action) {
  switch(action.type) {
    case GradeConstants.LOAD_IN_PROGRESS:
      return {
        state: DataState.LOAD_IN_PROGRESS,
        data: undefined
      };
    case GradeConstants.LOAD_SUCCESS:
      return {
        state: DataState.LOAD_SUCCESS,
        data: action.grades,
      };
    case GradeConstants.LOAD_FAILED:
      return {
        state: DataState.LOAD_FAILED,
        data: null,
      };  
// TODO: we should fail following actions if state is not LOAD_SUCCESS      
    case GradeConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,grade]) => grade.id !== action.id)),
      };
    case GradeConstants.UPDATE_BY_ID:
      return {
        state: prevState.state,
        data: { ...prevState.data, [action.id]: action.payload },
      }
    default: 
      return prevState;
  }
}