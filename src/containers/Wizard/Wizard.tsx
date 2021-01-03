import React from 'react';
import { connect } from 'react-redux';
import { tournamentActions } from 'state';
import { Tournament, TournamentsById } from 'model';
import { DataState } from '../../state/constants';
import { TeamRegistrationForWizard, TournamentSetupForWizard, TeamDraftForWizard } from 'containers';

interface WizardProps {
    state: DataState,
    tournament: Tournament | undefined,
    hasAcess: boolean,
    dispatch: any
}

class _Wizard extends React.Component<WizardProps>{
    closeRegistrations = () => {
        if(this.props.tournament){
            this.props.dispatch( tournamentActions.closeRegistrations(this.props.tournament.id) );
        }
    }
    
    closeSetup = () => {
        if(this.props.tournament){
            this.props.dispatch( tournamentActions.closeSetup(this.props.tournament.id) );
        }
    }
    
    openRegistrations = () => {
        if(this.props.tournament){
            this.props.dispatch( tournamentActions.openRegistrations(this.props.tournament.id) );
        }
    }
    
    openSetup = () => {
        if(this.props.tournament){
            this.props.dispatch( tournamentActions.openSetup(this.props.tournament.id) );
        }
    }
    
    render(){
        if (this.props.state === DataState.LOAD_FAILED || this.props.tournament===undefined || this.props.tournament===null) {
            return <p>Sorry! There was an error loading the data.</p>;
        }
        if (this.props.state === DataState.LOAD_IN_PROGRESS) {
            return <p>Loading...</p>;
        }
        if (this.props.state !== DataState.LOAD_SUCCESS) {
            return <p>Internal error...</p>;
        }
        
        let component = <div/>;
        let controlButtons =
            <div>
                <button onClick={this.openSetup}>
                    openSetup
                </button>
            </div>;
        if (this.props.tournament.isRegistrationOpen) {
            component = <TeamRegistrationForWizard       
                goToNextScreen = {this.closeRegistrations}
              />;
        } else if (this.props.tournament.isSetupOpen) {
            component = <TournamentSetupForWizard
                goToNextScreen = {this.closeSetup} 
                goToPreviousScreen = {this.openRegistrations}
              />
        } else if (! this.props.tournament.isSetupOpen) {
            component = <TeamDraftForWizard
                goToNextScreen = {()=>{}}
                goToPreviousScreen = {this.openSetup}
              />
        }
        
        console.log(component);
        console.log(this.props.tournament);
        return (
            <div> 
                <div>
                    {component}
                </div>
            </div>
        );
    }
}

interface StoreState {
    tournaments: {
        state: DataState; 
        data: TournamentsById;
        activeTournamentId: string;
    }
    authentication: {
        loggedIn: boolean;
        user: {
            roles: string[];
      }
}
}

function mapStateToProps(state: StoreState) {
    const isError = DataState.LOAD_FAILED === state.tournaments.state; 
    const isLoading = DataState.LOAD_IN_PROGRESS === state.tournaments.state; 
    const isLoaded = DataState.LOAD_SUCCESS === state.tournaments.state;
    const hasAccess = state.authentication.loggedIn && (state.authentication.user.roles.indexOf("ADMIN") >= 0)
    let tournament: Tournament|undefined = state.tournaments.data[parseInt(state.tournaments.activeTournamentId)];
    
    if (isLoaded) {
        return {
            state: DataState.LOAD_SUCCESS,
            tournament: tournament,
            hasAccess: hasAccess,
        }
    }
    return {
        state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
        tournament: undefined,
        hasAccess: hasAccess,
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        dispatch
    }
}

export const Wizard = connect(
    mapStateToProps,
    mapDispatchToProps,
)(_Wizard);