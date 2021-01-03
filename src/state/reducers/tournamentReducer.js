import { TournamentConstants, DataState } from '../constants';

export default function tournamentReducer(prevState = {}, action) {
  switch(action.type) {
    case TournamentConstants.LOAD_IN_PROGRESS:
      return {
        state: DataState.LOAD_IN_PROGRESS,
        activeTournamentId: null,
        data: undefined
      };
    case TournamentConstants.LOAD_SUCCESS:
      return {
        state: DataState.LOAD_SUCCESS,
        activeTournamentId: prevState.activeTournamentId,
        data: action.tournaments,
      };
    case TournamentConstants.LOAD_FAILED:
      return {
        state: DataState.LOAD_FAILED,
        activeTournamentId: null,
        data: null,
      };
    case TournamentConstants.ACTIVE_TOURNAMENT_CHANGED:
      return {
        state: prevState.state,
        activeTournamentId: (action.tournamentId in prevState.data)? action.tournamentId :null,
        data: prevState.data,
      }
// TODO: we should fail following actions if state is not LOAD_SUCCESS
    case TournamentConstants.DELETE_BY_ID:
      return {
        state: prevState.state,
        activeTournamentId: prevState.activeTournamentId,
        data: Object.fromEntries(Object.entries(prevState.data).filter(([id,tournament]) => tournament.id !== action.id)),
      };
    case TournamentConstants.UPDATE_BY_ID:
      return {
        state: prevState.state,
        activeTournamentId: prevState.activeTournamentId, 
        data: { ...prevState.data, [action.id]: action.payload }, 
      };
    default: 
      return prevState;
  }
}