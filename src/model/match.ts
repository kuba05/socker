/**
  A match is duel of two teams (called 
  teamA and teamB). Each match belongs
  to a single group.
  
  Match have a score to. If a match
  wasn't played yet, score should be
  undefined. 
*/
export interface Match {
    id: number;
    categoryId: number;
    groupId: number;
    teamA: number;
    scoreA: number | undefined;
    teamB: number;
    scoreB: number | undefined;
    started: boolean,
    finished: boolean,
    updateInProgress: boolean | undefined;
}

/*export interface MatchWithNames extends Match {
//    groupName: string;
    nameA: string;
    nameB: string;
} */


export interface MatchesById {
    [id:number]: Match;
}

export interface MatchesByTeam {
    [id:number]: MatchesById;
}

export interface MatchesByGroup {
    [id:number]: MatchesById;
}