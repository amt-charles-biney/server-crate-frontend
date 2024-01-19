export type UserSignUp = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};
export type Username = { firstName: string; lastName: string };
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
  role: string;
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
  imageUrl: string;
  coverImage: string;
  productName: string;
  productBrand: string;
  productPrice: string;
  inStock: number;
  sales: number;
  id: string;
  productId: string;
  productDescription: string;
  category: {
    id: string;
    name: string;
  };
  isFeatured: boolean;
};

export type ResendOtp = {
  email: string;
  otpType: string;
};

export type OtpResend = {
  email: string;
  type: string;
};

export type GeneralInfo = {
  firstName: string;
  lastName: string;
  email: string;
  contact: Contact;
  role: string;
};

export type ChangeContact = {
  firstName: string;
  lastName: string;
  contact: Contact;
};

export type DummyCategory = {
  name: string;
};

export type Prop = {
  id: string;
  name: string;
  type: string;
  price: number;
  media: string;
  unit: string;
  isCompatible: boolean;
  isIncluded: boolean;
};
export type Option = {
  [key: string]: Prop[];
};
export type BasicConfig = {
  options: Option;
  id: string;
  category: Select;
};

export type Item = {
  id: string;
};

export type TokenPayload = {
  role: string;
  sub: string;
  iat: number;
  exp: number;
};

export type AllProducts = {
  total: number;
  products: ProductItem[];
};

export type Select = {
  id: string;
  name: string;
};

export type Category = {
  id: string;
  categoryName: string;
};

export type OnChange<T> = (value: T) => void;
export type OnTouch = () => void;

export interface IProductConfigureOptionType {
  name: string;
  attribute: string;
  price: number;
}

export interface IProductConfiguration {
  productId: string;
  configurations: IProductConfigureOptionType[];
  productPrice: number;
  configurationPrice: number;
  totalPrice: number;
  warrantyType: boolean;
  vatIncluded: number;
}

export interface ICompatibleOption {
  id: string;
  name: string;
  type: string;
  price: number;
  media: string;
  unit: string;
  isCompatible: boolean;
  isIncluded: boolean;
}

export interface ICategoryOption {
  [key: string]: ICompatibleOption[];
}

export interface ICategoryConfig {
  id: string;
  category: {
    id: string;
    name: string;
  };
  options: ICategoryOption;
}

export type CategoryMgt = {
  headers: string[];
  categoryConfigs: BasicConfig[];
};

export type UploadResponse = {
  url: string;
};

export type BulkAttribute = {
  attributeName: string;
  isMeasured: boolean;
  description: string;
  variantOptions: StoreVariant[];
};

export type UpdateAttribute = {
  id: string;
  attributeName: string;
  isMeasured: boolean;
  description: string;
  variantOptions: StoreVariant[];
}

export type VariantOption = {
  name: string;
  price: number;
  media: string;
  baseAmount: number;
  maxAmount: number;
  priceFactor: number;
  unit: string;
};

export type StoreVariant = {
  name: string;
  price: string;
  media: string;
  baseAmount: string;
  maxAmount: string;
  priceFactor: string;
  id: string;
};

export type AddAttributeResponse = {
  data: AttributeDataResponse[];
  message: string;
  status: string;
};
export type Attribute = {
  id: string;
  attributeName: string;
  isMeasured: boolean;
  unit: string;
  description: string;
  attributeOptions: AttributeOption[]
}
export type AttributeOption = {
  id: string;
  optionName: string;
  additionalInfo: AdditionalInfo;
  optionPrice: number;
  optionMedia: string;
  attribute: {
    name: string;
    id: string;
    isMeasured: boolean
  }
}

export type AdditionalInfo = {
  baseAmount: number;
  maxAmount: number;
  priceFactor: number;
}
export type GetAttribute = {
  data: Attribute[];
  message: string;
  status: string;
}

export type AttributeDataResponse = {
  id: string;
  optionName: string;
  additionalInfo: {
    baseAmount: number;
    maxAmount: number;
    priceFactor: number;
  };
  optionPrice: number;
  optionMedia: string;
  attribute: {
    name: string;
    id: string;
    isMeasured: boolean;
  };
};
