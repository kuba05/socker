export interface GroupPlanForDay {
    [group:number]: { categoryId: number, members: number, slices: number[] };
}

export interface GroupPlan {
    [day:number]: GroupPlanForDay;
}