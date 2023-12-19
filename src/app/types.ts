export type UserSignUp = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type AppState = {
    user: Omit<UserSignUp, 'password'>,
    token: string
}

export type Success = {
    message: string
}

export type Failure = {
    errorMessage: string
}

export type SignIn = {
    email: string,
    password: string,
}

export type VerifiedUser = {
    token: string;
    firstName: string;
    lastName: string;
    email: string;
}

export type Verify = {
    email: string;
    code: string;
}

export type Verifying = {
    isLoading: boolean,
    message: string,
    isError: boolean
}

export type VerificationFailure = {
    errorMessage: string
}

export type ResetLink = {
    email: string
}

export type LoadingStatus = {
    status: boolean,
    message: string,
    isError: boolean
}

export type ResetPassword = {
    email: string;
    otpCode: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type ChangePassword = {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export type VerifyOtp = {
    email: string;
    otpCode: string;
}

export type SetOtp = {
    otp: string
};

export type Contact = {
    phoneNumber: string;
    country: string;
    iso2Code: string;
    dialCode: string;
}