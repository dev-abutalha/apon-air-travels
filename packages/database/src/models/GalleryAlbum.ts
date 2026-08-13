import mongoose, { Schema, type Document } from 'mongoose';

export interface IGalleryAlbum extends Document {
  title: string;
  slug: string;
  description?: string;
  coverImage?: { url: string; alt?: string; publicId?: string };
  images: Array<{ url: string; alt?: string; caption?: string; publicId?: string }>;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryAlbumSchema = new Schema<IGalleryAlbum>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    coverImage: {
      url: String,
      alt: String,
      publicId: String,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: String,
        caption: String,
        publicId: String,
      },
    ],
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);



export default mongoose.models.GalleryAlbum || mongoose.model<IGalleryAlbum>('GalleryAlbum', GalleryAlbumSchema);
