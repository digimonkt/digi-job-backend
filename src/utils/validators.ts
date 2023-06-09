import joi from "joi";

export const authSchema = joi
  .object({
    email: joi.string().email().lowercase(),
    password: joi.string().min(8).required(),
    role: joi.string().valid("employer", "job_seeker", "admin").required(),
    mobile_number: joi.string().min(10).max(10),
    country_code: joi.string().min(2).max(2),
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
