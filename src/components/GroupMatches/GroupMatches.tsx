import React from 'react';
import { Group, Match, TeamsById } from 'model';
import { MatchCard } from 'components';

export interface GroupMatchesProps {
    matches: Match[];
    group: Group;
    teams: TeamsById;
};

export class GroupMatches extends React.Component<GroupMatchesProps> {
  render() {
      let matches = this.props.matches
        .filter( (match) => match.groupId === this.props.group.id)
        .map( (match) => <li key={match.id}><MatchCard match={match} teams={this.props.teams}/></li>);
      return (
            <div>
                <ul>
                    {matches}
                </ul>
            </div>
        );
        
    }
}