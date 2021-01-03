import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend'
import {isMobile} from 'react-device-detect';
import { DndProvider } from 'react-dnd'
import { connect } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import SockJsClient from "react-stomp";
import { userActions, categoryActions, gradeActions, teamActions, groupActions, matchActions, tournamentActions, registrationActions } from './state';
import { routesForTournament, defaultRoutes } from './routes';
import { ToolBar } from './components';
import { TeamsById } from './model';
import { DataState } from './state/constants';
//import { registrationActions } from './state/actions';

interface AppProps {
    dispatch: any,
    alert: any,
    categories: any,
    groups: any,
    teams: {
       state: DataState,
       data: TeamsById,
    }
    matches: any,
    registrations: {
       state: DataState,
       data: TeamsById,
    },
    tournaments: {
      activeTournamentId: number | null
    }
};

interface AppState {
    clientConnected: boolean,
};

class _App extends React.Component<AppProps, AppState> {
  clientRef: any;
  
  constructor(props:any) {
    super(props);
    this.state = {
        clientConnected: false,
    }
  } 

  // see https://appdividend.com/2017/11/02/simple-redux-create-delete-contact-application/#Step_8_We_need_to_connect_this_store_to_the_Appjs_component
  // and https://stackoverflow.com/questions/40911194/how-do-i-add-an-element-to-array-in-reducer-of-react-native-redux
  onMessageReceive = (msg:any, topic:string) => {
    console.log("onMessageReceive:"); console.log(topic); console.log(msg);
    if (topic.startsWith("/topic/updates/")) {
      const path = topic.split('/');
      if (path.length !== 5) {
         console.warn("unsupported topic: " + topic);
         return;
      }
      // capitalize first letter
      const entity = path[3].toUpperCase(); 
      // path[3].charAt(0).toUpperCase() + path[3].slice(1);
      const id = parseInt(path[4]);
      if (msg === null) {
        this.props.dispatch({ type: `DELETE_${entity}_BY_ID`, id: id });
      } else {
        this.props.dispatch({ type: `UPDATE_${entity}_BY_ID`, id: id, payload: msg});
      }                                                                            
    }
  }
  
componentDidMount() {
  this.props.dispatch(userActions.refreshToken());
  this.props.dispatch(categoryActions.loadCategories());
  this.props.dispatch(teamActions.loadTeams());
  this.props.dispatch(groupActions.loadGroups());
  this.props.dispatch(matchActions.loadMatches());
  this.props.dispatch(gradeActions.loadGrades());
  this.props.dispatch(tournamentActions.loadTournaments());
}
  
render() {
  const wsSourceUrl = process.env.REACT_APP_WEBSOCKET_URL;
  const { alert } = this.props;
  
  /*if (this.props.tournaments.state === DataState.LOAD_IN_PROGRESS){
    return <div>Loading</div>
  }
  if (this.props.tournaments.state !== DataState.LOAD_SUCCESS){
    return <div>Loading failed</div>
  } */
  
  return (
  <DndProvider backend={isMobile? TouchBackend: HTML5Backend}>
  <div>
    {alert && alert.message &&
        <div className={`alert ${alert.type}`}>{alert.message}</div>
    }
    
    <Router>
            
        <ToolBar/>
        
        {this.props.tournaments.activeTournamentId? routesForTournament: defaultRoutes}
        
        <div>
          {<SockJsClient url={ wsSourceUrl } topics={["/topic/updates/**"]}
            onMessage={ this.onMessageReceive } ref={ (client:any) => { this.clientRef = client }}
            onConnect={ () => { this.setState({ clientConnected: true }) } }
            onDisconnect={ () => { this.setState({ clientConnected: false }) } }
            debug={ false }/>}
          <section id="body">
            <div id="overlay"></div>
            <div className="padding highlightable"></div>

          </section>
        </div>

    </Router>
  </div>
  </DndProvider>
  );
  
  } // render
  
  
handleSaveRegistrations() {
    this.props.dispatch(registrationActions.saveAll(this.props.registrations.data));

    /*
    Object.entries(this.props.registrations.data).forEach(([key, value]) => {
        const k:number = parseInt(key);
        const team:Team = value;
        // TODO: update name if changed
        if (value !== null && !this.props.teams.data[k]) {
           console.log("creating team " + k);
           console.log(team);
           this.props.dispatch(registrationActions.createRegistration(team));
        } else if (k >= 0 && value === null) {
           console.log("deleting team " + k);
           console.log(this.props.teams.data[k]);
           this.props.dispatch(registrationActions.deleteRegistration(k));
        }
    })
    */
}
  
}; 


function mapStateToProps(state: any) {
  const { alert, categories, teams, groups, matches, registrations, tournaments } = state;
  return {
    alert,
    categories,
    teams,
    groups,
    matches,
    registrations,
    tournaments,
  };
} 

const mapDispatchToProps = (dispatch:any) => {
  return {
    dispatch
  }
}

export const App =  connect(
  mapStateToProps,
  mapDispatchToProps
)(_App)