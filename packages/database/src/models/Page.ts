import mongoose, { Schema, type Document } from 'mongoose';

export interface IPage extends Document {
  title: string;
  slug: string;
  content: string;
  template: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<IPage>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, default: '' },
    template: { type: String, default: 'default' },
    seo: {
      title: String,
      description: String,
      keywords: [String],
    },
    published: { type: Boolean, default: false },
  },
  { timestamps: true },
);



export default mongoose.models.Page || mongoose.model<IPage>('Page', PageSchema);
