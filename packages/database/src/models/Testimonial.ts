import mongoose, { Schema, type Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  country?: string;
  photo?: { url: string; alt?: string; publicId?: string };
  rating: number;
  comment: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    country: String,
    photo: {
      url: String,
      alt: String,
      publicId: String,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

TestimonialSchema.index({ published: 1, featured: 1 });

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
