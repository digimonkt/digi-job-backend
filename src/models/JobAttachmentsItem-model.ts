import mongoose, { Schema, Document } from 'mongoose';

interface IAttachment extends Document {
  job: mongoose.Types.ObjectId;
  attachment: mongoose.Types.ObjectId;
}

const JobAttachmentsItemSchema: Schema<IAttachment> = new Schema<IAttachment>({
  job: {
    type: Schema.Types.ObjectId,
    ref: 'JobDetails',
    required: true
  },
  attachment: {
    type: Schema.Types.ObjectId,
    ref: 'Media',
    required: true
  }
}, { timestamps: true });

export default mongoose.model<IAttachment>('JobAttachmentsItem', JobAttachmentsItemSchema);
