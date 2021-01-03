import React from 'react';
import { connect } from 'react-redux';
import { CategoriesById, Group, GroupsById, TeamsById, Match, MatchesById, MatchesByTeam } from 'model';
import { DataState } from '../../state/constants';
import { GroupTable } from 'components';

interface GroupDetailProps {
    state: DataState;
    groupId: number,
    group: Group | undefined,
    teams: TeamsById,
    matchesByTeam: MatchesByTeam,
};

class _GroupDetail extends React.Component<GroupDetailProps> {
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
    if (this.props.group === undefined) {
        return <p>Skupina s ID={this.props.groupId} neexistuje</p>;
    }
    return (
        <div>
            <h1>skupina {this.props.group!.name}</h1>
            <div>
                <GroupTable group={this.props.group} teams={this.props.teams} matchesByTeam={this.props.matchesByTeam} /> 
            </div>
        </div>
    );
  } // render
};

interface StoreState {
  categories: {
    state: DataState;
    data: CategoriesById;
  }
  teams: {
    state: DataState; 
    data: TeamsById;
  }
  groups: {
    state: DataState; 
    data: GroupsById;
  }
  matches: {
    state: DataState; 
    data: MatchesById;
  }
};

function groupTeams(group: Group, teams: TeamsById): TeamsById {
    const result: TeamsById = {};
    group.teams.forEach((id: number) => { result[id] = teams[id] });
    return result;
}          

function matchesByTeams(teams: number[], matches: Match[]) {
    const result: MatchesByTeam = {};
    matches.forEach((match: Match) => {
       if (result[match.teamA] === undefined) {
          result[match.teamA] = {};
       }
       result[match.teamA][match.teamB] = match;
    });
    return result;
}
          
function mapStateToProps(state: StoreState, ownProps: { groupId: string }): GroupDetailProps {
  const groupId: number = parseInt(ownProps.groupId);
  const isError = DataState.LOAD_FAILED === state.categories.state
    || DataState.LOAD_FAILED === state.teams.state
    || DataState.LOAD_FAILED === state.groups.state
    || DataState.LOAD_FAILED === state.matches.state; 
  const isLoading = DataState.LOAD_IN_PROGRESS === state.categories.state
    || DataState.LOAD_IN_PROGRESS === state.teams.state
    || DataState.LOAD_IN_PROGRESS === state.groups.state
    || DataState.LOAD_IN_PROGRESS === state.matches.state; 
  const isLoaded = DataState.LOAD_SUCCESS === state.categories.state
    && DataState.LOAD_SUCCESS === state.teams.state
    && DataState.LOAD_SUCCESS === state.groups.state
    && DataState.LOAD_SUCCESS === state.matches.state; 

  if (isLoaded) {
    const group: Group|undefined = state.groups.data[groupId];
    return {
      state: DataState.LOAD_SUCCESS,
      groupId: groupId,
      group: group, 
      teams: group? groupTeams(group, state.teams.data) : {},
      matchesByTeam: group? 
          matchesByTeams(group.teams, Object.values(state.matches.data).filter((match: Match) => match.groupId === groupId )) : {},
    };
  };
  return {
    state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
    groupId: groupId,
    group: undefined,
    teams: {},
    matchesByTeam: {},
  };
}
   
export const GroupDetail = connect(
   mapStateToProps,
)(_GroupDetail);