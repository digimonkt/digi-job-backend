import mongoose, { Schema, Document } from 'mongoose';

interface ISavedJob extends Document {
  job: mongoose.Schema.Types.ObjectId;
  user: mongoose.Schema.Types.ObjectId;
}

const SavedJobSchema: Schema = new Schema({
  job: { type: Schema.Types.ObjectId, ref: 'JobDetails', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const SavedJobModel = mongoose.model<ISavedJob>('SavedJob', SavedJobSchema);

export default SavedJobModel;
