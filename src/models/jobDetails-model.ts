import mongoose, { Schema, Document } from "mongoose";

export enum status {
  Active = "active",
  Inactive = "inactive",
  Deleted = "deleted",
}

enum payPeriod {
  Hourly = "hourly",
  Daily = "daily",
  Weekly = "weekly",
  Monthly = "monthly",
  Yearly = "yearly",
}

enum timing {
  OneDayWeek = "1_day_week",
  TwoDaysWeek = "2_days_week",
  ThreeDaysWeek = "3_days_week",
  FourDaysWeek = "4_days_week",
  FiveDaysWeek = "5_days_week",
  SixDaysWeek = "6_days_week",
  SevenDaysWeek = "7_days_week",
}

interface IJobDetails extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  budget_currency?: string;
  budget_amount: number;
  budget_pay_period?: payPeriod;
  description?: string;
  country?: mongoose.Types.ObjectId;
  city?: mongoose.Types.ObjectId;
  address?: string;
  job_category: mongoose.Types.ObjectId[];
  is_full_time?: boolean;
  is_part_time?: boolean;
  has_contract?: boolean;
  timing?: timing;
  contact_email?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
  highest_education: mongoose.Types.ObjectId;
  language: mongoose.Types.ObjectId[];
  skill: mongoose.Types.ObjectId[];
  status?: status;
  experience: number;
  deadline: Date;
  start_date: Date;
}

const JobDetailsSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    budget_currency: {
      type: String,
      required: true,
    },
    job_sub_category: {
      type: String,
    },
    budget_amount: {
      type: Number,
      required: true,
    },
    budget_pay_period: {
      type: String,
    },
    description: {
      type: String,
    },
    country: {
      type: Schema.Types.ObjectId,
      ref: "Country",
    },
    city: {
      type: Schema.Types.ObjectId,
      ref: "City",
    },
    address: {
      type: String,
    },
    job_category: [
      {
        type: Schema.Types.ObjectId,
        ref: "JobCategory",
      },
    ],
    is_full_time: {
      type: Boolean,
      default: false,
    },
    is_part_time: {
      type: Boolean,
      default: false,
    },
    has_contract: {
      type: Boolean,
      default: false,
    },
    timing: {
      type: String,
    },
    contact_email: {
      type: String,
    },
    contact_phone: {
      type: String,
    },
    contact_whatsapp: {
      type: String,
    },
    highest_education: {
      type: Schema.Types.ObjectId,
      ref: "Education",
      required: true,
    },
    language: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Language",
          required: true,
        },
      ],
      validate: {
        validator: function (languages: mongoose.Types.ObjectId[]) {
          return languages.length <= 3;
        },
        message: "Maximum 3 languages allowed",
      },
    },
    skill: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Skill",
        },
      ],
      validate: {
        validator: function (skills: mongoose.Types.ObjectId[]) {
          return skills.length <= 3;
        },
        message: "Maximum 3 skills allowed",
      },
    },
    status: {
      type: String,
    },
    experience: {
      type: Number,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    start_date: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJobDetails>("JobDetails", JobDetailsSchema);
