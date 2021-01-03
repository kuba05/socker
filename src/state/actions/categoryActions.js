import { CategoryConstants } from '../constants';
import { Api } from '../api';

export const categoryActions = {
    loadCategories,
};

function loadCategories() {
    return dispatch => {
        dispatch(request());
        Api.getAllCategories()
        .then(data => { console.log(data);dispatch(success(data))})
        .catch(error => dispatch(failure(error)));
    }

    function request() { return { type: CategoryConstants.LOAD_IN_PROGRESS } }
    function success(categories) { return { type: CategoryConstants.LOAD_SUCCESS, categories: categories } }
    function failure(error) { return { type: CategoryConstants.LOAD_FAILED, error: error } }
}