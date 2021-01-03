import React from 'react';
import { NavLink } from 'react-router-dom';

export class HomePage extends React.Component {
 
  render() {
    return (
        <React.Fragment>
	    <NavLink exact to='/categories'>
	        <div>Kategorie</div>
	    </NavLink>
	    <NavLink exact to='/group'>
	        <div>Pavouk</div>
	    </NavLink>
	    <NavLink exact to='/match'>
	        <div>Rozvrh</div>
	    </NavLink>
	    <NavLink exact to='/group/1'>
	        <div>Skupina #1</div>
	    </NavLink>
	    <NavLink exact to='/match/1'>
	        <div>Zápas #1</div>
	    </NavLink>
        <NavLink exact to='/team/1'>
	        <div>Tým #1</div>
	    </NavLink>
      <NavLink exact to='/registration'>
	        <div>Registrace týmů</div>
	    </NavLink>
      <NavLink exact to='/delete'>
	        <div>Smazaní stareho turnaje</div>
	    </NavLink>
        <NavLink exact to='/setup'>
            <div>Setup Tournament</div>
        </NavLink>
        <NavLink exact to='/dnd'>
            <div>Drag and Drop demo</div>
        </NavLink>
        <NavLink exact to='/wizard'>
            <div>wizard</div>
        </NavLink>
        </React.Fragment>
    );
  } // render
};

