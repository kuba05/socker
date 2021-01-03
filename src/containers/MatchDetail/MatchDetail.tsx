import React from 'react';
import { connect } from 'react-redux';
import { TeamsById, Match, MatchesById } from 'model';
import { DataState } from '../../state/constants';
import { MatchCard } from 'components';

import { matchActions } from '../../state';

interface MatchDetailProps {
    state: DataState;
    matchId: number;
    match: Match | undefined;
    teams: TeamsById;
    hasAccess: boolean;
    dispatch: any;
    token: string;
};

class _MatchDetail extends React.Component<MatchDetailProps> {
    constructor(props:any) {
        super(props);
        this.handleStart = this.handleStart.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.handleScoreA = this.handleScoreA.bind(this);
        this.handleScoreB = this.handleScoreB.bind(this);
    }
    
    handleStart() {
        this.props.dispatch(matchActions.startMatch(this.props.matchId))
    }
    
    handleFinish() {
        this.props.dispatch(matchActions.finishMatch(this.props.matchId))
    }
    
    handleScoreA() {
        this.props.dispatch(matchActions.scoreGoalA(this.props.matchId))
    }
    
    handleScoreB() {
        this.props.dispatch(matchActions.scoreGoalB(this.props.matchId))
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
    if (this.props.match === undefined) {
        return <p>Zápas s ID={this.props.matchId} neexistuje</p>;
    }
    
    /*
    !this.props.match.started && 
     this.props.match.started && !this.props.match.finished && 
     */
     
    return (
        <>
            <MatchCard match={this.props.match} teams={this.props.teams} />
           
            {this.props.hasAccess && <div>
                {!this.props.match.started && <button className="btn btn-primary" onClick={this.handleStart} disabled={this.props.match.updateInProgress}>Start</button>}
                {this.props.match.started && !this.props.match.finished && <div className="form-group">
                  <button className="btn btn-primary" onClick={this.handleScoreA} disabled={this.props.match.updateInProgress}>+</button>
                  <button className="btn btn-primary" onClick={this.handleScoreB} disabled={this.props.match.updateInProgress}>+</button>
                </div>}
                {this.props.match.started && !this.props.match.finished && 
                <button className="btn btn-primary" onClick={this.handleFinish} disabled={this.props.match.updateInProgress}>Finish</button>}
            </div>}
        </>
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
  authentication: {
    loggedIn: boolean;
    user: {
       roles: string[];
    }
  }
}
          
function mapStateToProps(state: StoreState, ownState: { matchId: string }) {
  const matchId: number = parseInt(ownState.matchId);
  const isError = DataState.LOAD_FAILED === state.teams.state
    || DataState.LOAD_FAILED === state.matches.state; 
  const isLoading = DataState.LOAD_IN_PROGRESS === state.teams.state
    || DataState.LOAD_IN_PROGRESS === state.matches.state; 
  const isLoaded = DataState.LOAD_SUCCESS === state.teams.state
    && DataState.LOAD_SUCCESS === state.matches.state;
  const hasAccess = state.authentication.loggedIn && (state.authentication.user.roles.indexOf("ADMIN") >= 0 || state.authentication.user.roles.indexOf("REFEREE") >= 0)
  
  if (isLoaded) {
    const match: Match = state.matches.data[matchId];
    const teams: TeamsById = {};
    if (match) {
      teams[match.teamA] = state.teams.data[match.teamA];
      teams[match.teamB] = state.teams.data[match.teamB];
    }
    return {
       state: DataState.LOAD_SUCCESS,
       matchId: matchId,
       match: match,
       teams: teams, 
       hasAccess: hasAccess,
    };
  }
  return {
    state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
    matchId: matchId,
    match: undefined,
    teams: {},
    hasAccess: hasAccess,
  }
}
   
export const MatchDetail = connect(
   mapStateToProps,
)(_MatchDetail)