import { authHeader } from '../helpers';
import { testApi } from './testApi';

const TEST = process.env.REACT_APP_USING_FAKE_API === "true";

const SERVER_URL=process.env.REACT_APP_API_URL;
//const AUTH_HEADERS=new Headers({'Authorization': 'Basic '+btoa('user:password'), });

interface ItemWithId {
    id: number,
}

export class _Api {
    static getAllCategories() : Promise<{ [id:number] : ItemWithId }> {
        return this._getAllItems('/categories');
    }
    
    static getAllGrades() : Promise<{ [id:number] : ItemWithId }> {
        return this._getAllItems('/grades');
    }
    
    static getAllGroups() : Promise<{ [id:number] : ItemWithId }> {
        return this._getAllItems('/groups');
    }

    static getAllTeams() : Promise<{ [id:number] : ItemWithId }> {
        return this._getAllItems('/teams');
    }

    static getAllMatches() : Promise<{ [id:number] : ItemWithId }> {
        return this._getAllItems('/matches');
    }
    
    static getAllTournaments() : Promise<{ [id:number] : ItemWithId }> {
        return this._getAllItems('/tournaments');
    }
    
    static async _getAllItems(url: string) : Promise<{ [id:number] : ItemWithId }> {
        // console.log("fetching " + url);
        // const token = localStorage.getItem("react-token");
        //const user = JSON.parse(localStorage.getItem('user'));
        //const token = user.token;
        //if (user !== undefined && user.token !== undefined) {
        //return { 'Authorization': 'Bearer ' + user.token };
        // dispatch(itemsIsLoading(true));
        return fetch(SERVER_URL + url, {
              method: 'get', 
              // headers: AUTH_HEADERS,
              headers: authHeader(), 
              // new Headers( {'Authorization': 'Bearer ' + user.token} ),
          })
//        .then(response => response.json()
          .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              const items: { [id:number] : ItemWithId } = {};
              (await data.json()).forEach((item:ItemWithId) => {
                 items[item.id] = {id: item.id, ...item};
              })
              return items;
          });
    }  
    
    static startMatch(id: number) : Promise<ItemWithId> {
        const x = this._alterMatchState(id, "start");
        console.log(x);
        return x;
    }               
    
    static finishMatch(id: number) : Promise<ItemWithId> {
        return this._alterMatchState(id, "stop");
    }
    
    static scoreGoalA(id: number) : Promise<ItemWithId> {
        return this._alterMatchState(id, "scoreGoalA");
    }
    
    static scoreGoalB(id: number) : Promise<ItemWithId> {
        return this._alterMatchState(id, "scoreGoalB");
    }

    static _alterMatchState(id: number, method: string) : Promise<ItemWithId> {
        return fetch(SERVER_URL + "/matches/" + id + "/" + method, {
              method: 'put', 
              headers: authHeader(), 
          })
          .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return data.json();
          });
    } 
 
    static createTeam(team: ItemWithId) : Promise<ItemWithId> {
        return fetch(SERVER_URL + "/teams", {
              method: 'post', 
              headers: authHeader({ 'Content-Type': 'application/json'}),
              body: JSON.stringify(team),
          })
          .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return data.json();
          });
    }
       
    static updateTeam(team: ItemWithId) : Promise<ItemWithId> {
        return fetch(SERVER_URL + "/teams/" + team.id, {
              method: 'put', 
              headers: authHeader({ 'Content-Type': 'application/json' }),
              body: JSON.stringify(team),
          })
          .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return data.json();
          });
    }
    
    static deleteTeam(id: number) : Promise<{}> {
        return fetch(SERVER_URL + "/teams/" + id, {
              method: 'delete', 
              headers: authHeader(), 
          })
          .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return {};
          });
    }          
    
    static createGroup(group: ItemWithId) : Promise<ItemWithId> {
        return fetch(SERVER_URL + "/groups", {
              method: 'post', 
              headers: authHeader({ 'Content-Type': 'application/json'}),
              body: JSON.stringify(group),
          })
          .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return data.json();
          });
    }
    
        
    static deleteGroup(id: number) : Promise<{}> {
        return fetch(SERVER_URL + "/groups/" + id, {
              method: 'delete', 
              headers: authHeader(), 
          })
          .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return {};
          });
    }
    
    
    static prepareGroups(tournamentSetup: ItemWithId) : Promise<{}> {
        return fetch(SERVER_URL + "/tournaments/" + tournamentSetup.id + "/prepareGroups", {
              method: 'post', 
              headers: authHeader({ 'Content-Type': 'application/json'}),
              body: JSON.stringify(tournamentSetup),
        })
        .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return data.json();
        });
    }
    
    
    static saveGroups(tournamentSetup: ItemWithId) : Promise<{}> {
        return fetch(SERVER_URL + "/tournaments/" + tournamentSetup.id + "/createGroups", {
              method: 'post',
              headers: authHeader({ 'Content-Type': 'application/json'}),
              body: JSON.stringify(tournamentSetup),
        })
        .then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
//              console.log("DATA GROUPS SAVED");
//              console.log(data.json());
              return data.json();
        });
    }
    
    static closeRegistrations(tournamentId: number) : Promise<{}> {
        return fetch(SERVER_URL + "/tournaments/" + tournamentId + "/closeRegistrations", {
              method: 'put',  // should be post !! 
              headers: authHeader({ 'Content-Type': 'application/json'})
        }).then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return {};
        });
    }
    
    static openRegistrations(tournamentId: number) : Promise<{}> {
        return fetch(SERVER_URL + "/tournaments/" + tournamentId + "/openRegistrations", {
              method: 'put',  // should be post !! 
              headers: authHeader({ 'Content-Type': 'application/json'})
        }).then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return {};
        });
    }
    
    static closeSetup(tournamentId: number) : Promise<{}> {
        return fetch(SERVER_URL + "/tournaments/" + tournamentId + "/closeSetup", {
              method: 'put',  // should be post !! 
              headers: authHeader({ 'Content-Type': 'application/json'})
        }).then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return {};
        });
    }
    
    static openSetup(tournamentId: number) : Promise<{}> {
        return fetch(SERVER_URL + "/tournaments/" + tournamentId + "/openSetup", {
              method: 'put',  // should be post !! 
              headers: authHeader({ 'Content-Type': 'application/json'})
        }).then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return {};
        });
    }
    
    static draftTeams(tournamentId: number, categoriesId: number[]) : Promise<{}> {
        return fetch(SERVER_URL + "/tournaments/" + tournamentId + "/draftTeams", {
              method: 'post',  // should be post !! 
              headers: authHeader({ 'Content-Type': 'application/json'}),
              body: JSON.stringify(categoriesId)
        }).then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return {};
        });
    }
    
    static draftMatches(tournamentId: number, categoriesId: number[]) : Promise<{}> {
        return fetch(SERVER_URL + "/tournaments/" + tournamentId + "/draftMatches", {
              method: 'post',  // should be post !! 
              headers: authHeader({ 'Content-Type': 'application/json'}),
              body: JSON.stringify(categoriesId)
        }).then(async response => {
              const data = await response;
              // check for error response
              if (!response.ok) {
                  // get error message from body or default to response status
                  let error;
                  try { 
                    const d = await data.json();
                    console.log(d); 
                    error = (d && d.message) || response.status;
                  }
                  catch { error = response.status }
                  // console.log(error);
                  return Promise.reject(error);
              }
              return {};
        });
    }
}

let exportApi = _Api;

if (TEST) {
    exportApi = testApi;
}

export const Api = exportApi;