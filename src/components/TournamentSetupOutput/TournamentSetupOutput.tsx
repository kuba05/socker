import React from 'react';
import { CategoryPlan } from 'components';
import { TeamsById, CategoriesById, GroupsByCategory } from 'model';
//import styles from './TournamentSetupInput.module.scss';


interface TournamentSetupOutputProps {
    //number of matches, that can be played in one day
    matchesPerDay: number;
    //number of days
    days: number;
    //all registered teams
    teams: TeamsById;
    //all categories
    categories: CategoriesById;
    //sumbit groups and continue on next screen
    goToNextScreen: (groups: GroupsByCategory) => void;
};

interface simpleGroupsByCategories {
    //first index is id of category
    //second is depth of the group
    //and third is pointing on the group itself
    [key: number]: 
    number[][]
}

export class TournamentSetupOutput extends React.PureComponent<TournamentSetupOutputProps> {
    
    static getLengthOfGroups = (groups: simpleGroupsByCategories): number => {
        //number of matches needed to finish groups
        return Object.values(groups).reduce(
            
            (sumCategoriesLength: number, newCategory: number[][]) => {
                
                //number of matches needed to finish category
                let categoryLength = newCategory.reduce(
                
                    (sumDepthsLength: number, newDepth: number[]) => {
                        
                        let depthLength: number = newDepth.reduce(
                        
                            (sumGroupsLength: number, newGroup: number) => {
                                
                                let groupLength = newGroup*(newGroup-1)/2;
                                return sumGroupsLength + groupLength;
                            },
                            //default value for reduce
                            0
                        );
                        
                        return sumDepthsLength+depthLength;
                        
                    },
                    //default value for reduce
                    0
                );
                
                return sumCategoriesLength+categoryLength;
                
            },
            //default value for reduce
            0
        )
    };
    
    goToNextPage = (error: {}, groups: GroupsByCategory) => {
        console.log(groups);
        console.log(error);
        if( !Object.values(error).reduce((a,b) => a||b) ){
            this.props.goToNextScreen(groups);
        }
    }
        
