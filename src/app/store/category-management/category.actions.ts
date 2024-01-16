import { Attribute } from "@angular/core";
import { createAction, props } from "@ngrx/store";

export const getAttributes = createAction('[attributes] get attributes')
export const gotAttributes = createAction('[attributes] got attributes', props<{ attributes: Attribute[]}>())