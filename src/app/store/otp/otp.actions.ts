import { createAction, props } from "@ngrx/store";
import { SetOtp } from "../../types";

export const setOtp = createAction('[Otp] set otp', props<SetOtp>())