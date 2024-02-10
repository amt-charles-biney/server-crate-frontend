import { HttpContextToken } from "@angular/common/http";

export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
export const NO_AUTH = new HttpContextToken<boolean>(() => false);
export const OTP_EXPIRATION = 'server-crate-otp-expiration'
