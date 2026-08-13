import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'content-writer' | 'seo-manager';
  avatar?: { url: string; alt?: string; publicId?: string };
  active: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'editor', 'content-writer', 'seo-manager'],
      default: 'editor',
    },
    avatar: {
      url: String,
      alt: String,
      publicId: String,
    },
    active: { type: Boolean, default: true },
    lastLogin: Date,
  },
  { timestamps: true },
);

UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
