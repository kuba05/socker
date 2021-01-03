export interface Team {
    id: number;                                                       //team's ID
    categoryId: number;                                               //team's category's ID
    gradePlanId: number;
    name: string;                                                     //team's name
    grade: number;
    tournamentId: number | undefined | null;
}

export interface TeamsById {
    [id:number]: Team;
}

export interface TeamsByGroup {
    [id:number]: TeamsById;
}

export interface ProvisionalTeam {                                    //used in team selection
    name: string;                                                     //team's name
    registred: boolean;
    grade: number;
    gradePlanId: number;
}