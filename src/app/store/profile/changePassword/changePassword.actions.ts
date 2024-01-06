import { createAction, props } from "@ngrx/store";
import { ChangePassword } from "../../../types";

export const changePassword = createAction('[profile] change password', props<ChangePassword>())