import mongoose, { Document, Schema } from "mongoose"; 
import { ISkill } from "../interfaces/interfaces";

export interface ISkillDocument extends ISkill, Document { 
    // Add methods here
    createdAt: Date;
    updatedAt: Date;
}


const SkillSchema: Schema = new Schema({
    skill: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export default mongoose.model<ISkillDocument>('Skill', SkillSchema);