import React from 'react';
import { Team } from 'model';
import { TeamCheckbox } from 'components';

interface Registration { 
    id: number|undefined; 
    registered: boolean; 
    name: string 
}

interface RegistrationsByGradePlanAndGrade {
    [id:number] : { [id:number]: Registration } 
};

export interface TeamRegistrationProps {
    categoryId: number;
    registrations: RegistrationsByGradePlanAndGrade;
    gradeMin: number;
    gradeMax: number;
    isSaving: boolean;
    register: any;
    tournamentId: number | null;
};


export class TeamRegistrationForCategory extends React.Component<TeamRegistrationProps> {

  register(team: Team, registered: boolean) {
      this.props.register(team,registered);
  }
  
  render() {
      const rows: any[] = [];
      
//console.log(this.props.registrations);
      Object.keys(this.props.registrations).forEach( (key) => {
          const gradePlanId: number = parseInt(key);
          const grades = this.props.registrations[gradePlanId];
          let row: any[] = [];
          for (let i = this.props.gradeMin; i < parseInt(Object.keys(grades)[0]); i++) {
              row.push(<td key={i}/>);
          }
//console.log(grades);
          Object.entries(grades).forEach( ([key, value] ) => {
              const grade: number = parseInt(key);
              const registration: Registration =  value; 
              const team = {
                              id: registration.id !== undefined? registration.id: -1,
                              name: registration.name,
                              categoryId: this.props.categoryId,
                              gradePlanId: gradePlanId,
                              grade: grade,
                              tournamentId: this.props.tournamentId,
                          };
              row.push(
                  <td key = {grade}>
                      <TeamCheckbox
                        team = {team}
                        registered = { registration.registered }
                        register = { this.register.bind(this) }
                        disabled = { this.props.isSaving }
                      />
                  </td>
              );
          })
          for (let i = parseInt(Object.keys(grades)[-1]) + 1; i <= this.props.gradeMax; i++) {
              row.push(<td key={i}/>);
          }
          rows.push(<tr key={gradePlanId}>{row}</tr>)
      });
      return (
          <>
          <table>
              <tbody>
                  {rows}
              </tbody>
          </table>
          {/*<button className="btn btn-primary" onClick={ this.props.handleSave } >Save</button>*/}
          </>
      );
  
  } //render
  
}