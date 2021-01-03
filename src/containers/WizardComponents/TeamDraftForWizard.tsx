import React from 'react';
import { connect } from 'react-redux'; 
import { CategoriesById } from 'model';
import { tournamentActions } from 'state';
import { DataState, RegistrationConstants } from '../../state/constants';
import styles from './wizardStyles.module.scss';


export interface TeamDraftProps {
    dispatch: any;
    state: DataState;
    categoriesId: number[];
    tournamentId: number | null;
    goToPreviousScreen: () => void;
    goToNextScreen: () => void;
};


class _TeamDraft extends React.Component<TeamDraftProps> {
  
    draftTeams = () => {
        this.props.dispatch( tournamentActions.draftTeams(this.props.tournamentId, this.props.categoriesId));
    }
    
    draftMatches = () => {
        this.props.dispatch( tournamentActions.draftMatches(this.props.tournamentId, this.props.categoriesId));
    }
    
    goToPreviousScreen = () => {
        this.props.goToPreviousScreen();
    }
    
    goToNextScreen = () => {
        this.props.goToNextScreen();
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
        
        return (
            <>
                <div className = {styles.wizardContent}>
                    <button onClick={this.draftTeams}>
                        draft teams
                    </button>
                    <button onClick={this.draftMatches}>
                        draft matches
                    </button>
                </div>
                <div className = {styles.wizardControl}>
                    <button onClick={this.goToPreviousScreen}>
                        go to previous screen
                    </button>
                    <button onClick={this.goToNextScreen}>
                        go to next screen
                    </button>
                </div>
                
            </>
        );
    
    } //render
  
}
  
interface StoreState {
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
  const isError = DataState.LOAD_FAILED === state.categories.state;
  const isLoading = DataState.LOAD_IN_PROGRESS === state.categories.state;
  const isLoaded = DataState.LOAD_SUCCESS === state.categories.state;
  if (isLoaded){
    return {         
      state: DataState.LOAD_SUCCESS,
      categoriesId: Object.keys(state.categories.data).map(id=>parseInt(id)),
      tournamentId: state.tournaments.activeTournamentId,
    }
  } 
  return {
    state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
    categoriesId: [],
    tournamentId: null,
  };
}

const mapDispatchToProps = (dispatch:any) => {
  return {
    dispatch
  }
}
   
export const TeamDraftForWizard = connect(
   mapStateToProps,
   mapDispatchToProps,
)(_TeamDraft);
