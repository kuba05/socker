import React from 'react';
import { TeamsById, MatchesById, Match } from 'model';
import { MatchCard } from 'components';

export interface MatchListProps {
    matches: MatchesById;
    teams: TeamsById;
};

export class MatchList extends React.Component<MatchListProps> {
  teamsForMatch(match: Match) {
    const teams: TeamsById = {};
    teams[match.teamA] = this.props.teams[match.teamA];
    teams[match.teamB] = this.props.teams[match.teamB];
    return teams;
  }
     
  render() {              
    const listMatches = Object.values(this.props.matches).map((match: Match) =>
        <li key={match.id}>
        <MatchCard match={match} teams={this.teamsForMatch(match)}/>
        </li>
    );
    return (
        <>
            <ul>
                {listMatches}
            </ul>
        </>
    )
  } // render
}