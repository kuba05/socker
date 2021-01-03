import React from 'react';
import { connect } from 'react-redux';
import { CategoriesById } from 'model';
import { tournamentActions } from 'state';
import { DataState, RegistrationConstants } from '../../state/constants';


export interface TeamDraftProps {
    dispatch: any;
    state: DataState;
    categoriesId: number[];
    tournamentId: number | null;
};


class _TeamDraft extends React.Component<TeamDraftProps> {
  
    draftTeams = () => {
        this.props.dispatch( tournamentActions.draftTeams(this.props.tournamentId, this.props.categoriesId));
    }
    
    closeSetup = () => {
        this.props.dispatch( tournamentActions.closeSetup(this.props.tournamentId));
    }
    
    openSetup = () => {
        this.props.dispatch( tournamentActions.openSetup(this.props.tournamentId));
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
                <div className = "content">
                    <button onClick={this.draftTeams}>
                        draft teams
                    </button>
                </div>
                <div className = "control">
                    <button onClick={this.closeSetup}>
                        close setup
                    </button>
                    <button onClick={this.openSetup}>
                        open setup
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
   
export const TeamDraft = connect(
   mapStateToProps,
   mapDispatchToProps,
)(_TeamDraft);