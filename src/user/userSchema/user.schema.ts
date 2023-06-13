import { profile_role } from "../../models/user-model";

import joi from "joi";

export const authSchema = joi
  .object({
    email: joi.string().email().lowercase(),
    password: joi.string().min(8).required(),
    role: joi.string().valid("employer", "job_seeker", "admin").required(),
    mobile_number: joi.string().min(10).max(10),
    country_code: joi.string().min(1).max(4),
  })
  .or("email", "mobile_number")
  .required();

export const loginSchema = joi
  .object({
    email: joi.string().email().lowercase(),
    password: joi.string().min(8).required(),
    role: joi.string().valid("employer", "job_seeker", "admin").required(),
  })
  .or("email")
  .required();

export const querySchema = joi.object({
  email: joi.string().email().lowercase(),
  password: joi.string().min(8),
});

export const verificationSchema = joi.object({
  otp: joi.string().min(4).max(4),
  email: joi.string().email().lowercase(),
});

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
