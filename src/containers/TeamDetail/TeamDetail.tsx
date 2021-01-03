import React from 'react';
import { connect } from 'react-redux';
import { Team, TeamsById, TeamsByGroup, Category, CategoriesById, Match, MatchesById, MatchesByGroup, Group, GroupsById } from 'model';
import { DataState } from '../../state/constants';
import { MatchList } from 'components';
import styles from './TeamDetail.module.scss';


interface TeamDetailProps {
    state: DataState;
    teamId: number;
    team: Team | undefined;
    category: Category | undefined;
    teams: TeamsById;
    matches: MatchesById;
    groups: GroupsById;
    matchesByGroup: MatchesByGroup;
    teamsByGroup: TeamsByGroup;
};


class _TeamDetail extends React.Component<TeamDetailProps> {
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
        if (this.props.team === undefined) {
            return <p>Team s ID={this.props.teamId} neexistuje</p>;
        }
        
        const lastGroup: number = Object.values(this.props.groups).map((group) => group.id)
          .reduce( (finalGroup, newValue) => newValue > finalGroup ? newValue : finalGroup, -1);

        const groups = Object.values(this.props.groups)
          .filter( (group:Group) => group.id !== lastGroup)
          .map( (group: Group) => {
               return (
                  <div key={group.id}>
                      <p className = {styles.data}>
                          <b>
                              {group.name}
                          </b>
                          <span>
                              <br/>
                              zápasy:
                          </span>
                      </p> 
                      <MatchList matches={this.props.matchesByGroup[group.id]? this.props.matchesByGroup[group.id]: {}} teams={this.props.teamsByGroup[group.id]} />
                  </div>
               )
          }
        )
        console.log(this.props.groups);
        console.log(groups);
        return (
            <div className = {styles.teamdetail}>
                <div className = {styles.title}>
                    <h1>
                        {this.props.team.name}
                    </h1>
                </div>
                <div className = {styles.category}>
                    <h3 className = {styles.subtitle}>
                        kategorie:
                    </h3>
                     <p className = {styles.data}>
                        {this.props.category!.name}
                     </p>
                </div>
                <div className = {styles.matcheslist}>
                    <h3>
                        skupiny:
                    </h3>
                    {lastGroup >= 0 && 
                        <span>
                            <h4>
                                aktuální skupina:
                            </h4>
                            <p className = {styles.data}>
                                <b>
                                    {this.props.groups[lastGroup].name}
                                </b>
                                <span>
                                    <br/>
                                    zápasy:
                                </span>
                            </p> 
                            <MatchList matches={this.props.matches} teams={this.props.teams}/>
                            <h4>
                                dohrané skupiny:
                            </h4>
                                {groups}
                        </span>
                    }
                </div>
            </div>
        );
    }
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

function mapStateToProps(state: StoreState, ownState: { teamId: string }) {
  const teamId: number = parseInt(ownState.teamId);
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
    const team = state.teams.data[teamId];
    const matches = team? Object.fromEntries(Object.entries(state.matches.data).filter( ([id,match]) => match.teamA === team.id || match.teamB === team.id )): {};
    const matchesByGroup: MatchesByGroup = {};
    const teamsByGroup: TeamsByGroup = {};
    Object.values(matches)
      .forEach((match:Match) => {
        if (matchesByGroup[match.groupId] === undefined){
            matchesByGroup[match.groupId] = {};
        }
        matchesByGroup[match.groupId][match.id] = match; 
        if (teamsByGroup[match.groupId] === undefined){
            teamsByGroup[match.groupId] = {};
        }
        teamsByGroup[match.groupId][match.teamA] = state.teams.data[match.teamA];
        teamsByGroup[match.groupId][match.teamB] = state.teams.data[match.teamB];
      });
    return {
       state: DataState.LOAD_SUCCESS,
       teamId: teamId,
       team: team,
       category: team? state.categories.data[team.categoryId]: undefined,
       teams: state.teams.data,
       groups: team? Object.fromEntries(Object.entries(state.groups.data).filter( ([id,group]) => group.teams.includes(team.id) )): {},
       matches: matches,
       matchesByGroup: matchesByGroup,
       teamsByGroup: teamsByGroup,
    }
  }
  return {
     state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
     teamId: teamId,
     teams: {},
     groups: [],
     matches: [],
     matchesByGroup: {},
     teamsByGroup: {},
  }
}

export const TeamDetail = connect(
   mapStateToProps,
)(_TeamDetail);