import mongoose from "mongoose"

export interface ISkill {
    skill: string
    user: mongoose.Schema.Types.ObjectId
}

export interface IjobCategory {
    title: string
    slug: string
    active: boolean
}
