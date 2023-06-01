import mongoose, { Schema, Document } from 'mongoose';

export interface ILanguage extends Document {
  title: string;
  slug: string;
  active: boolean;
  deleted: boolean;
}

const languageSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

const LanguageModel = mongoose.model<ILanguage>('Language', languageSchema);

export default LanguageModel;
