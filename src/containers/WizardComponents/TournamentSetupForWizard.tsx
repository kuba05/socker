import React from 'react';
import { connect } from 'react-redux';
import { tournamentActions } from 'state';
import { TeamsById, CategoriesById, GroupsById, GroupPlan } from 'model';
import { DataState } from '../../state/constants';
import { TournamentSetupInput, TournamentSetupOutputSimplified } from 'components';
import styles from './wizardStyles.module.scss';
//import styles from './TeamDetail.module.scss';

const DEBUG = process.env.REACT_APP_DEBUG === "true";


interface TournamentSetupProps {
    tournamentId: number;
    state: DataState;
    categories: CategoriesById;
    
    groupPlanState: DataState;
    groupPlan: GroupPlan;
    
    goToNextScreen: ()=>void;
    goToPreviousScreen: ()=>void;
    
    dispatch: any;
};

interface TournamentSetupState {
    // length of a match in minutes
    matchLength: number;
    // length of a break in minutes
    breakLength: number;
    // number of playdays
    days: number;
    // length of each playday in minutes
    dayLength: number;
    
    categoryIdsPerDays: number[][]; // { [day:number] : { [index:number] : number } };
};

class _TournamentSetup extends React.Component<TournamentSetupProps, TournamentSetupState> {

    constructor(props: TournamentSetupProps) {
        super(props);
        this.state = {
            matchLength: 10,
            breakLength: 1,
            days: 1,
            dayLength: 8*60,
            categoryIdsPerDays: [],
        };
        // FIXME
/*        let matchesPerDay = Math.floor( (this.state.dayLength + this.state.breakLength) / (this.state.matchLength + this.state.breakLength) );
        let categoryIdsPerDays = [];
        categoryIdsPerDays.push((Object.keys(this.props.categories)));      
        this.props.dispatch( tournamentActions.prepareGroups({ id: this.props.tournamentId, numberOfMatchesPerDay: matchesPerDay, categoryIdsPerDays: categoryIdsPerDays }) ); */
    }

    componentDidUpdate (prevProps: any, prevState: any) {
        if (this.state.categoryIdsPerDays.length === 0 && this.props.state === DataState.LOAD_SUCCESS) { 
            // this is an initial setup which simply assign all categories to 1st day
            // TODO: split automatically into multiple days
            let categoryIdsPerDays: any = []; // { [day:number] : { [index:number] : number } } = {};
            categoryIdsPerDays.push( Object.keys(this.props.categories) );
            if (DEBUG){
                console.log("categoryIdsPerDays");
                console.log(categoryIdsPerDays);
            }
            this.setState({categoryIdsPerDays});
            let matchesPerDay = Math.floor( (this.state.dayLength + this.state.breakLength) / (this.state.matchLength + this.state.breakLength) );
            this.props.dispatch( tournamentActions.prepareGroups({ id: this.props.tournamentId, numberOfMatchesPerDay: matchesPerDay, categoryIdsPerDays: categoryIdsPerDays }) );
        }  
        if (DEBUG){
            console.group("componentDidUpdate");
            console.log("state:");
            console.log(this.state);
            console.log("prevState:");
            console.log(prevState);
            console.groupEnd();
        };
    }
    
    setDays = (days: number) => {
        this.setState ({days});
    }
    
    setDayLength = (dayLength: number) => {
        if (dayLength !== this.state.dayLength) {
console.log(`state: ${this.state.categoryIdsPerDays}`)
            this.setState ({dayLength});
            let matchesPerDay = Math.floor( (dayLength + this.state.breakLength) / (this.state.matchLength + this.state.breakLength) ); 
        this.props.dispatch( tournamentActions.prepareGroups({ id: this.props.tournamentId, numberOfMatchesPerDay: matchesPerDay, categoryIdsPerDays: this.state.categoryIdsPerDays }) );
        }
    }
    
    setBreakLength = (breakLength: number) => {
        if (breakLength !== this.state.breakLength) {
            this.setState ({breakLength});
            let matchesPerDay = Math.floor( (this.state.dayLength + breakLength) / (this.state.matchLength + breakLength) );
            this.props.dispatch( tournamentActions.prepareGroups({ id: this.props.tournamentId, numberOfMatchesPerDay: matchesPerDay, categoryIdsPerDays: this.state.categoryIdsPerDays }) );
        }
    }
    
