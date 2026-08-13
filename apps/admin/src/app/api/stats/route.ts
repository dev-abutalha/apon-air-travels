import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  Country, VisaType, Service, BlogPost, Contact, Testimonial, FAQ, User,
} from '@apon-air/database';

export async function GET() {
  try {
    await connectDB();

    const countries = await Country.find().sort({ order: 1 }).lean();

    const [
      countriesCount,
      visaTypesCount,
      services,
      blogs,
      enquiriesCount,
      testimonialsCount,
      faqsCount,
      usersCount,
      unreadMessages,
      recentEnquiries,
      recentTestimonials,
    ] = await Promise.all([
      Country.countDocuments(),
      VisaType.countDocuments(),
      Service.find().lean(),
      BlogPost.find().lean(),
      Contact.countDocuments(),
      Testimonial.countDocuments(),
      FAQ.countDocuments(),
      User.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      Testimonial.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const visaTypesByCountry = await VisaType.aggregate<{ _id: string; name: string; count: number }>([
      { $group: { _id: '$countryId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const countryNames = new Map(countries.map((c: any) => [String(c._id), c.name]));
    const chartData = visaTypesByCountry
      .map((v) => ({ name: countryNames.get(String(v._id)) || 'Unknown', count: v.count }))
      .sort((a, b) => b.count - a.count);

    const publishedCountries = countries.filter((c: any) => c.published).length;
    const allBlogs = blogs.length;
    const publishedBlogs = blogs.filter((b: any) => b.published).length;
    const publishedServices = services.filter((s: any) => s.published).length;
    const contentStatus = [
      { name: 'Published', value: publishedCountries + publishedBlogs + publishedServices },
      { name: 'Draft', value: (countriesCount - publishedCountries) + (allBlogs - publishedBlogs) + (services.length - publishedServices) },
    ];

    return NextResponse.json({
      countries: countriesCount,
      visaTypes: visaTypesCount,
      services: services.length,
      blogs: allBlogs,
      enquiries: enquiriesCount,
      testimonials: testimonialsCount,
      faqs: faqsCount,
      users: usersCount,
      unreadMessages,
      visaTypesByCountry: chartData,
      contentStatus,
      recentEnquiries,
      recentTestimonials,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
