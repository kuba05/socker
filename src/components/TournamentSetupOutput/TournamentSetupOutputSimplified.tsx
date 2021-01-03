import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { CategoryPlan } from 'components';
import { CategoriesById, GroupsByCategory, GroupPlan } from 'model';
//import styles from './TournamentSetupInput.module.scss';
import { DataState } from '../../state/constants';


interface TournamentSetupOutputProps {
    state: DataState;
    // all categories
    categories: CategoriesById;
    groupPlan: GroupPlan;
};

/******************
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));
******************/

export class TournamentSetupOutputSimplified extends React.PureComponent<TournamentSetupOutputProps> {
    
    createGroupsForGroupPlan = (groupPlan: GroupPlan): GroupsByCategory => {
        console.log(groupPlan);
        const groups: GroupsByCategory = {};
        let id:number = 0;
        let name:number = 'A'.charCodeAt(0);
        for (let dayPlan of Object.values(groupPlan)) {
            for (let category of dayPlan) {
            console.group("day plan categories");
            console.log("category: ");            
            console.log(category);
            console.groupEnd();
                groups[category.categoryId] = {}
                for (let depth = 0; depth < category.slices.length; depth++) {
                    for (let i = 0; i < category.slices[depth]; i++) {
                      let promotionId = undefined;
                      if (depth < category.slices.length - 1) {
                          const standardSize: number = Math.floor(category.slices[depth] / category.slices[depth+1]);
                          const biggerGroups: number = category.slices[depth] % category.slices[depth+1];
                          let promotionIndex: number;
                          console.log(`at depth ${depth} (average number of teams per group=${category.slices[depth]} / ${category.slices[depth+1]}) => standardSize: ${standardSize}, biggerGroups: ${biggerGroups}`)
                          if (biggerGroups > 0 && i < biggerGroups * (standardSize + 1)) {
                             promotionIndex = Math.floor(i/ (standardSize + 1)); 
                          } else {
                             promotionIndex = biggerGroups + Math.floor((i - biggerGroups * (standardSize + 1)) / standardSize);
                          }
                          //onsole.log(`promotionIndex: ${promotionIndex}`)                  
                          // reset to start of this slice, then add whole slice and promotion index
                          promotionId = (id - i) + category.slices[depth] + promotionIndex;
                          //console.log(`promotionId: ${promotionId}`)                                   
                      }
                      
                      const prevSize: number = depth > 0? category.slices[depth-1]: category.members;
                      const standardSize: number = Math.floor(prevSize / category.slices[depth]);
                      const biggerGroups: number = prevSize % category.slices[depth];
                      const teamSize: number = i < biggerGroups? standardSize + 1: standardSize;
//console.log(`@${depth}/${i} #${prevSize} => ${standardSize}:${biggerGroups} `);
                        
                      groups[category.categoryId][id] =
                        {
                          id: -1 - (id++),
                          categoryId: category.categoryId,
                          name: String.fromCharCode(name++),
                          teams: Array(teamSize).fill(undefined),
                          depth: depth,
                          promotionId: -1 - promotionId,
                        };
                    }
                }        
            }
        }
console.log("groups: ");        
console.log(groups);        
        return groups;
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
        
//        const classes = useStyles();
 /* className={classes.paper}> */
 
        const groups = this.createGroupsForGroupPlan(this.props.groupPlan);
        let days:any = [];
        for (let key in this.props.groupPlan) {
            let categories = Object.values(this.props.groupPlan[key]).map((c:any) =>
                <Grid item xs>
                    <Paper>
                        <CategoryPlan key={ c.categoryId } category={ this.props.categories[c.categoryId] } groups={ groups[c.categoryId] } numberOfTeams={ c.members } />
                    </Paper>
                </Grid>
            );
            days.push(<Grid container spacing={3} key={ key }> { categories } </Grid>);
        }
         
        return (
        <div>
        {days}
        </div>
        )      

    };
            
};