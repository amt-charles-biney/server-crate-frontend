import { HttpContextToken } from "@angular/common/http";

export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
export const UPLOAD_PRESET = 'n6gwltfs'
export const CLOUD_NAME = 'dah4l2inx'
export const NO_AUTH = new HttpContextToken<boolean>(() => false);

export const CURRENT_TAB = 'server-crate-current-tab'