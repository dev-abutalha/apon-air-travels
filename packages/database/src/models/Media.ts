import mongoose, { Schema, type Document } from 'mongoose';

export interface IMedia extends Document {
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  alt?: string;
  publicId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MediaSchema = new Schema<IMedia>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    alt: String,
    publicId: String,
  },
  { timestamps: true },
);

export default mongoose.models.Media || mongoose.model<IMedia>('Media', MediaSchema);
