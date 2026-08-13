import mongoose, { Schema, type Document } from 'mongoose';

export interface IHeroSlide extends Document {
  title: string;
  subtitle?: string;
  backgroundImage: { url: string; alt?: string; publicId?: string };
  buttons: Array<{ label: string; href: string; variant?: string }>;
  highlights: string[];
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    title: { type: String, required: true },
    subtitle: String,
    backgroundImage: {
      url: { type: String, required: true },
      alt: String,
      publicId: String,
    },
    buttons: [
      {
        label: { type: String, required: true },
        href: { type: String, required: true },
        variant: { type: String, default: 'primary' },
      },
    ],
    highlights: [{ type: String }],
    published: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

HeroSlideSchema.index({ published: 1, order: 1 });

export default mongoose.models.HeroSlide || mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
