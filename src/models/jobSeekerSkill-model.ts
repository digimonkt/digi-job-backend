import mongoose, { Schema, Document } from 'mongoose';

interface IJobSeekerSkill extends Document {
  skill: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
}

const JobSeekerSkillSchema: Schema = new Schema({
  skill: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const JobSeekerSkillModel = mongoose.model<IJobSeekerSkill>('JobSeekerSkill', JobSeekerSkillSchema);

export default JobSeekerSkillModel;
