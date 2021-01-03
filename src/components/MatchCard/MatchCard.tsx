import React from 'react';
import { NavLink } from 'react-router-dom';
import { TeamsById, Match } from 'model';
import styles from './MatchCard.module.scss';

export interface MatchCardProps {
    match: Match | undefined;
    teams: TeamsById;
};

export class MatchCard extends React.Component<MatchCardProps> {
  render() {
    if (this.props.match === undefined) {
        return false;
    }
    
    if (this.props.match === null) {
        return (
            <div className = "matchcard">
                <p>
                    match does not exist
                </p>
            </div>
        );
     }
     
    if (this.props.teams === undefined || this.props.teams[this.props.match.teamA] === undefined || this.props.teams[this.props.match.teamB] === undefined){
        return (
            <div className = "matchcard">
                <p>
                    one or both teams in this match can't be found
                </p>
            </div>
        )
    }
               
    return (
            <div className = "matchcard">
                <span className = {styles.leftside}>
                    <NavLink exact to={`/team/${this.props.match.teamA}`}
                        className={styles.teamLink}
                        activeClassName={styles.active}>
                            {this.props.teams[this.props.match.teamA].name}
                    </NavLink>
                </span>
                {this.props.match.updateInProgress && <img alt="loading..." src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />}
                {!this.props.match.updateInProgress && this.props.match!.scoreA !== null && this.props.match!.scoreB !== null && <span className = {styles.middle}>
                    <NavLink exact to={`/match/${this.props.match.id}`}
                        className={styles.matchLink}
                        activeClassName={styles.active}>
                            {this.props.match!.scoreA} : {this.props.match!.scoreB}
                    </NavLink>
                </span>}
                {!this.props.match.updateInProgress && (this.props.match!.scoreA === null && this.props.match!.scoreB === null) && <span className = {styles.middle}>
                    <NavLink exact to={`/match/${this.props.match.id}`}
                        className={styles.matchLink}
                        activeClassName={styles.active}>
                            -
                    </NavLink>
                </span>}
                <span className = {styles.rightside}>
                    <NavLink exact to={`/team/${this.props.match.teamB}`}
                        className={styles.teamLink}
                        activeClassName={styles.active}>
                            {this.props.teams[this.props.match.teamB].name}
                    </NavLink>
                </span>
            </div>
        );
        
    }
}