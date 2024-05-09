import { HttpContextToken } from "@angular/common/http";
import { StatusColors } from "../../types";
import { MatSnackBarConfig } from "@angular/material/snack-bar";

export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
export const UPLOAD_PRESET = 'n6gwltfs'
export const CLOUD_NAME = 'dah4l2inx'
export const NO_AUTH = new HttpContextToken<boolean>(() => false);

export const OTP_EXPIRATION = 'server-crate-otp-expiration'
export const COOKIE_ACCEPTANCE = 'server-crate-cookie-acceptance'
export const LOCALSTORAGE_USER = 'server-crate-user'
export const LOCALSTORAGE_TOKEN = 'server-crate-token'
export const LOCALSTORAGE_EMAIL = 'server-crate-email'

export const COLOR_MAPPING: StatusColors = {
    'Cancelled': {
        color: 'text-red-status',
        background: 'bg-[#FCE6E799]',
        circle: 'bg-red-status'
    },
    'Delivered': {
        color: 'text-green-status',
        background: 'bg-[#ECFDF399]',
        circle: 'bg-green-status'
    },
    'Assembling': {
        color: 'text-[#FF8901]',
        background: 'bg-[#FFF3E499]',
        circle: 'bg-[#FF8901]'
    },
    'Pending': {
        color: 'text-[#FF8901]',
        background: 'bg-[#FFF3E499]',
        circle: 'bg-[#FF8901]'
    },
    'Shipped': {
        color: 'text-[#364254]',
        background: 'bg-[#F2F4F799]',
        circle: 'bg-[#364254]'
    },
    'Out For Delivery':  {
        color: 'text-[#364254]',
        background: 'bg-[#F2F4F799]',
        circle: 'bg-[#364254]'
    }
}

export const allowedOptionTypes: string[] = [
    'GPU',
    'Motherboard',
    'RAM',
    'Storage',
    'Operating System',
    'Processor'
];

export const NAME_MAPPING: { [key: string]: string} = {
    'pre_transit': 'Pending',
    'unknown': 'Pending',
    'in_transit': 'Shipped',
    'out_for_delivery': 'Out For Delivery',
    'delivered': 'Delivered'
}
export const IMAGE_MAPPING: {[key:string]: string} = {
    'MTN': '/assets/mtn.svg',
    'Vodafone': '/assets/voda.svg',
    'visa': '/assets/visa.svg',
    'mastercard': '/assets/mastercard.svg'
    
}

export const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]

export const snackbarConfig: MatSnackBarConfig = { duration: 4000, horizontalPosition: "center", verticalPosition: "bottom" }