import mongoose, { Schema, Document } from 'mongoose';

interface IAppliedJob extends Document {
  job: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
  shortlisted_at?: Date;
  rejected_at?: Date;
  resume: string;
  cover_letter: string;
}

const AppliedJobSchema: Schema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'JobDetails', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shortlisted_at: { type: Date },
  rejected_at: { type: Date },
  resume: { type: String, required: true },
  cover_letter: { type: String, required: true },
});

const AppliedJobModel = mongoose.model<IAppliedJob>('AppliedJob', AppliedJobSchema);

export default AppliedJobModel;
