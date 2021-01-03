import React from 'react';
import { connect } from 'react-redux';
import { TournamentsById } from 'model';
import { tournamentActions } from 'state';
import { DataState, /* RegistrationConstants */ } from '../../state/constants';
// import { TeamRegistrationForCategory } from 'components';


export interface ChooseTournamentProps {
    dispatch: any;
    state: DataState;
    tournaments: TournamentsById;
    tournamentId: number | null;
};


class _ChooseTournament extends React.Component<ChooseTournamentProps> {

  setActiveTournament = (tournamentId: string) => {
      this.props.dispatch(tournamentActions.changeActiveTournament(tournamentId));
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
      
      const tournaments = [];
      for (let tournamentId in this.props.tournaments) {
          tournaments.push(<button onClick={() => this.setActiveTournament(tournamentId)}>{this.props.tournaments[tournamentId].name}</button>);
      }
      
      return (
          <>
            <h2>Prosím, zvolte turnaj</h2>
            {tournaments}
          </>
      );
  
  } //render
  
}
  
interface StoreState {
  registrations: {
    state: DataState; 
    data: any;
  },
  tournaments: {
    state: DataState;
    data: any;
    activeTournamentId: number | null;
  },
};
          
          
function mapStateToProps(state: StoreState) {  
  const isError = DataState.LOAD_FAILED === state.tournaments.state;
  const isLoading = DataState.LOAD_IN_PROGRESS === state.tournaments.state;
  const isLoaded = DataState.LOAD_SUCCESS === state.tournaments.state;
  if (isLoaded){
    return {         
      state: DataState.LOAD_SUCCESS,
      tournaments: state.tournaments.data,
      tournamentId: state.tournaments.activeTournamentId,
    }
  } 
  return {
    state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
    tournaments: {},
    tournamentId: null,
  };
}

const mapDispatchToProps = (dispatch:any) => {
  return {
    dispatch
  }
}
   
export const ChooseTournament = connect(
   mapStateToProps,
   mapDispatchToProps,
)(_ChooseTournament);