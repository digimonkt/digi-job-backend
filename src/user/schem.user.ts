import Joi from "joi";

export const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

export type CreateUserType = {
    name: string;
    email: string;
    password: string
} 