import mongoose, { Schema, type Document } from 'mongoose';

export interface IVisaType extends Document {
  countryId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  documents: string[];
  eligibility: string[];
  fees: string;
  duration: string;
  processingTime: string;
  faq: mongoose.Types.ObjectId[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const VisaTypeSchema = new Schema<IVisaType>(
  {
    countryId: { type: Schema.Types.ObjectId, ref: 'Country', required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    documents: [{ type: String }],
    eligibility: [{ type: String }],
    fees: { type: String, default: '' },
    duration: { type: String, default: '' },
    processingTime: { type: String, default: '' },
    faq: [{ type: Schema.Types.ObjectId, ref: 'FAQ' }],
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

VisaTypeSchema.index({ countryId: 1, slug: 1 });
VisaTypeSchema.index({ published: 1 });

export default mongoose.models.VisaType || mongoose.model<IVisaType>('VisaType', VisaTypeSchema);
