export interface Group {
  /*
  Each group belongs to a category. If
  a group is started, it contains teams.
  
  Each group have a "depth". Groups with
  depth 1 are the first which are played.
  It means there is no need to be promoted
  to them. If a group have depth > 1,
  only teams which were promoted can
  play in them.
  
  To play in a group with depth X, where
  X > 1, team must end up in one of the
  "promotion" positoins in any group
  with depth X-1.
  */
  
    id: number;                                                        //group's ID
    categoryId: number;                                                  //ID of a category to which the group belongs
    name: string;                                                      //group's name
    teams: number[];                                                   //a list of IDs of teams in the group
    depth: number;                                                     //the depth of a group (see description for more details)
    promotionId: number | undefined;                                     //to which group is winner promoted; if undefined, this is the final group
}

export interface GroupsById {
    [id:number]: Group;
}

export interface GroupsByCategory {
    [id:number]: { [id:number]: Group },
}

export interface GroupsByDepth {
    [id:number]: {[id:number]: Group },
}