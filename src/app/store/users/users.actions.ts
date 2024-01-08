import { createAction, props } from "@ngrx/store";

export const filter = createAction('[users] filtering products', props<{params: string, page: number }>())