import React from 'react';
import { NavLink } from 'react-router-dom';
import { CategoriesById, Team } from 'model';
import styles from './TeamCard.module.scss';

export interface TeamCardProps {
    team: Team | undefined;
    categories: CategoriesById;
};

export class TeamCard extends React.Component<TeamCardProps> {
  render() {
    if (this.props.team === undefined) {
        return false;
    }
    
    if (this.props.team === null) {
        return (
            <tr className = {styles.teamcard}>
                <td rowSpan={2}>
                    <p>
                        team does not exist
                    </p>
                </td>
            </tr>
        );
     }
     
    if ( !(this.props.team.categoryId in this.props.categories) ){
        return (
            <tr className = {styles.teamcard}>
                <td rowSpan={2}>
                    <p>
                        team's category can't be found
                    </p>
                </td>
            </tr>
        )
    }
               
    return (
            <tr className = {styles.teamcard}>
                <td className = {styles.namefield}>
                    <NavLink exact to={`/team/${this.props.team.id}`}>
                        { this.props.team.name }
                    </NavLink>
                </td>
                <td className = {styles.categoriesfield}>
                    { this.props.categories[this.props.team.categoryId].name }
                </td>
            </tr>
        );
        
    }
}