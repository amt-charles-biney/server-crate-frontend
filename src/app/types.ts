export type UserSignUp = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type AppState = {
  user: Omit<UserSignUp, 'password'>;
  token: string;
};

export type Success = {
  message: string;
};

export type Failure = {
  errorMessage: string;
};

export type SignIn = {
  email: string;
  password: string;
};

export type VerifiedUser = {
  token: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string
};

export type Verify = {
  email: string;
  code: string;
};

export type Verifying = {
  isLoading: boolean;
  message: string;
  isError: boolean;
};

export type VerificationFailure = {
  errorMessage: string;
};

export type ResetLink = {
  email: string;
};

export type LoadingStatus = {
  status: boolean;
  message: string;
  isError: boolean;
};

export type ResetPassword = {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ChangePassword = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type VerifyOtp = {
  email: string;
  otpCode: string;
};

export type SetOtp = {
  otp: string;
};

export type Contact = {
  phoneNumber: string;
  country: string;
  iso2Code: string;
  dialCode: string;
};

export type Link = {
  label: string;
  link: string;
  index: number;
};

export type AdminLink = {
  label: string;
  link: string;
  svg: string;
};

export type ProductItem = {
  image: string;
  name: string;
  brand: string;
  price: string;
  inStock: number;
  sales: number;
};

export type ResendOtp = {
  email: string;
  otpType: string;
};

export type OtpResend = {
  email: string;
  type: string;
};


export type Category = {
  id: string;
  name: string;
}

export type GeneralInfo = {
  firstName: string,
  lastName: string,
  email: string,
  contact: Contact,
  role: string
}

export type ChangeContact = {
  firstName: string,
  lastName: string,
  contact: Contact
}

export type DummyCategory = {
  name: string
}