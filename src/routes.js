import React from 'react';
import { Switch, Route } from 'react-router';
import { HomePage, LoginPage, Categories, Plan, GroupDetail, MatchDetail, Schedule, TeamDetail, TeamList, TournamentSetup, TournamentDelete, TeamRegistration, ChooseTournament, DndContainer, Wizard, TeamDraft } from 'containers';


const DnDCards = [
        [
			{
				id: 1,
				text: 'Write a cool JS library',
			},
			{
				id: 2,
				text: 'Make it generic enough',
			},
			{
				id: 3,
				text: 'Write README',
			},
			{
				id: 4,
				text: 'Create some examples',
			},
			{
				id: 5,
				text:
					'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
			},
			{
				id: 6,
				text: '???',
			},
			{
				id: 7,
				text: 'PROFIT',
			},
		]
];

const routesForTournament =
  <Switch>
    { /* <PrivateRoute exact path="/" component={HomePage} /> */ }
    <Route path="/login" component={LoginPage} />
    <Route path="/dnd" render={(props) => {console.log(DnDCards);return <DndContainer cards={DnDCards}/>}}/>
    { /* <Route exact path="/match"><Redirect to="/schedule"/></Route> */ }
    <Route exact path="/" component={HomePage} />
    <Route path="/categories" component={Categories} />
    <Route exact path="/match" component={Schedule} />
    <Route exact path="/group" component={Plan} />
    <Route exact path="/team" component={TeamList} />
    <Route exact path="/setup" component={TournamentSetup} />
    <Route exact path="/delete" component={TournamentDelete} />
    <Route exact path="/registration" component={TeamRegistration} />
    <Route exact path="/wizard" component={Wizard} />
    <Route exact path="/draft" component={TeamDraft} />
    { /* see https://stackoverflow.com/questions/35352638/react-how-to-get-parameter-value-from-query-string       */ }
    <Route path="/team/:teamId" render={(props) => <TeamDetail teamId={props.match.params.teamId} />} />
    <Route path="/group/:groupId" render={(props) => <GroupDetail groupId={props.match.params.groupId} />} />
    <Route path="/match/:matchId" render={(props) => <MatchDetail matchId={props.match.params.matchId} />} />
    { /* <Route exact path="/registration" component={TeamRegistration} />, */ }
    
  </Switch>

const defaultRoutes = <>
    <Route path="/login" component={LoginPage} />
    <Route path="/dnd" component={DndContainer} />
    <Route exact path="/" component={ChooseTournament} />
</>;
  
export {routesForTournament, defaultRoutes}