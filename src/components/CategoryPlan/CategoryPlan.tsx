import React from 'react';
import { NavLink } from 'react-router-dom';
import { Category, GroupsById } from 'model';

export interface CategoryPlanProps {
    category: Category,
    groups: GroupsById,
    numberOfTeams?: number,
}

export class CategoryPlan extends React.Component<CategoryPlanProps, {}> { 
  
  render() {
    //number of teams in this category
    let teams = 0;
    
    const candidates : { [id:number]: number[] } = {}; 
    const groups = this.props.groups !== undefined? Object.values(this.props.groups): [];
                                                                                                                                              
    for (let group of groups) {
        if (group.promotionId !== undefined) {
            if (!(group.promotionId in candidates)) {
               candidates[group.promotionId] = []
            }
            candidates[group!.promotionId].push(group.id);
        }
    }
    //console.log(candidates);
    
    let width = groups.reduce ( ( maximum, actual ) => maximum > actual.depth ? maximum: actual.depth, 0   );
    
    const table: any[] = [];
    console.log(table);
    //fill table with td
    for (let group of groups.filter ( group => group.depth === 0) ){
        table.push( [
            //if id is lower than zero, the group does not exist => link to it does not make sence
            <td key={group.id}>
                {group.id >= 0 ?
                  <NavLink exact to = {`/group/${group.id}`}>{group.name}</NavLink>:
                  <p>{group.name}</p>
                }
            </td>
        ] );
        teams += group.teams.length;
    }
    
    const rawSpans : { [id:number]: number } = {};
    console.log(table);
    for (let depth = 1; depth <= width; depth++ ) {
        let i = 0;
        for (let group of groups.filter ( group => group.depth === depth) ){
            rawSpans[group.id] = candidates[group.id]?candidates[group.id].reduce(
                //sum rawSpans of all groups, which are promoted into this one 
                (old, groupId) => old +
                    //if group is not in candidates, it must have rawSpan equal to 1
                    (rawSpans[groupId]? rawSpans[groupId]: 1)
            , 0):0;
            console.log("table");
            console.log(table);
            console.log(i);
            
            if(table[i]){
                table[i].push(
                    <td key={group.id} rowSpan={ rawSpans[group.id] }>
                        {group.id >= 0 ?
                          <NavLink exact to = {`/group/${group.id}`}>{group.name}</NavLink>:
                          <p>{group.name}</p>
                        }
                    </td>
                );
            };
            i += rawSpans[group.id];
            console.log(candidates);
            console.log(rawSpans);
        }
    }
    const tableRows = [];
    
    //rewrite eachline into a tr
    let i = 0;
    for ( let line of table ) {
        tableRows.push( <tr key={i}>{line}</tr> )
        i++;
    }
    
    teams = this.props.numberOfTeams? this.props.numberOfTeams: teams;
    
    return (
        <table style={{background: "none"}}>
            <thead>
                <tr>
                    <th>
                        {this.props.category.name} ({teams} tým{teams === 1 ? '' : (teams >= 2 && teams <= 4) ? 'y' : 'ů'})
                    </th>
                </tr>
            </thead>
            <tbody>
                { tableRows }
            </tbody>
        </table>
    )

    
  } // render
  
};

