export interface Grade {
    id: number;                                                        
    suffix: string;                                                     
    gradeMin: number;
    gradeMax: number;
}

export interface GradesById {
    [id:number]: Grade;
}
