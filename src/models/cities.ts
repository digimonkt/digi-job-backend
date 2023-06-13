import mongoose, { Schema, Document } from "mongoose";
interface City extends Document {
  id: string;
  city: string;
  country_id: string;
}

const citySchema: Schema = new Schema({
  id: { type: String, required: true },
  city: { type: String, required: true },
  country_id: { type: String, required: true },
});

const CityModel = mongoose.model<City>("Cities", citySchema, "cities");

export default CityModel;
