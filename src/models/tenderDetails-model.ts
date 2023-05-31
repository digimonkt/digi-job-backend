import mongoose, { Schema, Document, Types } from 'mongoose';

interface ITender extends Document {
  user: Types.ObjectId;
  title: string;
  description: string;
  budget_currency: string;
  budget_amount: number;
  country: Types.ObjectId;
  city: Types.ObjectId;
  tender_category_1: Types.ObjectId;
  tender_category_2: Types.ObjectId;
}

const TenderSchema = new Schema<ITender>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget_currency: {
    type: String,
    required: true
  },
  budget_amount: {
    type: Number,
    required: true
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: 'City',
    required: true
  },
  tender_category_1: {
    type: Schema.Types.ObjectId,
    ref: 'TenderCategory',
    required: true
  },
  tender_category_2: {
    type: Schema.Types.ObjectId,
    ref: 'TenderCategory',
    required: true
  }
}, { timestamps: true });

export default mongoose.model<ITender>('Tender', TenderSchema);
