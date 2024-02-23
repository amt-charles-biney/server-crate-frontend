import { createAction, props } from "@ngrx/store";

export const filter = createAction('[users] filtering products', props<{params: Record<string, string>, page: number }>())

