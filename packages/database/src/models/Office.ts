import mongoose, { Schema, type Document } from 'mongoose';

export interface IOffice extends Document {
  branch: string;
  address: {
    street: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };
  phone: string;
  email: string;
  mapEmbedUrl?: string;
  images: Array<{ url: string; alt?: string; publicId?: string }>;
  workingHours: Array<{ day: string; open: string; close: string; closed?: boolean }>;
  isHeadOffice: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfficeSchema = new Schema<IOffice>(
  {
    branch: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: String,
      postalCode: String,
      country: { type: String, default: 'Bangladesh' },
    },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    mapEmbedUrl: String,
    images: [
      {
        url: { type: String, required: true },
        alt: String,
        publicId: String,
      },
    ],
    workingHours: [
      {
        day: String,
        open: String,
        close: String,
        closed: Boolean,
      },
    ],
    isHeadOffice: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Office || mongoose.model<IOffice>('Office', OfficeSchema);
