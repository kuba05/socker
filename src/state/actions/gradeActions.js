import { GradeConstants } from '../constants';
import { Api } from '../api';

export const gradeActions = {
    loadGrades,
};

function loadGrades() {
    return dispatch => {
        dispatch(request());
        Api.getAllGrades()
        .then(grades => dispatch(success(grades)))
        .catch(error => dispatch(failure(error)));
    }
    
    function request() { return { type: GradeConstants.LOAD_IN_PROGRESS } }
    function success(grades) { return { type: GradeConstants.LOAD_SUCCESS, grades: grades } }
    function failure(error) { return { type: GradeConstants.LOAD_FAILED, error: error } }
}