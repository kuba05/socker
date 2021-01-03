import React from 'react';
import { NavLink } from 'react-router-dom';
import { Group, Team, Match } from 'model';
import styles from './GroupTable.module.scss';

const pointStrategy = { win: 3, draw: 1, lose: 0 };

export interface GroupTableProps {
    group: Group | null,
    teams: { [id:number]: Team },
    matchesByTeam: { [id:number]: { [id:number]: Match } },
};

export class GroupTable extends React.Component<GroupTableProps> {
  
  getMatchByTeams(teamA: number, teamB: number): Match | null {
     if (this.props.matchesByTeam === null || this.props.matchesByTeam === undefined) return null;
     if (!(teamA in this.props.matchesByTeam)) return null;
     if (!(teamB in this.props.matchesByTeam[teamA])) return null;
     return this.props.matchesByTeam[teamA][teamB];
  }
  
  render() {
    if (this.props.group === null || this.props.group === undefined){
        return (<h1>Group does no exist!</h1>)
    }
    
    const teamIds:number[] = Object.keys(this.props.teams).map((id:string) => parseInt(id));

    let computeOrder:boolean = true 
    const points = []
    const rows:any = []
    for (let teamA of teamIds) {
        let pointsA = 0;
        const score = [0,0]
        const row = []
        for (let teamB of teamIds) {
            if (teamA === teamB) {
               row.push(<td key={teamB}>{this.props.group.name}</td>)
               continue
            }
      const ids = teamA < teamB? [teamA, teamB]: [teamB, teamA]
      const match = this.getMatchByTeams(ids[0], ids[1])
            if (match === null) {
               computeOrder = false
               row.push(<td key={teamB}>-</td>)
               continue
            }
            if (match.scoreA === undefined || match.scoreB === undefined){
                computeOrder = false
                row.push(
                    <td key={teamB}>
                        <NavLink exact to={`/match/${match.id}`}
                            className={styles.matchLink}
                            activeClassName={styles.active}>
                                -
                        </NavLink>
                    </td>
                )
                continue
            }
            if (match.scoreA === null || match.scoreB === null){
                computeOrder = false
                row.push(
                    <td key={teamB}>
                        <NavLink exact to={`/match/${match.id}`}
                            className={styles.matchLink}
                            activeClassName={styles.active}>
                                -
                        </NavLink>
                    </td>
                )
               continue
            }
            const scores = teamA < teamB? [match.scoreA, match.scoreB]: [match.scoreB, match.scoreA]
            pointsA += pointStrategy[ (scores[0] > scores[1]) ? 'win' : (scores[0] < scores[1]? 'lose': 'draw')  ]
            row.push(<td key={teamB}> <NavLink exact to={`/match/${match.id}`} className={styles.matchLink}>  {scores[0]}:{scores[1]} </NavLink> </td>)
            score[0] += scores[0]
            score[1] += scores[1]
        }
        row.push(<td key='score'>{score[0]}:{score[1]}</td>)
        // we need to keep points as number to allow comparison below
        row.push(pointsA)
        points.push(pointsA)
        rows[teamA] = row
    }

    const order: { [id:number] :string } = {}
    // sort numericaly descending
    points.sort((n1,n2) => n2 - n1)
    let low = 0
    let high = 0
    // zip ranges
    while (low < points.length) {
        while (high < points.length && points[low] === points[high]) high++;
        order[points[low]] = (high === low+1) ? `${low+1}.` : `${low+1}. - ${high}.`
        low = high
    }
    // add order column
    for(let teamA of teamIds) {
        let row = rows[teamA];
        const points = row[row.length-1];
        row[row.length-1] = <td key='points'>{points}</td>
        if (computeOrder) {
            row.push(<td key='order'>{order[points]}</td>)
        }
    }
  
    const tableRows = teamIds.map((teamA: number) =>
        <tr key={teamA}>
            <td>
                <NavLink exact to={`/team/${teamA}`}
                    className={styles.component}
                    activeClassName={styles.active}>
                        {this.props.teams[teamA].name}
                </NavLink>
            </td>
            {
                rows[teamA]
            }
        </tr>
    );

    const headers = teamIds.map((id: number) => { 
        return <th key={id}>
            <NavLink to={`/team/${id}`} 
                className={styles.component}
                activeClassName={styles.active}>
                    {this.props.teams[id].name}
            </NavLink> 
        </th>
    });

    return (
        <table>
          <thead>
            <tr>
              <th>{this.props.group!.name}</th>
              {headers}
              <th>skóre</th>
              <th>body</th>
              <th>pořadí</th>
            </tr>
          </thead>
          <tbody>
            {tableRows}
          </tbody>
        </table>
    );

    } // render
    
};

