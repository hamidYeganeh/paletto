export type SignInPayload = {
  email: string;
  password: string;
};

export type SignInResponse = {
  signedUpBefore: boolean;
  token: string;
};

export type Session = SignInResponse;

// Backwards compatibility aliases
export type LoginPayload = SignInPayload;
export type LoginResponse = SignInResponse;
