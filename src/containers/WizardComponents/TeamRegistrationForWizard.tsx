import React from 'react';
import { connect } from 'react-redux';
import { Team, CategoriesById } from 'model';
import { registrationActions } from 'state';
import { DataState, RegistrationConstants } from '../../state/constants';
import { TeamRegistrationForCategory } from 'components';
import styles from './wizardStyles.module.scss';

export interface TeamRegistrationProps {
    dispatch: any;
    state: DataState;
    registrations: any;
    categories: CategoriesById;
    tournamentId: number | null;
    goToNextScreen: ()=>void;
};


class _TeamRegistration extends React.Component<TeamRegistrationProps> {

  handleSaveRegistrations() {
    if (this.props.tournamentId) {
        this.props.dispatch(registrationActions.saveAll(this.props.registrations, this.props.tournamentId))
    }
  }
  
  register(team: Team, registered: boolean) {
      console.log(team.name + " is now " + (registered? "": "not ") + "registered");
      this.props.dispatch({ type: RegistrationConstants.SERVER_UPDATE, categoryId: team.categoryId, gradePlanId: team.gradePlanId, grade: team.grade, registered: registered });
  }
   
  render() {
      if (this.props.state === DataState.LOAD_FAILED) {
          return <p>Sorry! There was an error loading the data.</p>;
      }                                         
      if (this.props.state === DataState.LOAD_IN_PROGRESS) {
          return <p>Loading...</p>;
      }
      if (this.props.state !== DataState.LOAD_SUCCESS) {
          return <p>Internal error...</p>;
      }
      let rows = [];
      for (let categoryId in this.props.categories){
          rows.push(
              <div key={categoryId} className = {styles.categoryRegistration}>
                  <h3>{ this.props.categories[categoryId].name }</h3>
                  <TeamRegistrationForCategory
                    tournamentId = { this.props.tournamentId }
                    register = { this.register.bind(this) }
                    isSaving = {false}
                    registrations = { this.props.registrations[categoryId] }
                    categoryId = {parseInt(categoryId)}
                    gradeMin = { Object.keys(Object.values(this.props.registrations[categoryId])).map((grade:string) => parseInt(grade)).reduce( (min, actual) => actual < min ? actual : min, 32767 ) }
                    gradeMax = { Object.keys(Object.values(this.props.registrations[categoryId])).map((grade:string) => parseInt(grade)).reduce( (max, actual) => actual > max ? actual : max, 0 ) }
                  />                               
              </div>
          );
      };
      return (
          <React.Fragment>
              <div className = {styles.wizardContent}>
                  {rows}
              </div>
              <div className = {styles.wizardControl}>
                  <button className="btn btn-primary" onClick={ this.handleSaveRegistrations.bind(this) } >Save</button>
                  <button onClick={this.props.goToNextScreen}>Save and go to next screen</button>
              </div>
          </React.Fragment>
      );
  
  } //render
  
}
  
interface StoreState {
  registrations: {
    state: DataState; 
    data: any;
  },
  categories: {
    state: DataState; 
    data: CategoriesById;
  },
  tournaments: {
    state: DataState;
    activeTournamentId: number | null;
  },
};
          
          
function mapStateToProps(state: StoreState) {  
  const isError = DataState.LOAD_FAILED === state.registrations.state || DataState.LOAD_FAILED === state.categories.state;
  const isLoading = DataState.LOAD_IN_PROGRESS === state.registrations.state || DataState.LOAD_IN_PROGRESS === state.categories.state;
  const isLoaded = DataState.LOAD_SUCCESS === state.registrations.state && DataState.LOAD_SUCCESS === state.categories.state;
  if (isLoaded){
    return {         
      state: DataState.LOAD_SUCCESS,
      registrations: state.registrations.data,
      categories: state.categories.data,
      tournamentId: state.tournaments.activeTournamentId,
    }
  } 
  return {
    state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
    registrations: {},
    categories: {},
    tournamentId: null,
  };
}

const mapDispatchToProps = (dispatch:any) => {
  return {
    dispatch
  }
}
   
export const TeamRegistrationForWizard = connect(
   mapStateToProps,
   mapDispatchToProps,
)(_TeamRegistration);