export interface Tournament {                                          
  /*
  Tournament is the biggest unit. It 
  means that a tournament doesn't belong
  to anything.
  
  A tournament contains categories. Each
  tournament have alsoit's name and
  the year, in which it's played.
  */
                                                                       
    id: number;                                                        //tournament's ID
    year: number;                                                      //the year, in which the tournament was played
    name: string;                                                      //tournament's name
    isRegistrationOpen: boolean;
    isSetupOpen: boolean;
}

export interface TournamentsById {
  [id:number]: Tournament
}

export interface TournamentSetup {
  numberOfMatchesPerDay: number;
  categoryIdsPerDays: number[][];
}