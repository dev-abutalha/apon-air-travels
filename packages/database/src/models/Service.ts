import mongoose, { Schema, type Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  slug: string;
  description: string;
  icon: string;
  image?: { url: string; alt?: string; publicId?: string };
  features: string[];
  cta?: { label: string; href: string };
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

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, default: 'Globe' },
    image: {
      url: String,
      alt: String,
      publicId: String,
    },
    features: [{ type: String }],
    cta: {
      label: String,
      href: String,
    },
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

ServiceSchema.index({ published: 1, order: 1 });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
