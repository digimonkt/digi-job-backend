import mongoose from "mongoose"
import { Request } from "express"
export interface ISkill {
    skill: string
    user: mongoose.Schema.Types.ObjectId
}

export interface IjobCategory {
    title: string
    slug: string
    active: boolean
}

interface decodedToken {
    _id: string
    ext: number
    iat: number
}
export interface CustomRequest extends Request {
    user?: decodedToken;
    files: any;
}

