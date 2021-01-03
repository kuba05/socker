import { Link } from 'react-router-dom';
import React from 'react';
import Breadcrumbs from 'react-router-dynamic-breadcrumbs';
import { connect } from 'react-redux';
import { DataState } from '../../state/constants';
import { userActions } from '../../state';

import { TeamsById, GroupsById, MatchesById } from 'model';

interface ToolBarProps {
    dispatch: any,
    user: any,
    matches: {
       state: DataState,
       data: MatchesById,
    }
    teams: {
       state: DataState,
       data: TeamsById,
    }
    groups: {
       state: DataState,
       data: GroupsById,
    }
};

const getNameOrUndefined = (entities: {state: DataState, data: {[index:number]: {name:string}}}, index:number) => {
    if (DataState.LOAD_SUCCESS === entities.state) { 
      const entity = entities.data[index];
      return entity !== undefined? entity.name: undefined;
    }
    return index;
}


class _ToolBar extends React.Component<ToolBarProps> {
  handleLogout()  {
    console.log("handleLogout triggered");
    this.props.dispatch(userActions.logout());
  }
 
  render() {
    const { user } = this.props;
    const routes = {
        '/index' : null,
        '/categories' : "Kategorie",
        '/team' : "Týmy",
        '/group' : "Pavouk",
        '/match' : "Rozvrh",
        '/registration' : 'Registrace',
        '/team/:teamId' : (url: any, urlMatch: any) => getNameOrUndefined(this.props.teams, urlMatch.teamId),
        '/group/:groupId' : (url: any, urlMatch: any) => { const n=getNameOrUndefined(this.props.groups, urlMatch.groupId); return n? "Skupina " + n: n; },
        '/match/:matchId' : (url: any, urlMatch: any) => {
            let match = DataState.LOAD_SUCCESS === this.props.matches.state ? this.props.matches.data[parseInt(urlMatch.matchId)] : undefined;
            console.log(url,urlMatch);
            return ( (match) ?
              ( getNameOrUndefined(this.props.teams, match.teamA) + " vs " + getNameOrUndefined(this.props.teams, match.teamB) ):
              ( undefined ));
        },
    };
    return (
        <div className="col-md-6 col-md-offset-3">
        {user && user.preferred_username && 
        <div>
            <h1>Hi {user.preferred_username}!</h1>
            <p>You're logged in with React!!</p>
        </div>    
        }
            <p>
            {user === undefined && <Link to="/login">Login</Link>}
            {user && <Link to="/" onClick={this.handleLogout.bind(this)}>Logout</Link>}
            </p>

            <div id='top-bar' className='hide-in-iframe'>
                <div id='breadcrumbs' className='hide-in-iframe'>
                    <Breadcrumbs 
                      mappedRoutes={routes}
                      rootName="Home"
                      />
                </div>
            </div>
        </div>
    );
  } // render
};


interface StoreState {  
    authentication: any,
    matches: {
       state: DataState,
       data: MatchesById,
    }
    teams: {
       state: DataState,
       data: TeamsById,
    }
    groups: {
       state: DataState,
       data: GroupsById,
    }
};

function mapStateToProps(state: StoreState) {
    const { authentication } = state;
    const { user } = authentication;
    return {
        user,
        matches: state.matches,
        teams: state.teams,
        groups: state.groups, 
    };
}
  
export const ToolBar = connect(
   mapStateToProps,
)(_ToolBar);
