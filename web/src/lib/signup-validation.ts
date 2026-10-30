import { signupCopy } from "@/lib/pages/join";

export type SignupField = "name" | "email" | "password" | "confirm";
export type SignupValues = Record<SignupField, string>;
export type SignupErrors = Partial<Record<SignupField, string>>;

/** Mirrors the server schema in /api/member-auth/signup so errors show inline first. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup(values: SignupValues): SignupErrors {
  const errors: SignupErrors = {};
  const name = values.name.trim();
  if (name.length < 2 || name.length > 120) errors.name = signupCopy.errors.name;
  if (!EMAIL.test(values.email.trim())) errors.email = signupCopy.errors.email;
  if (values.password.length < 8) errors.password = signupCopy.errors.password;
  else if (values.password.length > 200) errors.password = signupCopy.errors.passwordTooLong;
  if (!values.confirm || values.confirm !== values.password) errors.confirm = signupCopy.errors.confirm;
  return errors;
}
