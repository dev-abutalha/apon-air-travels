import { Country } from '@apon-air/database';
import type { FilterQuery } from 'mongoose';

export const CountryRepository = {
  async findAll(published?: boolean) {
    const filter: FilterQuery<typeof Country.prototype> = published !== undefined ? { published } : {};
    return Country.find(filter).sort({ order: 1 }).lean();
  },

  async findBySlug(slug: string) {
    return Country.findOne({ slug }).populate('faq').populate('relatedBlogs').lean();
  },

  async findById(id: string) {
    return Country.findById(id).lean();
  },

  async create(data: Record<string, unknown>) {
    return Country.create(data);
  },

  async update(id: string, data: Record<string, unknown>) {
    return Country.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  async delete(id: string) {
    const result = await Country.findByIdAndDelete(id);
    return !!result;
  },
};
