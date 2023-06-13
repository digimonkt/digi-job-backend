import mongoose, { Schema, Document } from "mongoose";
interface Country extends Document {
  id: string;
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  currency: string;
}

const CountrySchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  iso3: { type: String, required: true },
  iso2: { type: String, required: true },
  phone_code: { type: String, required: true },
  currency: { type: String, required: true },
});

const CountryModel = mongoose.model<Country>(
  "Country",
  CountrySchema,
  "country"
);

export default CountryModel;
