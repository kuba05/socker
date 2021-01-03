import React from 'react';
import { connect } from 'react-redux';
import { TeamsById, MatchesById } from 'model';
import { DataState } from '../../state/constants';
import { MatchList } from 'components';

export interface ScheduleProps {
    state: DataState;
    matches: MatchesById;
    teams: TeamsById;    
};

class _Schedule extends React.Component<ScheduleProps> {
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
      <MatchList matches={this.props.matches} teams={this.props.teams} />
    );

  }
}

interface StoreState {
  teams: {
    state: DataState; 
    data: TeamsById;
  }
  matches: {
    state: DataState; 
    data: MatchesById;
  }
};
          
function mapStateToProps(state: StoreState) {  
  const isError = DataState.LOAD_FAILED === state.teams.state
    || DataState.LOAD_FAILED === state.matches.state; 
  const isLoading = DataState.LOAD_IN_PROGRESS === state.teams.state
    || DataState.LOAD_IN_PROGRESS === state.matches.state; 
  const isLoaded = DataState.LOAD_SUCCESS === state.teams.state
    && DataState.LOAD_SUCCESS === state.matches.state;
  return {
    state: isLoaded? DataState.LOAD_SUCCESS: (isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED),
    matches: isLoaded? state.matches.data: {},
    teams: isLoaded? state.teams.data: {}, 
  };
}
   
export const Schedule = connect(
   mapStateToProps,
)(_Schedule);