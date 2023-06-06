import mongoose, { Document, Schema } from "mongoose"; 
import { Ijobseekerskill } from "../interfaces/interfaces";

export interface IjobseekerskillDocument extends Ijobseekerskill, Document { 
    // Add methods here
    createdAt: Date;
    updatedAt: Date;
}

const jobseekerskillSchema: Schema = new Schema({
    jobseekerskill: { type: mongoose.Schema.Types.ObjectId, ref: 'skill', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export default mongoose.model<IjobseekerskillDocument>('Jobseekerskill', jobseekerskillSchema);