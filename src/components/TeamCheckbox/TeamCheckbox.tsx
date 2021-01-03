import React from 'react';
import { Team } from 'model';
import styles from './TeamCheckbox.module.scss';


export interface TeamCheckboxProps {
    team: Team;
    registered: boolean;
    disabled: boolean;
    // function that (un)registers given team
    register: (team: Team, state: boolean) => void;
};

export class TeamCheckbox extends React.Component<TeamCheckboxProps> {
    handleChange = () => {
        this.props.register(this.props.team, !this.props.registered);
    };
    
    render() {
        return (
            <div className = {styles.teambox}>
                <p className = {styles.teamname}>{this.props.team.name}</p>
                <input
                  type = "checkbox"
                  className = {styles.teamcheckbox}
                  checked = {this.props.registered}
                  onChange = {this.handleChange}
                  disabled = {this.props.disabled}
                />
            </div>
        )
    };
    
};