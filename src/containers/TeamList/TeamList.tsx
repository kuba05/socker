import React from 'react';
import { connect } from 'react-redux';
import { Team, TeamsById, CategoriesById } from 'model';
import { DataState } from '../../state/constants';
import { TeamCard } from 'components';

export interface ScheduleProps {
  state: DataState,
  categories: CategoriesById,
  teams: TeamsById,
};

class _TeamList extends React.Component<ScheduleProps> {
                                            
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
    const listTeams = Object.values(this.props.teams).map((team: Team) =>
            <TeamCard key={team.id} team={team} categories={this.props.categories}/>
    );
    return (
        <>
            <table>
                <tbody>
                    {listTeams}
                </tbody>
            </table>
        </>
    )
  }
  
}

interface StoreState {
  categories: {
    state: DataState;
    data: CategoriesById;
  }
  teams: {
    state: DataState; 
    data: TeamsById;
  }
};
          
function mapStateToProps(state: StoreState) {  
  const isError = DataState.LOAD_FAILED === state.categories.state || DataState.LOAD_FAILED === state.teams.state; 
  const isLoading = DataState.LOAD_IN_PROGRESS === state.categories.state || DataState.LOAD_IN_PROGRESS === state.teams.state; 
  const isLoaded = DataState.LOAD_SUCCESS === state.categories.state && DataState.LOAD_SUCCESS === state.teams.state;
  return {
     state: isLoaded? DataState.LOAD_SUCCESS: (isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED),  
     categories: state.categories.data,
     teams: state.teams.data, 
  };
}
   
export const TeamList = connect(
   mapStateToProps,
)(_TeamList);