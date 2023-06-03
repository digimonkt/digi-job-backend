import joi from 'joi'

export const createSchema = joi.object({
    title: joi.string().required()
})

export const getSchema = joi.object({
    search: joi.string(),
    page: joi.string(),
    limit: joi.string()
})

export const deleteSchema = joi.object({
    jobCategoryId: joi.string(),
    languageId: joi.string(),
    skillId: joi.string(),
    educationLevelId: joi.string()
}).xor('jobCategoryId', 'languageId', 'skillId', 'educationLevelId')