    setMatchLength = (matchLength: number) => {
        // this.setState ({matchLength:matchLength});
        if (matchLength !== this.state.matchLength) {
            this.setState ({matchLength});
            let matchesPerDay = Math.floor( (this.state.dayLength + this.state.breakLength) / (matchLength + this.state.breakLength) );
            this.props.dispatch( tournamentActions.prepareGroups({ id: this.props.tournamentId, numberOfMatchesPerDay: matchesPerDay, categoryIdsPerDays: this.state.categoryIdsPerDays }) );
        }
    }
           
    saveGroups = () => {
            let matchesPerDay = Math.floor( (this.state.dayLength + this.state.breakLength) / (this.state.matchLength + this.state.breakLength) );
            this.props.dispatch( tournamentActions.saveGroups({ id: this.props.tournamentId, numberOfMatchesPerDay: matchesPerDay, categoryIdsPerDays: this.state.categoryIdsPerDays }) );
        }
        
    goToPreviousScreen = () => {
        this.props.goToPreviousScreen();
    }
    
    goToNextScreen = () => {
        this.saveGroups();
        this.props.goToNextScreen();
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
                <div className = {styles.wizardContent}>
                    <div className = {styles.inputDiv}>
                        <TournamentSetupInput
                          days = {this.state.days}
                          daysChange = {this.setDays}
                          matchLength = {this.state.matchLength}
                          matchLengthChange = {this.setMatchLength}
                          breakLength = {this.state.breakLength}
                          breakLengthChange = {this.setBreakLength}
                          dayLength = {this.state.dayLength}
                          dayLengthChange = {this.setDayLength}
                        />
                    </div>
                    <div className = {styles.outputDiv}>
                        <TournamentSetupOutputSimplified
                          state = { this.props.groupPlanState }
                          categories = {this.props.categories}
                          groupPlan = { this.props.groupPlan }
                        />
                    </div>
                </div>
                <div className = {styles.wizardControl}>
                    <button onClick = {this.goToPreviousScreen}>
                        return to previous screen
                    </button>
                    <button onClick = {this.saveGroups}>
                        save
                    </button>
                    <button onClick = {this.goToNextScreen}>
                        save and go to next screen
                    </button>
                </div>
            </React.Fragment>
        );
    }
};


//REDUX
interface StoreState {
    tournaments: {
        activeTournamentId: number;
    }
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
    groupPlanOffer: {
        state: DataState;
        data: GroupPlan;
    }
};

function mapStateToProps(state: StoreState) {
    const isError = DataState.LOAD_FAILED === state.categories.state
      || DataState.LOAD_FAILED === state.teams.state || DataState.LOAD_FAILED === state.groups.state
    const isLoading = DataState.LOAD_IN_PROGRESS === state.categories.state
      || DataState.LOAD_IN_PROGRESS === state.teams.state || DataState.LOAD_IN_PROGRESS === state.groups.state 
    const isLoaded = DataState.LOAD_SUCCESS === state.categories.state
      && DataState.LOAD_SUCCESS === state.teams.state && DataState.LOAD_SUCCESS === state.groups.state
  
    if (isLoaded) {
        return {
            tournamentId: state.tournaments.activeTournamentId,
            state: DataState.LOAD_SUCCESS,
            teams: state.teams.data,
            categories: state.categories.data,
            groups: state.groups.data,
            groupPlanState: state.groupPlanOffer.state,
            groupPlan: state.groupPlanOffer.data,
        }
    }
    return {
        tournamentId: -1,
        state: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
        teams: {},
        categories: {},
        groups: {},
        groupPlanState: isLoading && !isError? DataState.LOAD_IN_PROGRESS: DataState.LOAD_FAILED,
        groupPlan: {},
    }
}

const mapDispatchToProps = (dispatch:any) => {
    return {
        dispatch
    }
}

export const TournamentSetupForWizard = connect(
    mapStateToProps,
    mapDispatchToProps
)(_TournamentSetup);