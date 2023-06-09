import { profile_role } from "../../models/user-model";

export type CreateUserRequestType = {
  email: string;
  password: string | number;
  role: profile_role;
  mobile_number: string;
  country_code: string;
};

export type LoginRequestType = {
  email: string;
  password: string | number;
  role: profile_role;
};

export type RequestParamsType = {
  email: string;
};

export type ChangePasswordParams = {
  token: string;
};

export type ChangePasswordBodyType = {
  password: string;
};

export type searchParamsType = {
  role: "employer" | "job_seeker";
};

export type searchQueryType = {
  search: string;
};
