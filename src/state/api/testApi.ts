

interface ItemWithId {
    id: number,                                               
}

export const testApi = class TestApi {
    static getAllCategories() : Promise<{ [id:number] : ItemWithId }> {
        return Promise.resolve({
            1: {id: 1, name: "HOŠI ml.", gender: "M", gradeMin: 1, gradeMax: 4},
            2: {id: 2, name: "DÍVKY ml.", gender: "F", gradeMin: 1, gradeMax: 4},
            3: {id: 3, name: "HOŠI st.", gender: "M", gradeMin: 5, gradeMax: 8},
            4: {id: 4, name: "DÍVKY st.", gender: "F", gradeMin: 5, gradeMax: 8},
       });
    }
    
    static getAllGrades() : Promise<{ [id:number] : ItemWithId }> {
       return Promise.resolve({
          1: {id: 1, suffix: "A", gradeMin: 5, gradeMax: 8},
          2: {id: 2, suffix: "B", gradeMin: 5, gradeMax: 8},
          3: {id: 3, suffix: "C", gradeMin: 3, gradeMax: 8},
          4: {id: 4, suffix: "E", gradeMin: 1, gradeMax: 8},
       });
    }
    
    static getAllGroups() : Promise<{ [id:number] : ItemWithId }> {
        return Promise.resolve({
            1: {id: 1, categoryId: 1, name: "A", promotionId: null, teams: [1, 2, 3, 4, 5, 6], depth: 0},
            2: {id: 2, categoryId: 2, name: "B", promotionId: null, teams: [7, 8, 9, 10], depth: 0},
            3: {id: 3, categoryId: 3, name: "C", promotionId: 7, teams: [11, 12, 13, 14, 15], depth: 0},
            4: {id: 4, categoryId: 3, name: "D", promotionId: 7, teams: [16, 17, 18, 19], depth: 0},
            5: {id: 5, categoryId: 3, name: "E", promotionId: 7, teams: [20, 21, 22, 23], depth: 0},
            6: {id: 6, categoryId: 4, name: "G", promotionId: null, teams: [24, 25, 26, 27], depth: 0},
            7: {id: 7, categoryId: 3, name: "FH", promotionId: null, teams: [17, 22, 11], depth: 1},
        });
    }

    static getAllTeams() : Promise<{ [id:number] : ItemWithId }> {
        return Promise.resolve({
            1: {id: 1, name: "P-E", categoryId: 1, gradePlanId: 4, grade: 1},
            2: {id: 2, name: "S-E", categoryId: 1, gradePlanId: 4, grade: 2},
            3: {id: 3, name: "1.C", categoryId: 1, gradePlanId: 3, grade: 3},
            4: {id: 4, name: "2.C", categoryId: 1, gradePlanId: 3, grade: 4},
            5: {id: 5, name: "T-E", categoryId: 1, gradePlanId: 4, grade: 3},
            6: {id: 6, name: "K-E", categoryId: 1, gradePlanId: 4, grade: 4},
            7: {id: 7, name: "1.E", categoryId: 2, gradePlanId: 4, grade: 1},
            8: {id: 8, name: "3.E", categoryId: 2, gradePlanId: 4, grade: 3},
            9: {id: 9, name: "2.C", categoryId: 2, gradePlanId: 3, grade: 4},
            10: {id: 10, name: "4.E", categoryId: 2, gradePlanId: 4, grade: 4},
            11: {id: 11, name: "8.E", categoryId: 3, gradePlanId: 4, grade: 8},
            12: {id: 12, name: "4.C", categoryId: 3, gradePlanId: 3, grade: 6},
            13: {id: 13, name: "3.C", categoryId: 3, gradePlanId: 3, grade: 5},
            14: {id: 14, name: "2.A", categoryId: 3, gradePlanId: 1, grade: 6},
            15: {id: 15, name: "3.A", categoryId: 3, gradePlanId: 1, grade: 7},
            16: {id: 16, name: "4.B", categoryId: 3, gradePlanId: 2, grade: 8},
            17: {id: 17, name: "6.E", categoryId: 3, gradePlanId: 4, grade: 6},
            18: {id: 18, name: "2.B", categoryId: 3, gradePlanId: 2, grade: 6},
            19: {id: 19, name: "3.B", categoryId: 3, gradePlanId: 2, grade: 7},
            20: {id: 20, name: "7.E", categoryId: 3, gradePlanId: 4, grade: 7},
            21: {id: 21, name: "6.C", categoryId: 3, gradePlanId: 3, grade: 8},
            22: {id: 22, name: "1.B", categoryId: 3, gradePlanId: 2, grade: 5},
            23: {id: 23, name: "5.E", categoryId: 3, gradePlanId: 4, grade: 5},
            24: {id: 24, name: "8.E", categoryId: 4, gradePlanId: 4, grade: 8},
            25: {id: 25, name: "3.B", categoryId: 4, gradePlanId: 2, grade: 7},
            26: {id: 26, name: "5.C", categoryId: 4, gradePlanId: 3, grade: 7},
            27: {id: 27, name: "1.A", categoryId: 4, gradePlanId: 1, grade: 5},
        });
    }

    static getAllMatches() : Promise<{ [id:number] : ItemWithId }> {
        return Promise.resolve({
            1: {id: 1, categoryId: 1, groupId: 1, teamA: 1, teamB: 2, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            2: {id: 2, categoryId: 1, groupId: 1, teamA: 1, teamB: 3, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            3: {id: 3, categoryId: 1, groupId: 1, teamA: 1, teamB: 4, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            4: {id: 4, categoryId: 1, groupId: 1, teamA: 1, teamB: 5, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            5: {id: 5, categoryId: 1, groupId: 1, teamA: 1, teamB: 6, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            6: {id: 6, categoryId: 1, groupId: 1, teamA: 2, teamB: 3, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            7: {id: 7, categoryId: 1, groupId: 1, teamA: 2, teamB: 4, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            8: {id: 8, categoryId: 1, groupId: 1, teamA: 2, teamB: 5, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            9: {id: 9, categoryId: 1, groupId: 1, teamA: 2, teamB: 6, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            10: {id: 10, categoryId: 1, groupId: 1, teamA: 3, teamB: 4, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            11: {id: 11, categoryId: 1, groupId: 1, teamA: 3, teamB: 5, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            12: {id: 12, categoryId: 1, groupId: 1, teamA: 3, teamB: 6, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            13: {id: 13, categoryId: 1, groupId: 1, teamA: 4, teamB: 5, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            14: {id: 14, categoryId: 1, groupId: 1, teamA: 4, teamB: 6, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            15: {id: 15, categoryId: 1, groupId: 1, teamA: 5, teamB: 6, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            16: {id: 16, categoryId: 3, groupId: 4, teamA: 17, teamB: 16, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            17: {id: 17, categoryId: 3, groupId: 7, teamA: 11, teamB: 17, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
            18: {id: 18, categoryId: 3, groupId: 7, teamA: 17, teamB: 22, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1},
        });
    }
    
    static getAllTournaments() : Promise<{ [id:number] : ItemWithId }> {
        return Promise.resolve({
            1: {id: 1, year: 2019, name: "test", isRegistrationOpen: true, isSetupOpen: true},
        });
    }
    
    static startMatch(id: number) : Promise<ItemWithId> {
        return Promise.resolve({id: 1, categoryId: 1, groupId: 1, teamA: 1, teamB: 2, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1});
    }
    
    static finishMatch(id: number) : Promise<ItemWithId> {
        return Promise.resolve({id: 1, categoryId: 1, groupId: 1, teamA: 1, teamB: 2, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1});
    }
    
    static scoreGoalA(id: number) : Promise<ItemWithId> {
        return Promise.resolve({id: 1, categoryId: 1, groupId: 1, teamA: 1, teamB: 2, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1});
    }
    
    static scoreGoalB(id: number) : Promise<ItemWithId> {
        return Promise.resolve({id: 1, categoryId: 1, groupId: 1, teamA: 1, teamB: 2, estimatedStart: null, finished: false, started: false, scoreA: 3, scoreB: 1}); 
    }
     
 
    static createTeam(team: ItemWithId) : Promise<ItemWithId> {
        return Promise.resolve(team);
    }
       
    static updateTeam(team: ItemWithId) : Promise<ItemWithId> {
        return Promise.resolve(team);
    }
    
    static deleteTeam(id: number) : Promise<{}> {
        return Promise.resolve({});
    }
    
    static createGroup(group: ItemWithId) : Promise<ItemWithId> {
        return Promise.resolve(group);
    }
    
    static deleteGroup(id: number) : Promise<{}> {
        return Promise.resolve({});
    }                 
    
    static prepareGroups(tournamentSetup: ItemWithId) : Promise<{}> {
        return Promise.resolve(
          [
            [
              {"categoryId":1,"members":6,"slices":[3,1]},
              {"categoryId":2,"members":10,"slices":[]},
              {"categoryId":3,"members":0,"slices":[]}
            ]
          ]
        );
    }
    
    static saveGroups(tournamentSetup: ItemWithId) : Promise<{}> {
        return Promise.resolve(
          {}
        );
    }
    
    static closeRegistrations(tournamentId: number) : Promise<{}> {
        return Promise.resolve({});
    }
    
    static openRegistrations(tournamentId: number) : Promise<{}> {
        return Promise.resolve({});
    }
    
    static closeSetup(tournamentId: number) : Promise<{}> {
        return Promise.resolve({});
    }
    
    static openSetup(tournamentId: number) : Promise<{}> {
        return Promise.resolve({});
    }
    
    static _getAllItems(url: string) : Promise<{ [id:number] : ItemWithId }>{
        return Promise.resolve({});
    }
    
    static _alterMatchState(id: number, method: string) : Promise<ItemWithId>{
        return Promise.resolve({id:0});
    }
    
    static draftTeams(tournamentId: number, categoriesId: number[]) : Promise<{}> {
        return Promise.resolve({});
    }
    
    static draftMatches(tournamentId: number, categoriesId: number[]) : Promise<{}> {
        return Promise.resolve({});
    }
}