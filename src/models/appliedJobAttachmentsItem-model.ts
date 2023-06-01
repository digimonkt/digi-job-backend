import mongoose, { Schema, Document } from 'mongoose';

interface IAppliedJobAttachmentsItem extends Document {
  applied_job: mongoose.Schema.Types.ObjectId;
  attachment: mongoose.Schema.Types.ObjectId;
}

const AppliedJobAttachmentsItemSchema: Schema = new Schema({
  applied_job: { type: Schema.Types.ObjectId, ref: 'AppliedJob', required: true },
  attachment: { type: Schema.Types.ObjectId, ref: 'Media', required: true },
});

const AppliedJobAttachmentsItemModel = mongoose.model<IAppliedJobAttachmentsItem>('AppliedJobAttachmentsItem', AppliedJobAttachmentsItemSchema);

export default AppliedJobAttachmentsItemModel;
