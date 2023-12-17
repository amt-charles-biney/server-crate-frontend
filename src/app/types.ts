export type UserSignUp = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type AppState = {
    isLoading: boolean;
    message: string;
    isError: boolean;
    user: Omit<UserSignUp, 'password'>,
    token: string
}

export type SignUpSuccess = {
    message: string
}

export type AuthFailure = {
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
