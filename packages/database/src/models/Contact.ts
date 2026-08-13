import mongoose, { Schema, type Document } from 'mongoose';

export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  country?: string;
  visaType?: string;
  type: 'general' | 'visa-enquiry' | 'newsletter';
  status: 'new' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    country: String,
    visaType: String,
    type: {
      type: String,
      enum: ['general', 'visa-enquiry', 'newsletter'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied'],
      default: 'new',
    },
  },
  { timestamps: true },
);

ContactSchema.index({ status: 1, type: 1 });
ContactSchema.index({ createdAt: -1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
