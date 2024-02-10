export type LoadingStatus = {
  status: boolean;
  message: string;
  isError: boolean;
};
export type Select = {
  id: string;
  name: string;
};
export type OnChange<T> = (value: T) => void;
export type OnTouch = () => void;
export type AppState = {
  user: Omit<UserSignUp, 'password'>;
  token: string;
};
export type UserSignUp = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export type VerifiedUser = {
    token: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  export type SignIn = {
    email: string;
    password: string;
  };
  export type Username = { firstName: string; lastName: string };
  export type Success = {
    message: string;
  };
  export type Failure = {
    errorMessage: string;
  };
  export type VerificationFailure = {
    errorMessage: string;
  };
  export type Verifying = {
    isLoading: boolean;
    message: string;
    isError: boolean;
  };
  export type Verify = {
    email: string;
    code: string;
  };
  export type ResendOtp = {
    email: string;
    otpType: string;
  };
  export type OtpResend = {
    email: string;
    type: string;
  };
  export type SetOtp = {
    otp: string;
  };
  export type ResetPassword = {
    email: string;
    otpCode: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  export type VerifyOtp = {
    email: string;
    otpCode: string;
  };
  export type ResetLink = {
    email: string;
  };