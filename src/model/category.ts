export interface Category {
  /*
  Each category is played separately. It
  contains some groups and teams.
  
  Groups can be placed into diferend 
  "depth". If some group have depth > 1,
  you need to be promoted into it from 
  group with depth of one less. Each
  team starts in a group with depth 1.
  */
  
    id: number;                                                        //category's ID
    name: string;                                                      //category's name
}

export interface CategoriesById {
    [id:number]: Category;
}
