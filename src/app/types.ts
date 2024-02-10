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
