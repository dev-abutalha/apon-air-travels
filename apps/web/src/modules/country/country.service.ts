import { CountryRepository } from './country.repository';
import { slugify } from '@apon-air/utils';

export const CountryService = {
  async getPublishedCountries() {
    return CountryRepository.findAll(true);
  },

  async getAllCountries() {
    return CountryRepository.findAll();
  },

  async getCountryBySlug(slug: string) {
    return CountryRepository.findBySlug(slug);
  },

  async createCountry(data: {
    name: string;
    description: string;
    overview?: string;
  }) {
    const slug = slugify(data.name);
    return CountryRepository.create({ ...data, slug });
  },

  async updateCountry(id: string, data: Record<string, unknown>) {
    if (data.name) {
      data.slug = slugify(data.name as string);
    }
    return CountryRepository.update(id, data);
  },

  async deleteCountry(id: string) {
    return CountryRepository.delete(id);
  },
};
