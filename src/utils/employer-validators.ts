import joi from "joi";

export const createJobSchema = joi.object({
  title: joi.string().required(),
  budget_currency: joi.string().required(),
  budget_amount: joi.number().required(),
  budget_pay_period: joi.string().required(),
  description: joi.string().required(),
  job_category: joi.string().required(),
  is_full_time: joi.boolean().required().optional(),
  is_part_time: joi.boolean().required().optional(),
  has_contract: joi.boolean().required().optional(),
  contact_email: joi.string().optional(),
  contact_phone: joi.string().optional(),
  contact_whatsapp: joi.string().required().optional(),
  highest_education: joi.string().required().optional(),
  language: joi.array().required(),
  language_remove: joi.array().required().optional(),
  skill: joi.array().required(),
  experience: joi.string().required().optional(),
  deadline: joi.string().required().optional(),
  start_date: joi.string().required().optional(),
  country: joi.string().required().optional(),
  city: joi.string().required().optional(),
  address: joi.string().required().optional(),
  job_sub_category: joi.string().required().optional(),
});

export const searchSchema = joi
  .object({
    employerId: joi.string(),
    search: joi.string(),
    limit: joi.number(),
    page: joi.number(),
  })
  .or("employerId", "search", "limit", "page")
  .required();

export const aboutMeSchema = joi
  .object({
    organization_name: joi.string(),
    organization_type: joi.string(),
    mobile_number: joi.string(),
    country_code: joi.string(),
    market_information_notification: joi.boolean(),
    other_notification: joi.boolean(),
    license_id: joi.string(),
  })
  .or(
    "organization_name",
    "organization_type",
    "mobile_number",
    "country_code",
    "market_information_notification",
    "other_notification",
    "license_id"
  )
  .required();
