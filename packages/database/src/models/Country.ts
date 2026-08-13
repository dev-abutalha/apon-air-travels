import mongoose, { Schema, type Document } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  slug: string;
  flag?: { url: string; alt?: string; publicId?: string };
  heroImage?: { url: string; alt?: string; publicId?: string };
  description: string;
  overview: string;
  processingTime?: string;
  fee?: string;
  embassyInfo?: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    canonical?: string;
    ogImage?: string;
  };
  requirements: { title: string; items: string[] }[];
  faq: mongoose.Types.ObjectId[];
  relatedBlogs: mongoose.Types.ObjectId[];
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema = new Schema<ICountry>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    flag: {
      url: String,
      alt: String,
      publicId: String,
    },
    heroImage: {
      url: String,
      alt: String,
      publicId: String,
    },
    description: { type: String, required: true },
    overview: { type: String, default: '' },
    processingTime: String,
    fee: String,
    embassyInfo: String,
    seo: {
      title: String,
      description: String,
      keywords: [String],
      canonical: String,
      ogImage: String,
    },
    requirements: [{ title: String, items: [String] }],
    faq: [{ type: Schema.Types.ObjectId, ref: 'FAQ' }],
    relatedBlogs: [{ type: Schema.Types.ObjectId, ref: 'BlogPost' }],
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CountrySchema.index({ published: 1, order: 1 });

export default mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);
