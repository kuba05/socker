import React from 'react';
import { connect } from 'react-redux';
import { groupActions, teamActions } from 'state';
import { TeamsById, GroupsById } from 'model';
import { DataState } from '../../state/constants';
//import styles from './TournamentDelete.module.scss';


interface TournamentDeleteProps {
    state: DataState;
    teams: TeamsById;
    groups: GroupsById;
    dispatch: any;
    //from react-router-dom
    history: any;
};


class _TournamentDelete extends React.Component<TournamentDeleteProps> {
    
    deleteAllGroups = () => {
        this.props.dispatch( groupActions.deleteAllGroups() )
    }
    
    deleteAllTeams = () => {
        this.props.dispatch( teamActions.deleteAllTeams() )
    }
    
    goToRegistration = () => {
        this.props.history.push("/registration");
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
            <React.Fragment>
                <button onClick = {this.deleteAllGroups}>
                    delete all groups
                </button>
                <button onClick = {this.deleteAllTeams}>
                    delete all teams
                </button>
                <button onClick = {this.goToRegistration}>
                    continue to team registration
                </button>
            </React.Fragment>
        );
    }
};


//REDUX
interface StoreState {
    teams: {
        state: DataState; 
        data: TeamsById;
    }
    groups: {
        state: DataState;
        data: GroupsById;
    }
};

function mapStateToProps(state: StoreState) {
    const isError = DataState.LOAD_FAILED === state.teams.state || DataState.LOAD_FAILED === state.groups.state
    const isLoading = DataState.LOAD_IN_PROGRESS === state.teams.state || DataState.LOAD_IN_PROGRESS === state.groups.state 
    const isLoaded = DataState.LOAD_SUCCESS === state.teams.state && DataState.LOAD_SUCCESS === state.groups.state
  
    if (isLoaded) {
        return {
            state: DataState.LOAD_SUCCESS,
            teams: state.teams.data,
            groups: state.groups.data,
        }
    }
    
    return {
        state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
        teams: {},
        groups: {},
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        dispatch
    }
}

export const TournamentDelete = connect(
    mapStateToProps,
    mapDispatchToProps
)(_TournamentDelete);