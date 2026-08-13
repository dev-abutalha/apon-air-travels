import mongoose, { Schema, type Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: { url: string; alt?: string; publicId?: string };
  author: string;
  category: string;
  tags: string[];
  readingTime: number;
  published: boolean;
  featured: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: '' },
    content: { type: String, default: '' },
    coverImage: {
      url: String,
      alt: String,
      publicId: String,
    },
    author: { type: String, default: 'Admin' },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    readingTime: { type: Number, default: 5 },
    published: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    seo: {
      title: String,
      description: String,
      keywords: [String],
      ogImage: String,
    },
    publishedAt: Date,
  },
  { timestamps: true },
);

BlogPostSchema.index({ published: 1, category: 1 });
BlogPostSchema.index({ tags: 1 });

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
