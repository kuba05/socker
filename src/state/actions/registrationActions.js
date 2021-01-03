import { RegistrationConstants } from '../constants';
import { Api } from '../api';

export const registrationActions = {
    saveAll,
};

function saveAll(registrations, tournamentId) {
    return dispatch => Object.entries(registrations).forEach(([categoryId, gradePlans]) => {           
        Object.entries(gradePlans).forEach(([gradePlanId, grades]) => {
            Object.entries(grades).forEach(([grade, registration]) => {
                if (registration.registered && (registration.id < 0 || registration.id === undefined)) {
                  const team = {
                    categoryId: categoryId,
                    gradePlanId: gradePlanId,
                    grade: grade,
                    name: registration.name,
                    tournamentId: tournamentId,
                  };
                  dispatch(request(categoryId, gradePlanId, grade));
                  Api.createTeam(team)
                  .then(savedTeam => dispatch(success(categoryId, gradePlanId, grade, savedTeam.id)))
                  .catch(error => dispatch(failure(categoryId, gradePlanId, grade, error)));
                }
                if (!registration.registered && registration.id >= 0) {
                  dispatch(request(categoryId, gradePlanId, grade));
                  Api.deleteTeam(registration.id)
                  .then(() => dispatch(success(categoryId, gradePlanId, grade, -1)))
                  .catch(error => dispatch(failure(categoryId, gradePlanId, grade, error)));
                }
            })
        })
    })

    function request(categoryId, gradePlanId, grade) { return { type: RegistrationConstants.SAVE_IN_PROGRESS, categoryId: categoryId,  gradePlanId: gradePlanId, grade: grade} }
    function success(categoryId, gradePlanId, grade, id) { return { type: RegistrationConstants.SAVE_SUCCESS, categoryId: categoryId,  gradePlanId: gradePlanId, grade: grade, id: id } }
    function failure(categoryId, gradePlanId, grade, error) { return { type: RegistrationConstants.SAVE_FAILED, categoryId: categoryId,  gradePlanId: gradePlanId, grade: grade, error: error } }
}
