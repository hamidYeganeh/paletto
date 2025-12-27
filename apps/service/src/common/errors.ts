export const ErrorKeys = {
  AUTH_INVALID_CREDENTIALS: "Errors.Auth.invalidCredentials",
  AUTH_INVALID_TOKEN: "Errors.Auth.invalidToken",
  USERS_USER_NOT_FOUND: "Errors.Users.userNotFound",
  USERS_PROFILE_NOT_FOUND: "Errors.Users.profileNotFound",
  COMMON_GENERIC: "Errors.Common.generic",
} as const;

export type ErrorKey = (typeof ErrorKeys)[keyof typeof ErrorKeys];
