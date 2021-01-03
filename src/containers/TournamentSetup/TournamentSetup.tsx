import React from 'react';
import { connect } from 'react-redux';
import { tournamentActions } from 'state';
import { TeamsById, CategoriesById, GroupsById, GroupPlan } from 'model';
import { DataState } from '../../state/constants';
import { TournamentSetupInput, TournamentSetupOutputSimplified } from 'components';
//import styles from './TeamDetail.module.scss';

const DEBUG = process.env.REACT_APP_DEBUG === "true";


interface TournamentSetupProps {
    tournamentId: number;
    state: DataState;
//    teams: TeamsById;
    categories: CategoriesById;
//    groups: GroupsById;
    
    groupPlanState: DataState;
    groupPlan: GroupPlan;
    
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
    
    closeRegistrations = () => {
            this.props.dispatch( tournamentActions.closeRegistrations(this.props.tournamentId) );
    }
    
    openRegistrations = () => {
            this.props.dispatch( tournamentActions.openRegistrations(this.props.tournamentId) );
    }
    
/************************
    goToNextScreen = (groups: GroupsByCategory) => {
        console.log(groups);
        let groupsByDepth: GroupsByDepth = {};
        if (Object.keys(this.props.groups).length !== 0){
            if (DEBUG){
                console.log(this.props.groups);
                console.log(this.props.groups === {});
            }
            return
        };
        console.log(this.props.groups);
        //change data type from GroupsByCategory to GroupsById
        let groupsById: GroupsById = Object.assign({}, ...Object.values(this.draftTeams(groups)));
        console.log(groupsById);
        let group: Group;
        for (group of Object.values( groupsById )){
            if (!groupsByDepth[group.depth]){
                groupsByDepth[group.depth] = {}
            };
            groupsByDepth[group.depth][group.id] = group;
        }
        console.log(groupsByDepth);
        this.props.dispatch( groupActions.createGroups(groupsByDepth) );
    }
    
    deleteAllGroups = () => {
        this.props.dispatch( groupActions.deleteAllGroups() )
    }
    
    draftTeams = (allGroups: GroupsByCategory) => {
        let finalGroups: GroupsByCategory = {};
        for (let _categoryId in allGroups){
            let categoryId = parseInt(_categoryId);
            
            finalGroups[categoryId] = {};
            let groups = Object.values(allGroups[categoryId]);
            let teams: Team[] = Object.values(this.props.teams).filter(team => team.categoryId === categoryId);
            for (let group of groups){
                if (group.depth !== 0){
                    finalGroups[categoryId][group.id] = {...group, teams: []};
                    continue;
                }
                for (let i = 0; i < group.teams.length; i++){
                    let randomNumber = Math.floor(Math.random() * teams.length);
                    let team: Team = teams.splice(randomNumber, 1)[0];
                    group.teams[i] = team.id;
                }
                finalGroups[categoryId][group.id] = group;
            }
        }
        console.log(finalGroups);
        return finalGroups;
    }
************************/    
    
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
                <div className = "inputDiv">
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
                <div className = "outputDiv">
                    <TournamentSetupOutputSimplified
                      state = { this.props.groupPlanState }
                      categories = {this.props.categories}
                      groupPlan = { this.props.groupPlan }
                    />
                </div>
                { /*****************
                <button onClick = {this.deleteAllGroups}>
                    delete
                </button>
                *******************/ }
                <button onClick = {this.closeRegistrations}>
                    close registrations
                </button>
                <button onClick = {this.openRegistrations}>
                    open registrations
                </button>
                <button onClick = {this.saveGroups}>
                    Save
                </button>
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

export const TournamentSetup = connect(
    mapStateToProps,
    mapDispatchToProps
)(_TournamentSetup);