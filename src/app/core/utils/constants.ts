import { HttpContextToken } from "@angular/common/http";

export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
export const UPLOAD_PRESET = 'n6gwltfs'
export const CLOUD_NAME = 'dah4l2inx'
export const NO_AUTH = new HttpContextToken<boolean>(() => false);

export const CURRENT_TAB = 'server-crate-current-tab'
export const CURRENT_INDEX = 'server-crate-current-index'
export const CURRENT_AD_INDEX = 'server-crate-current-ad-index'
export const CURRENT_AD_TAB = 'server-crate-current-ad-tab'
export const OTP_EXPIRATION = 'server-crate-otp-expiration'