    optimazeGroups = (groupsToOptimaze: simpleGroupsByCategories, time: number) => {
        let groups = Object.values(groupsToOptimaze);
        
        if (    
            groups.reduce(
                //number of all teams in groups with depth 0 (= number of all teams) - 1 (= minimal nubmer of matches needed to finsih this category)
                (old, category) => old + category[0].reduce ( (a: number, b: number) => a + b ) - 1
                , 0
            )
            >
            time
        ) {
            //this can't be done
            return -1
        }
        
        while( TournamentSetupOutput.getLengthOfGroups(groups) > time ){
            let changed = false;
            
            //sort groups by average number of matches per team
            groups.sort(
                (firstCategory: number[][], secondCategory: number[][]): number => {
                    //average number of matches per team is number of matches / number of teams
                    return (
                        (
                            //number of matches
                            TournamentSetupOutput.getLengthOfGroups({0:secondCategory})
                            
                            /
                            
                            //count number of teams in this cateogry (sum of teams in all depth 0 groups)
                            secondCategory[0].reduce( (old:number, next: number) => old + next)
                        )
                        -
                        (
                            //number of matches
                            TournamentSetupOutput.getLengthOfGroups({0:firstCategory})
                            
                            /
                            
                            //count number of teams in this cateogry (sum of teams in all depth 0 groups)
                            firstCategory[0].reduce( (old:number, next: number) => old + next)
                        )
                    )
                }
            )
            
            for (let category of groups) {
                
                for (let i = category.length - 1; i >= 0; i--){
                    
                    let numberOfTeams = category[i].reduce( (old: number, next: number) => old + next);
                    
                    if ( Math.floor( numberOfTeams / (category[i].length + 1) ) < 2 ) {
                        continue;
                    }
                    let newGroups = []
                    
                    //TODO make it without for cycle
                    
                    //number of groups with less than average teams
                    for (let j = 0; j < (category[i].length + 1) - numberOfTeams % (category[i].length + 1); j++ ){
                        newGroups.push( Math.floor( numberOfTeams / (category[i].length + 1) ) );
                    }
                    
                    //number of groups with more than average teams
                    for (let j = 0; j < numberOfTeams % (category[i].length + 1); j++ ){
                        newGroups.push( Math.ceil( numberOfTeams / (category[i].length + 1) ) );
                    }
                    
                    category[i] = newGroups;
                    
                    if (! category[i+1]){
                        category[i+1] = [1]
                    }
                    
                    let maximal = 0;
                    let index = 0;
                    for (let n in category[i+1]){
                        let j = parseInt(n);
                        if (category[i+1][j] > maximal) {
                            index = j;
                            maximal = category[i+1][j];
                        }
                    }
                    category[i+1][index] += 1;                                        
                    changed = true;
                    break;
                }
                
                if (changed) {
                    break;
                }
            }
            if (!changed) {
                break;
            }
        }
        return 0
    }
    
    
    createGroupsFromSimpleGroupsByCategories = (simpleGroups: simpleGroupsByCategories): GroupsByCategory => {
        //create valid groups from simpleGroups
        const groups: GroupsByCategory = {};
        let id = -1;
        let name = "A";
        
        for (let categoryId in simpleGroups) {
            groups[categoryId] = {}
            let category = simpleGroups[categoryId];
            //prepare groups but without promotionId
            for (let depth = 0; depth < category.length; depth++) {
                for (let i = 0; i < category[depth].length; i++) {
                    //console.log(category[depth][i]);
                    groups[categoryId][id] =
                      //group
                      {
                        id: id,
                        categoryId: parseInt(categoryId),
                        name: name,
                        //number of teams in group
                        teams: Array(category[depth][i]).fill(1),
                        depth: depth,
                        promotionId: undefined,
                      };
                    id -= 1;
                    name = String.fromCharCode(name.charCodeAt(0) + 1);
                }    
            };
            
            //prepare promotionId
            let maxDepth = category.length - 1;
            for (let depth = 0; depth < maxDepth; depth++) {
                let depths = [
                  Object.values(groups[categoryId]).filter( 
                    (group) => group.depth === depth
                  ),
                  Object.values(groups[categoryId]).filter(
                    (group) => group.depth === depth + 1
                  )
                ];
                
                for (let i = 0; i < depths[0].length; i++) {
                    
                    //For each group (groupB) this one (groupA) may be promoted
                    //into, we need to subtract the number of teams in this groupB from j.
                    //Then, if j is lower than zero, the groupA will be promoted into this groupB.
                    //If j is greater than or equal to zero, we have to try next groupB.
                    
                    let j = i;
                    //to which group will this one be promoted
                    let promotion = 0;
                    
                    for(; promotion < depths[1].length; promotion++) {
                        j -= depths[1][promotion].teams.length;
                        if (j < 0){
                            break;
                        }
                    }
                    
                    depths[0][i].promotionId = depths[1][promotion].id;
                }
                console.log(depths);
            };
        }
        return groups;
    }
    
    render() {
        let error: {[id: number]: Boolean} = {}
        
        if (this.props.teams === undefined){
            return <div/>
        }

        //create simpleGroup for each category
        let groupsByCategories: simpleGroupsByCategories = {};
        for (let categoryId in this.props.categories) {
            groupsByCategories[parseInt(categoryId)] = [[0]];
        }
        
        Object.values(this.props.teams).forEach( 
            (team) => {
                if (groupsByCategories[team.categoryId]){
                    groupsByCategories[team.categoryId][0][0] += 1;
                }
            }
        )
        
        //optimaze simpleGroups
        error[1] = !!this.optimazeGroups ( [ groupsByCategories[1], groupsByCategories[2] ], this.props.matchesPerDay );
        error[2] = error[1]
        error[3] = !!this.optimazeGroups ( [ groupsByCategories[3], groupsByCategories[4] ], this.props.matchesPerDay );
        error[4] = error[3]
        console.log(groupsByCategories);
        
        const groups: GroupsByCategory = this.createGroupsFromSimpleGroupsByCategories(groupsByCategories);
        
        console.log(groups);
        console.log(error[1]);
        let plans = Object.keys(groups).map(
            (categoryId: string) => <span style={{color:(error[parseInt(categoryId)]? "red": "black")}}><CategoryPlan key = {categoryId} category = { this.props.categories[parseInt(categoryId)] } groups = {groups[parseInt(categoryId)]} /></span>
        );
        
        return (
            <>
                <div>
                    {plans}
                </div>
                <div>
                    {Object.values(error).reduce( (a,b) => a||b)? "Červeně zbarvené kategorie potřebují více času na dokončení.":null}
                </div>
                <div>
                    {!Object.values(error).reduce( (a,b) => a||b)?
                      <button onClick={ () => this.goToNextPage(error, groups) }>
                          Pokračovat
                      </button>:
                      null}
                </div>
            </>
        )
    };
    
};