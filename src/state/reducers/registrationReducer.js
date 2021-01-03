import { RegistrationConstants, DataState } from '../constants';

export function registrationReducerCompute(prevState = {}, action, categories, grades, teams) {
  switch(action.type) {
    case RegistrationConstants.LOAD_SUCCESS: {
      const registrations = {};
      Object.values(teams).forEach((team) => {
        if (!registrations[team.categoryId]) registrations[team.categoryId] = {};
        if (!registrations[team.categoryId][team.gradePlanId]) registrations[team.categoryId][team.gradePlanId] = {};
        registrations[team.categoryId][team.gradePlanId][team.grade] = { id: team.id, name: team.name, registered: true };
      })
      Object.values(categories).forEach((category) => {
        if (!registrations[category.id]) registrations[category.id] = {};
        Object.values(grades).forEach((grade) => {
           if (grade.gradeMin > category.gradeMax || grade.gradeMax < category.gradeMin) { return; }
           if (!registrations[category.id][grade.id]) registrations[category.id][grade.id] = {};
           for (let i = grade.gradeMin; i <= grade.gradeMax; i++) {
              if (i >= category.gradeMin && i <= category.gradeMax && registrations[category.id][grade.id][i] === undefined) { 
                  registrations[category.id][grade.id][i] = { name: (i - grade.gradeMin + 1) + '.' + grade.suffix, registered: false };
              }
           }
        })
      })
      return {
        state: DataState.LOAD_SUCCESS,
        data: registrations,
      };
    }
    default: 
      return prevState;
  }
}

export function registrationReducer(prevState = {}, action) {
  switch(action.type) {
// TODO: we should fail following actions if state is not LOAD_SUCCESS      
    case RegistrationConstants.USER_UPDATE: {
console.log(action);
      const gradePlans = prevState.data[action.categoryId];
      const grades = gradePlans[action.gradePlanId];
      return {
        state: prevState.state,
        data: {
           ...prevState.data,
           [action.categoryId]: {
              ...gradePlans,
              [action.gradePlanId]: {
                  ...grades,
                  [action.grade]: {
                      ...grades[action.grade],
                      name: action.name || grades[action.grade].name,
                      registered: action.registered,
                  }
              }
           }
        }
      }    
    }

    case RegistrationConstants.SERVER_UPDATE: {
console.log(action);
      const gradePlans = prevState.data[action.categoryId];
      const grades = gradePlans[action.gradePlanId];
      const id = grades[action.grade].id;
      
      return {
        state: prevState.state,
        data: {
           ...prevState.data,
           [action.categoryId]: {
              ...gradePlans,
              [action.gradePlanId]: {
                  ...grades,
                  [action.grade]: {
                      ...grades[action.grade],
                      id: action.id || id,
                      name: action.name || grades[action.grade].name,
                      registered: action.registered,
                  }
              }
           }
        }
      }    
    }
 
/*    case RegistrationConstants.DELETE_BY_TEAM_ID:
      const data = Object.fromEntries(Object.entries(prevState.data).map(([categoryId, gradePlans]) => {
           if (categoryId != action.categoryId) return [categoryId, gradePlans];
           
           return [categoryId, Object.fromEntries(Object.entries(gradePlans).map(([gradePlanId, grades]) => {
              if (gradePlanId != action.gradePlanId) return [gradePlanId, grades];
            
              return [gradePlanId, Object.fromEntries(Object.entries(grades).map(([grade, registration]) => {
                if (grade != action.grade) return [grade, registration];
                
                return [grade, { ...registration, registered: false }];
              }))];
           }))]
        }));
      return {
        state: prevState.state,
        data: data,
      }         */

    // saving
    case RegistrationConstants.SAVE_SUCCESS:
    case RegistrationConstants.SAVE_IN_PROGRESS: 
    case RegistrationConstants.SAVE_FAILED:
    {
      const newState = RegistrationConstants.SAVE_SUCCESS === action.type? DataState.SAVE_SUCCESS:
                RegistrationConstants.SAVE_IN_PROGRESS === action.type? DataState.SAVE_IN_PROGRESS: DataState.SAVE_FAILED;
      const gradePlans = prevState.data[action.categoryId];
      const grades = gradePlans[action.gradePlanId];
      const id = grades[action.grade].id;
      
      return {
        state: prevState.state,
        data: {
           ...prevState.data,
           [action.categoryId]: {
              ...gradePlans,
              [action.gradePlanId]: {
                  ...grades,
                  [action.grade]: {
                      ...grades[action.grade],
                      state: newState,
                      id: action.id || id,
                      error: action.error,
                  }
              }
           }
        }
      }    
    }  

    default: 
      return prevState;
  }
}

export default registrationReducer;