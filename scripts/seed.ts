import { connectDB, disconnectDB } from '../packages/database/src';
import {
  User,
  SiteSettings,
  Service,
  Country,
  VisaType,
  FAQ,
  Testimonial,
  GalleryAlbum,
  BlogPost,
  Office,
  HeroSlide,
  Page,
} from '../packages/database/src';
import { hashPassword } from '../packages/auth/src';

const img = (id: string, w = 1200, h = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

const TRAVEL_IMAGES = [
  img('1488646953014-85cb44e25828'),
  img('1496564203457-11bb12075d90'),
  img('1502920917128-1aa500764cbd'),
  img('1469854523086-cc02fe5d8800'),
  img('1488085061387-422e29b40080'),
  img('1500835556837-99ac94a94552'),
  img('1519003725024-0d1225a5f790'),
  img('1476514525535-07fb3b4ae5f1'),
  img('1530789253388-582c481c54b0'),
  img('1519046904884-53103b34b206'),
];

async function upsert(model: any, filter: Record<string, unknown>, data: Record<string, unknown>) {
  return model.findOneAndUpdate(filter, data, { upsert: true, new: true });
}

async function seed() {
  console.log('🌱 Seeding database...');
  await connectDB();

  const adminExists = await User.findOne({ email: 'admin@aponairtravels.com' });
  if (!adminExists) {
    const hashedPassword = await hashPassword('admin123');
    await User.create({
      name: 'Admin',
      email: 'admin@aponairtravels.com',
      password: hashedPassword,
      role: 'admin',
      active: true,
    });
    console.log('✅ Admin user created (admin@aponairtravels.com / admin123)');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  await upsert(SiteSettings, {}, {
    siteName: 'Apon Air Travels',
    tagline: 'Your Trusted Travel Partner',
    footerText: 'Your trusted partner for visa consultancy, travel services, and international travel solutions.',
    aboutText:
      'Apon Air Travels is a leading visa consultancy and travel agency based in Dhaka, Bangladesh. ' +
      'For over 5 years we have helped thousands of clients achieve their dream of studying, working, ' +
      'and travelling abroad. Our team of expert consultants provides end-to-end support for student visas, ' +
      'tourist visas, business visas, and immigration services, ensuring the highest possible success rate.',
    contactEmail: 'info@aponairtravels.com',
    contactPhone: '+880-1234-567890',
    socialLinks: {
      facebook: 'https://facebook.com/aponairtravels',
      instagram: 'https://instagram.com/aponairtravels',
      linkedin: 'https://linkedin.com/company/aponairtravels',
      youtube: 'https://youtube.com/@aponairtravels',
      twitter: 'https://twitter.com/aponairtravels',
      whatsapp: '+8801234567890',
    },
    address: {
      street: '123, Gulshan Avenue',
      city: 'Dhaka',
      country: 'Bangladesh',
    },
    statistics: {
      yearsOfExperience: 5,
      countries: 20,
      clients: 5000,
      successRate: 95,
    },
    whyChooseUs: [
      'Expert visa consultants with years of experience',
      'High success rate on visa applications',
      'Personalized guidance for each client',
      'End-to-end application support',
    ],
    navigation: [
      { label: 'Home', href: '/', order: 0 },
      { label: 'About', href: '/about', order: 1 },
      { label: 'Services', href: '/services', order: 2 },
      { label: 'Countries', href: '/countries', order: 3 },
      { label: 'Blog', href: '/blog', order: 4 },
      { label: 'Gallery', href: '/gallery', order: 5 },
      { label: 'Testimonials', href: '/testimonials', order: 6 },
      { label: 'FAQ', href: '/faq', order: 7 },
      { label: 'Contact', href: '/contact', order: 8 },
    ],
  });
  console.log('✅ Site settings created');

  const services = [
    {
      title: 'Visa Processing',
      slug: 'visa-processing',
      icon: 'Globe',
      description: 'End-to-end visa application assistance for all countries.',
      features: ['Document verification', 'Application submission', 'Interview preparation', 'Status tracking'],
      cta: { label: 'Start Now', href: '/contact' },
    },
    {
      title: 'Student Visa',
      slug: 'student-visa',
      icon: 'GraduationCap',
      description: 'Guidance for international students seeking overseas education.',
      features: ['University admission support', 'Financial documentation', 'GIC/SOP preparation', 'Post-arrival support'],
      cta: { label: 'Apply Now', href: '/contact' },
    },
    {
      title: 'Business Visa',
      slug: 'business-visa',
      icon: 'Briefcase',
      description: 'Hassle-free business travel documentation.',
      features: ['Invitation letter support', 'Corporate documentation', 'Expedited processing'],
      cta: { label: 'Contact Us', href: '/contact' },
    },
    {
      title: 'Tourist Visa',
      slug: 'tourist-visa',
      icon: 'Plane',
      description: 'Tourist visa processing for popular destinations.',
      features: ['Itinerary planning', 'Travel insurance', 'Hotel bookings', 'Application filing'],
      cta: { label: 'Get Started', href: '/contact' },
    },
    {
      title: 'Travel Insurance',
      slug: 'travel-insurance',
      icon: 'ShieldCheck',
      description: 'Comprehensive travel insurance for your journey.',
      features: ['Medical coverage', 'Trip cancellation', 'Lost baggage cover'],
      cta: { label: 'Learn More', href: '/contact' },
    },
    {
      title: 'Air Ticket Booking',
      slug: 'air-ticket-booking',
      icon: 'Ticket',
      description: 'Best fares on international flights with flexible options.',
      features: ['Lowest fare guarantee', 'Multiple airlines', '24/7 support'],
      cta: { label: 'Book Now', href: '/contact' },
    },
  ];

  for (const s of services) {
    await upsert(Service, { slug: s.slug }, { ...s, published: true, order: services.indexOf(s) });
  }
  console.log(`✅ ${services.length} services created`);

  const faqs = [
    {
      question: 'What documents are needed for a visa application?',
      answer:
        'Requirements vary by country and visa type. Generally, you need a valid passport, photographs, application form, and supporting documents such as financial proof, employment/study letters, and travel itinerary.',
      category: 'General',
      order: 0,
      published: true,
    },
    {
      question: 'How long does visa processing take?',
      answer:
        'Processing times vary from 2-3 weeks for standard applications to 1-2 weeks for expedited processing, depending on the country and visa category.',
      category: 'General',
      order: 1,
      published: true,
    },
    {
      question: 'Do you provide support for student visas?',
      answer:
        'Yes, we provide comprehensive support for student visa applications including document preparation, financial documentation, SOP drafting, and interview guidance.',
      category: 'General',
      order: 2,
      published: true,
    },
    {
      question: 'What is a biometric appointment?',
      answer:
        'A biometric appointment is when you visit the embassy or visa application centre to provide your fingerprints and photograph as part of the visa application process.',
      category: 'General',
      order: 3,
      published: true,
    },
  ];

  const generalFaqs = await Promise.all(
    faqs.map((f) => upsert(FAQ, { question: f.question }, f)),
  );
  console.log(`✅ ${faqs.length} FAQs created`);

  const countrySeed = [
    {
      name: 'Australia',
      slug: 'australia',
      description: 'Education, business, and migration opportunities',
      overview:
        'Australia offers a high-quality education system and a robust points-based immigration system. Popular for its universities, lifestyle, and post-study work opportunities, it is a top destination for tourists, students, and business visitors alike.',
      processingTime: '4-10 weeks',
      fee: 'AUD 240',
      embassyInfo: 'Australian High Commission, Dhaka',
      requirements: [
        {
          title: 'For Business Man',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also.',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Company blank Pad (5 pcs)',
            'Personal & Business Bank account Statement (Last 6 months)',
            'Personal & Business Bank Solvency certificate',
            'NID/Birth Certificate copy',
            'Marriage Certificate/Nikah-Nama',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Renewal Trade License (Business Start Date)',
            'Family Information: Father, Mother, Spouse, Childs, Sister, Brothers Name, Date of Birth, Country of Birth, Profession, Marital status & Present Address. If deceased please mention Date of Death & Place of Death.',
            'Educational Qualification: Course name, Institute Name, Address, Contact No, Course Start & End date.',
            'Name, Address & Relationship of any person or institute you will visit in Australia. (if have)',
            'Credit Card Copy with statement (If have)',
          ],
        },
        {
          title: 'For Job Holder',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Office ID card copy',
            'NOC Letter (with Job Start Date)',
            'Past Job info - Company name, Address, Start & end date, Designation. (If have)',
            'Personal Bank Solvency certificate & Bank Statement (Last 6 months)',
            'Salary Pay-slip (last 6 months) or Salary Account Statement (Last 6 months)',
            'NID/Birth Certificate Copy',
            'Marriage Certificate/Nikah-Nama',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Family Information: Father, Mother, Spouse, Childs, Sister, Brothers Name, Date of Birth, Country of Birth, Profession, Marital status & Present Address. If deceased please mention Date of Death & Place of Death.',
            'Last Educational Qualification: Course Name, Institute Name, Address Contact No, Course Start & End date.',
            'Name, Address & Relationship of any person or institute you will visit in Australia (if have)',
          ],
        },
        {
          title: 'For Other Profession',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also.',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Past Job info - Company name, Address, Start & end date, Designation. (If have)',
            'Personal Bank Solvency certificate & Bank Statement (Last 6 months)',
            'NID/Birth Certificate Copy',
            'Marriage Certificate/Nikah-Nama',
            'BMDC certificate for doctor',
            'BAR council certificate for Advocate',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Family Information: Father, Mother, Spouse, Childs, Sister & Brothers Name & Date of Birth, Country of Birth, Profession & Present Address. If deceased please mention Date of Death & Place of Death.',
            'Last Educational Qualification: Course Name, Institute Name, Address Contact No, Course Start & End date.',
            'Name, Address & Relationship of any person or institute you will visit in Australia (if have)',
          ],
        },
        {
          title: 'For Student',
          items: [
            'NID/Birth Certificate copy',
            'Student ID card',
            'NOC from School/Collage/Institute.',
            'Running course start date, Course name.',
          ],
        },
        { title: 'Embassy Fee: AUD 240', items: [] },
      ],
      visaTypes: [
        { title: 'Student Visa (Subclass 500)', slug: 'student-visa-500', fees: 'AUD 650', duration: 'Course duration', processingTime: '4-8 weeks' },
        { title: 'Visitor Visa (Subclass 600)', slug: 'visitor-visa-600', fees: 'AUD 145', duration: 'Up to 12 months', processingTime: '3-6 weeks' },
      ],
    },
    {
      name: 'Canada',
      slug: 'canada',
      description: 'Study, work, and settle in Canada',
      overview:
        'Canada is one of the most popular destinations for international students and skilled workers. With a world-class education system, welcoming immigration policies, and high quality of life, Canada offers countless opportunities.',
      processingTime: '4-8 weeks',
      fee: 'CAD 185 (Biometric fee included)',
      embassyInfo: 'High Commission of Canada, Dhaka',
      requirements: [
        {
          title: 'For Business Man',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also.',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Company blank Pad (5 pcs)',
            'Personal & Business Bank account Statement (Last 6 months)',
            'Personal & Business Bank Solvency certificate',
            'NID/Birth Certificate copy',
            'Marriage Certificate/Nikah-Nama',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Renewal Trade License (Business Start Date)',
            'Documents for Asset valuation: Flat documents, House documents, Shop documents, Fixed Deposit (FDR), Land deed, Car blue book or smart card, Sanchayapatra, Financial investment, Insurance and other Documents which means fixed Asset.',
            'Family Information: Father, Mother, Spouse, Childs, Sister, Brothers Name, Date of Birth, Country of Birth, Profession, Marital status & Present Address. If deceased please mention Date of Death & Place of Death.',
            'Educational Qualification: Course name, Institute Name, Address, Contact No, Course Start & End date.',
            'Name, Address & Relationship of any person or institute you will visit in Canada (if have)',
            'Credit Card Copy with statement (If have)',
          ],
        },
        {
          title: 'For Job Holder',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Office ID card copy',
            'NOC Letter (with Job Start Date)',
            'Past Job info - Company name, Address, Start & end date, Designation. (If have)',
            'Personal Bank Solvency certificate & Bank Statement (Last 6 months)',
            'Salary Pay-slip (last 6 months) or Salary Account Statement (Last 6 months)',
            'NID/Birth Certificate Copy',
            'Marriage Certificate/Nikah-Nama',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Documents for Asset Valuation: Flat documents, House documents, Shop documents, Fixed Deposit (FDR), Land deed, Car blue book or smart card, Sanchayapatra, Financial investment, Insurance and other Documents which means fixed Asset).',
            'Family Information: Father, Mother, Spouse, Childs, Sister, Brothers Name, Date of Birth, Country of Birth, Profession, Marital status & Present Address. If deceased please mention Date of Death & Place of Death.',
            'Last Educational Qualification: Course Name, Institute Name, Address Contact No, Course Start & End date.',
            'Name, Address & Relationship of any person or institute you will visit in Canada (if have)',
          ],
        },
        {
          title: 'For Other Profession',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also.',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Past Job info - Company name, Address, Start & end date, Designation. (If have)',
            'Personal Bank Solvency certificate & Bank Statement (Last 6 months)',
            'NID/Birth Certificate Copy',
            'Marriage Certificate/Nikah-Nama',
            'BMDC certificate for doctor',
            'BAR council certificate for Advocate',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Documents for Asset Valuation: Flat documents, House documents, Shop documents, Fixed Deposit (FDR), Land deed, Car blue book or smart card, Sanchayapatra, Financial investment, Insurance and other Documents which means fixed Asset).',
            'Family Information: Father, Mother, Spouse, Childs, Sister & Brothers Name & Date of Birth, Country of Birth, Profession & Present Address. If deceased please mention Date of Death & Place of Death.',
            'Last Educational Qualification: Course Name, Institute Name, Address Contact No, Course Start & End date.',
            'Name, Address & Relationship of any person or institute you will visit in Canada (if have)',
          ],
        },
        {
          title: 'For Student',
          items: [
            'NID/Birth Certificate copy',
            'Student ID card',
            'NOC from School/Collage/Institute.',
            'Running course start date, Course name.',
          ],
        },
        { title: 'Embassy Fee: CAD 185 (Biometric fee included)', items: [] },
      ],
      visaTypes: [
        { title: 'Study Permit', slug: 'study-permit', fees: 'CAD 150', duration: 'Study program duration', processingTime: '8-12 weeks' },
        { title: 'Work Permit', slug: 'work-permit', fees: 'CAD 155', duration: 'Up to 2 years', processingTime: '8-16 weeks' },
        { title: 'Visitor Visa', slug: 'visitor-visa', fees: 'CAD 100', duration: 'Up to 6 months', processingTime: '4-6 weeks' },
      ],
    },
    {
      name: 'Japan',
      slug: 'japan',
      description: 'Business and tourism in the Land of the Rising Sun',
      overview:
        'Japan attracts millions of business and leisure visitors every year. With its rich culture, advanced technology, and strong economy, Japan offers excellent opportunities for short-term visits and professional travel.',
      processingTime: '5-10 working days',
      fee: 'VFS Fee: 1,900',
      embassyInfo: 'Embassy of Japan, Dhaka',
      requirements: [
        {
          title: 'Required Documents',
          items: [
            'Application form',
            'Valid Passport and Photocopy',
            'Old Passport (if any) and Photocopy',
            'One Photo (2 inch X 1.4 inch)',
            'Tax-Income certificate and Tax Payment Receipt',
            'Bank statement 6 months Latest',
          ],
        },
        {
          title: 'Note',
          items: ['We do not accept transit visa to impractical destination, such as Tokyo-Seoul transit from Dhaka.'],
        },
        { title: 'VFS Fee: 1,900', items: [] },
      ],
      visaTypes: [
        { title: 'Tourist Visa', slug: 'tourist-visa', fees: 'VFS Fee 1,900', duration: 'Up to 15 days', processingTime: '5-10 working days' },
        { title: 'Business Visa', slug: 'business-visa', fees: 'VFS Fee 1,900', duration: 'Up to 90 days', processingTime: '5-10 working days' },
      ],
    },
    {
      name: 'New Zealand',
      slug: 'new-zealand',
      description: 'Business, tourism, and education opportunities',
      overview:
        'New Zealand offers stunning landscapes, a welcoming society, and excellent opportunities for business and leisure visitors. Its efficient immigration system makes it an attractive destination for Bangladeshi travelers.',
      processingTime: '4-12 weeks',
      fee: 'NZD 441',
      embassyInfo: 'New Zealand High Commission, Singapore (covers Bangladesh)',
      requirements: [
        {
          title: 'For Business Man',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also.',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Company blank Pad (5 pcs)',
            'Personal & Business Bank account Statement (Last 6 months)',
            'Personal & Business Bank Solvency certificate',
            'NID/Birth Certificate copy',
            'Marriage Certificate/Nikah-Nama',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Renewal Trade License (Business Start Date)',
            'Name, Address & Relationship of any person or institute you will visit (if have)',
            'Credit Card Copy with statement (If have)',
          ],
        },
        {
          title: 'For Job Holder',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Office ID card copy',
            'NOC Letter (with Job Start Date)',
            'Past Job info - Company name, Address, Start & end date, Designation. (If have)',
            'Personal Bank Solvency certificate & Bank Statement (Last 6 months)',
            'Salary Pay-slip (last 6 months) or Salary Account Statement (Last 6 months)',
            'NID/Birth Certificate Copy',
            'Marriage Certificate/Nikah-Nama',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Family Information: Father, Mother, Spouse, Childs, Sister, Brothers Name, Date of Birth, Country of Birth, Profession, Marital status & Present Address. If deceased please mention Date of Death & Place of Death.',
            'Last Educational Qualification: Course Name, Institute Name, Address Contact No, Course Start & End date.',
            'Name, Address & Relationship of any person or institute you will visit (if have)',
          ],
        },
        {
          title: 'For Other Profession',
          items: [
            'Passport (Minimum 6 Months Valid) scan copy with all Stamp & Visa pages current and previous also.',
            'Photo 35×45 White Background (Lab/Studio soft copy)',
            'Visiting Card (2 pcs)',
            'Past Job info - Company name, Address, Start & end date, Designation. (If have)',
            'Personal Bank Solvency certificate & Bank Statement (Last 6 months)',
            'NID/Birth Certificate Copy',
            'Marriage Certificate/Nikah-Nama',
            'BMDC certificate for doctor',
            'BAR council certificate for Advocate',
            'Tin Certificate, Income Tax Certificate (Last Year)',
            'Family Information: Father, Mother, Spouse, Childs, Sister & Brothers Name & Date of Birth, Country of Birth, Profession & Present Address. If deceased please mention Date of Death & Place of Death.',
            'Last Educational Qualification: Course Name, Institute Name, Address Contact No, Course Start & End date.',
            'Name, Address & Relationship of any person or institute you will visit (if have)',
          ],
        },
        {
          title: 'For Student',
          items: [
            'NID/Birth Certificate copy',
            'Student ID card',
            'NOC from School/Collage/Institute.',
            'Running course start date, Course name.',
          ],
        },
        {
          title: 'Additional documentation that can strengthen applicant file',
          items: [
            'Police certificate',
            'Driving License',
            'Medical Insurance',
            'IELTS Certificate',
            'Character Certificate',
          ],
        },
        { title: 'Embassy Fee: NZD 441', items: [] },
      ],
      visaTypes: [
        { title: 'Visitor Visa', slug: 'visitor-visa', fees: 'NZD 441', duration: 'Up to 9 months', processingTime: '4-12 weeks' },
      ],
    },
    {
      name: 'Schengen',
      slug: 'schengen',
      description: 'Single visa for 27 European countries',
      overview:
        'The Schengen visa allows you to travel freely across 27 European countries with a single visa. It is ideal for tourism, business, and short-term visits to the Schengen Area from Bangladesh.',
      processingTime: '15 calendar days (can extend to 45)',
      fee: 'Approx 90-100 Euro',
      embassyInfo: 'Schengen States, Dhaka',
      requirements: [
        {
          title: 'Required Documents',
          items: [
            'Six (06) Months Valid Passport with Old Passport if have.',
            'Color Photo 2 copy. Photo size: 35×45mm in white background.',
            'Personal Bank Solvency Bank Statement of Last Six (06) Months.',
            'Applicant NID copy',
            'Birth Certificate for child',
            'Marriage Certificate & Nikah Nama',
            'Travel health insurance',
            'Fixed Deposit Copy with Certificate from Bank. (If have)',
            'Asset Valuation (Flat documents, House documents, Shop documents, Fixed Deposit, Land deed, Car blue book, Schanchaipatra and other Financial Documents).',
            'Income TAX Certificate (last 3 years)',
            'TIN Certificate.',
            'Credit Card Copy with statement (If have)',
            'BMDC certificate for doctor',
            'BAR council certificate for Advocate',
          ],
        },
        {
          title: 'For Business Person',
          items: [
            'Company Bank Solvency Bank Statement of Last Six Months',
            'Blank Page of Office Pad.',
            'Renewal Trade License.',
            'Memorandum for Limited Company.',
            'Visiting Card.',
          ],
        },
        {
          title: 'For Job Holder',
          items: [
            'NOC / Forwarding Letter, duration of leave and the function/profession of the applicant in the company.',
            'Office ID card copy.',
            'Visiting Card.',
            'Salary certificate.',
            'Salary pay slip for the last six months or Salary account statement.',
          ],
        },
        {
          title: 'For Student',
          items: [
            'Leave letter',
            'School ID card copy',
          ],
        },
        { title: 'Visa Fee Approx 90 to 100 Euro', items: [] },
      ],
      visaTypes: [
        { title: 'Schengen Tourist Visa', slug: 'schengen-tourist', fees: 'Approx 90-100 Euro', duration: 'Up to 90 days', processingTime: '15-45 days' },
        { title: 'Schengen Business Visa', slug: 'schengen-business', fees: 'Approx 90-100 Euro', duration: 'Up to 90 days', processingTime: '15-45 days' },
      ],
    },
    {
      name: 'South Korea',
      slug: 'south-korea',
      description: 'Business and tourism in South Korea',
      overview:
        'South Korea is a growing destination for business and tourism from Bangladesh. With its advanced economy, vibrant culture, and world-class infrastructure, it offers great opportunities for short-term visits.',
      processingTime: '5-10 working days',
      fee: 'Less than 90 days (Single): $40 | Double: $70 | Multiple: $90',
      embassyInfo: 'Embassy of the Republic of Korea, Dhaka',
      requirements: [
        {
          title: 'Visit Visa Check List',
          items: [
            'Passport Sized 1 Color Photo of Applicant (Taken Within Last 6 Months size: 35mm x 45mm.)',
            'Photocopy of Valid Passport with Minimum Validity of 6 Months.',
            'Personal bank statement and Bank Solvency Certificate (Last Minimum 6 months)',
            'Applicant’s Company Certificate of corporate or Trade License, if available',
            'Applicant’s Income Tax Certificate and Tax Return Acknowledgement Receipt last 03 years',
            'TIN certificate.',
            'Employment Certificate issued from the Applicant’s current company, and NOC Certificate, if available',
            'Affidavit of support notarized, if available',
            'Assets and property valuation documents if have',
          ],
        },
        {
          title: 'NB: Visa Fee',
          items: [
            'Less than 90 days (Single): $40',
            'Double: $70',
            'Multiple: $90',
          ],
        },
      ],
      visaTypes: [
        { title: 'Short-term Visit (Single)', slug: 'short-term-single', fees: '$40', duration: 'Less than 90 days', processingTime: '5-10 working days' },
        { title: 'Short-term Visit (Double)', slug: 'short-term-double', fees: '$70', duration: 'Less than 90 days', processingTime: '5-10 working days' },
        { title: 'Short-term Visit (Multiple)', slug: 'short-term-multiple', fees: '$90', duration: 'Up to 90 days', processingTime: '5-10 working days' },
      ],
    },
    {
      name: 'United Kingdom',
      slug: 'united-kingdom',
      description: 'World-class education, business, and tourism',
      overview:
        'The UK is home to some of the oldest and most prestigious universities in the world. With a rich cultural heritage and strong business ties, it remains a top choice for students, business people, and tourists from Bangladesh.',
      processingTime: '3-8 weeks',
      fee: 'GBP 115',
      embassyInfo: 'British High Commission, Dhaka',
      requirements: [
        {
          title: 'Basic Documents',
          items: [
            'Six (06) Months Valid Passport with Old Passport if have.',
            'Personal Bank Solvency Bank Statement of Last Six (06) Months.',
            'Applicant NID copy',
            'NID copy of Father, mother, Spouse & Child (birth certificate if NID unavailable)',
            'Marriage Certificate & Nikah Nama',
            'Fixed Deposit Copy with Certificate from Bank.',
            'Asset Valuation (Flat documents, House documents, Shop documents, Fixed Deposit, Land deed, Car blue book, Schanchaipatra and other Financial Documents).',
            'Income TAX Certificate (last 3 years)',
            'TIN Certificate.',
            'Credit Card Copy with statement (If have)',
            'BMDC certificate for doctor',
            'BAR council certificate for Advocate',
            'Retirement documents for Retired person',
          ],
        },
        {
          title: 'For Business Person/Employee',
          items: [
            'Company Bank Solvency Bank Statement of Last Six Months',
            'Blank Page of Office Pad.',
            'Renewal Trade License.',
            'Memorandum for Limited Company.',
            'Visiting Card',
            'NOC / Forwarding Letter for Employee',
            'Office ID card copy for Employee',
            'Salary certificate for Employee',
            'Salary Pay slip last 6 months for Employee',
          ],
        },
        {
          title: 'For Students',
          items: [
            'Leave letter',
            'School ID card copy',
          ],
        },
        {
          title: 'Documents for Inviters',
          items: [
            'Passport copy',
            'Residence copy',
            'Bank Documents',
            'TAX Documents',
            'House Documents',
            'Invitation letter',
          ],
        },
        { title: 'Embassy fee: £115', items: [] },
      ],
      visaTypes: [
        { title: 'Student Visa', slug: 'student-visa', fees: 'GBP 490', duration: 'Course duration', processingTime: '3-6 weeks' },
        { title: 'Standard Visitor Visa', slug: 'standard-visitor', fees: 'GBP 115', duration: 'Up to 6 months', processingTime: '3-5 weeks' },
      ],
    },
    {
      name: 'United States',
      slug: 'usa',
      description: 'Academic, business, and professional growth',
      overview:
        'The USA offers diverse academic programs, business opportunities, and career prospects. Its universities consistently rank among the best in the world, and it remains a leading destination for Bangladeshi applicants.',
      processingTime: '4-12 weeks',
      fee: 'USD 185',
      embassyInfo: 'US Embassy, Dhaka',
      requirements: [
        {
          title: 'Required Documents for All Types of Visas',
          items: [
            'Passport: Original Passport with validity of minimum six months after the intended date of departure and minimum two blank pages for visa stamp.',
            'Photo Specification: Two recent passport size photographs with matt or semi matt finish. white background (Size: 2 x2)',
            'NID',
            'TIN CERTIFICATE (LAST 03 YEARS)',
            'INVITATION LETTER: (IF ANY)',
            'PARENTS+SPOUSE (NAME/DATE OF BIRTH/BIRTH PLACE)',
            'MARRIAGE CERTIFICATE',
            'EDUCATIONAL CERTIFICATE',
            'NOC (Job holder) from the applicant\'s company authority on the company\'s letter head stating applicant\'s name, designation, passport number, purpose and duration of visit.',
          ],
        },
        {
          title: 'Proof of Occupation',
          items: [
            'Company registration certificate (original notarized English translated and photocopy of the original)',
            'Office ID card copy & Visiting cards.',
          ],
        },
        {
          title: 'Financials',
          items: [
            'Company\'s or Personal Bank Statement for last six months mentioning the Bank\'s name, Bank\'s',
            'Telephone Number clearly.',
            'Airline & Hotel Reservation: Ticket Itinerary & Hotel Booking (Filled up by us)',
          ],
        },
        {
          title: 'Additional Documents Required for a Minor',
          items: [
            'A written authorization of the parents or the guardian under whose custody the minor is.',
            'Birth certificate of the minor.',
            'Copy of parents ID.',
            'The parents or guardian should be present at the Embassy when minor is applying for visa.',
          ],
        },
        {
          title: 'Reminder',
          items: [
            'THE EMBASSY OF USA ISSUE BIOMETRIC VISAS. AS THE FINGERPRINTS MUST BE COLLECTED, EACH APPLICANT SHOULD APPLY IN PERSON. TRAVEL AGENTS OR OTHER AGENTS OR OTHER INDIVIDUALS ARE NOT ALLOWED TO REPRESENT THE APPLICANT.',
          ],
        },
        {
          title: 'Appointment',
          items: [
            'Due to an increase in the application number, the current waiting period to get an appointment may be longer. Apply early.',
          ],
        },
        { title: 'Embassy Fee: $185 USD', items: [] },
      ],
      visaTypes: [
        { title: 'F-1 Student Visa', slug: 'f1-student-visa', fees: 'USD 185', duration: 'Course duration', processingTime: '4-8 weeks' },
        { title: 'B-1/B-2 Visitor Visa', slug: 'b1b2-visitor', fees: 'USD 185', duration: 'Up to 6 months', processingTime: '4-12 weeks' },
      ],
    },
  ];

  for (const [ci, c] of countrySeed.entries()) {
    const country = await upsert(Country, { slug: c.slug }, {
      name: c.name,
      slug: c.slug,
      flag: { url: TRAVEL_IMAGES[(ci + 2) % TRAVEL_IMAGES.length] },
      heroImage: { url: TRAVEL_IMAGES[ci % TRAVEL_IMAGES.length] },
      description: c.description,
      overview: c.overview,
      processingTime: c.processingTime,
      fee: c.fee,
      embassyInfo: c.embassyInfo,
      requirements: c.requirements,
      faq: generalFaqs.slice(0, 2).map((f: any) => f._id),
      published: true,
      order: ci,
    });

    for (const [vi, v] of c.visaTypes.entries()) {
      await upsert(
        VisaType,
        { countryId: country._id, slug: v.slug },
        {
          countryId: country._id,
          title: v.title,
          slug: v.slug,
          description: `${v.title} for ${c.name}. Complete application support, document preparation and embassy fee handling.`,
          documents: c.requirements.flatMap((r: any) => r.items),
          eligibility: [`Valid passport`, `Geniune purpose of visit`, `Financial capability`],
          fees: v.fees,
          duration: v.duration,
          processingTime: v.processingTime,
          faq: generalFaqs.map((f: any) => f._id),
          published: true,
          order: vi,
        },
      );
    }
  }
  console.log(`✅ ${countrySeed.length} countries and visa types created`);

  const countrySlugs = countrySeed.map((c) => c.slug);
  const staleCountries = await Country.find({ slug: { $nin: countrySlugs } });
  for (const stale of staleCountries) {
    await VisaType.deleteMany({ countryId: stale._id });
    await stale.deleteOne();
  }
  if (staleCountries.length) console.log(`🗑️  Removed ${staleCountries.length} countries no longer in the list`);

  const testimonials = [
    { name: 'Sarah Ahmed', country: 'Canada', rating: 5, comment: 'Excellent service! Got my student visa in just 2 weeks. The team guided me at every step.', featured: true },
    { name: 'Rafiq Hasan', country: 'Australia', rating: 5, comment: 'Professional team, transparent process, and honest advice. Highly recommended.', featured: true },
    { name: 'Nusrat Jahan', country: 'UK', rating: 5, comment: 'Highly recommended for visa consultancy in Bangladesh. My UK student visa was approved on the first attempt.', featured: true },
    { name: 'Tanim Rahman', country: 'USA', rating: 4, comment: 'They prepared me thoroughly for the visa interview. The mock interviews were very helpful.', featured: false },
    { name: 'Farhana Yasmin', country: 'Germany', rating: 5, comment: 'Very supportive team. They handled everything from admission to visa. Great experience.', featured: true },
    { name: 'Mahmudul Islam', country: 'Malaysia', rating: 4, comment: 'Quick processing and good communication throughout. Thank you Apon Air Travels!', featured: false },
  ];

  for (const [i, t] of testimonials.entries()) {
    await upsert(Testimonial, { name: t.name }, { ...t, published: true, order: i });
  }
  console.log(`✅ ${testimonials.length} testimonials created`);

  const albums = [
    { title: 'Client Visa Success', slug: 'client-visa-success', description: 'Our happy clients receiving their visas', images: TRAVEL_IMAGES.slice(0, 6) },
    { title: 'Our Office', slug: 'our-office', description: 'Inside our Dhaka head office', images: TRAVEL_IMAGES.slice(6, 9) },
    { title: 'Student Farewell', slug: 'student-farewell', description: 'Farewell sessions for outgoing students', images: TRAVEL_IMAGES.slice(3, 8) },
  ];

  for (const [i, a] of albums.entries()) {
    await upsert(GalleryAlbum, { slug: a.slug }, {
      title: a.title,
      slug: a.slug,
      description: a.description,
      coverImage: { url: a.images[0] },
      images: a.images.map((url) => ({ url })),
      published: true,
      order: i,
    });
  }
  console.log(`✅ ${albums.length} gallery albums created`);

  const blogSeed = [
    {
      title: 'Complete Guide to Canadian Student Visa in 2026',
      slug: 'canadian-student-visa-guide',
      excerpt: 'Everything you need to know about the Canada study permit application process.',
      content: 'Canada remains one of the most popular destinations for international students.\n\nIn this guide, we walk through the complete application process, document checklist, financial requirements, and timelines for the Canadian study permit in 2026.',
      category: 'Student Visa',
      tags: ['Canada', 'Study Permit'],
      published: true,
      featured: true,
    },
    {
      title: 'Australia Student Visa: Step by Step Process',
      slug: 'australia-student-visa-process',
      excerpt: 'A detailed walkthrough of the Subclass 500 visa application for Bangladesh students.',
      content: 'The Australian student visa (Subclass 500) allows international students to study in Australia.\n\nThis article covers the Genuine Student Test, financial evidence requirements, and what to expect at each stage of the application.',
      category: 'Student Visa',
      tags: ['Australia', 'Subclass 500'],
      published: true,
      featured: true,
    },
    {
      title: 'Top 5 Mistakes to Avoid in Your Visa Application',
      slug: 'top-5-visa-application-mistakes',
      excerpt: 'Avoid these common pitfalls that lead to visa refusals.',
      content: 'Many visa applications are refused due to avoidable mistakes. In this post we cover the five most common errors: incomplete documentation, inconsistent information, insufficient funds, weak statements of purpose, and poor interview preparation.',
      category: 'Tips',
      tags: ['Tips', 'Refusals'],
      published: true,
      featured: false,
    },
    {
      title: 'Why Germany is a Great Choice for Higher Studies',
      slug: 'germany-higher-studies-guide',
      excerpt: 'Tuition-free education, strong economy, and excellent career prospects.',
      content: 'Germany offers tuition-free education at public universities, making it an increasingly popular destination for Bangladeshi students.\n\nLearn about the visa process, blocked accounts, and how to settle into German student life.',
      category: 'Study Abroad',
      tags: ['Germany', 'Study Abroad'],
      published: true,
      featured: false,
    },
    {
      title: 'Understanding the UK Student Visa (Tier 4) Requirements',
      slug: 'uk-student-visa-requirements',
      excerpt: 'What you need to know about the UK Student visa, CAS, and financial requirements.',
      content: 'The UK Student visa route replaced the Tier 4 visa. Applicants need a Confirmation of Acceptance for Studies (CAS) and must meet strict financial and English language requirements.\n\nThis guide breaks down everything you need to prepare.',
      category: 'Student Visa',
      tags: ['UK', 'CAS'],
      published: true,
      featured: false,
    },
  ];

  for (const [i, b] of blogSeed.entries()) {
    await upsert(BlogPost, { slug: b.slug }, {
      ...b,
      author: 'Apon Air Travels',
      coverImage: { url: TRAVEL_IMAGES[i % TRAVEL_IMAGES.length] },
      readingTime: 5,
      seo: { title: b.title, description: b.excerpt, keywords: b.tags },
      publishedAt: new Date(Date.now() - i * 86400000),
    });
  }
  console.log(`✅ ${blogSeed.length} blog posts created`);

  await upsert(Office, { branch: 'Head Office' }, {
    branch: 'Head Office',
    address: { street: '123, Gulshan Avenue', city: 'Dhaka', country: 'Bangladesh' },
    phone: '+880-1234-567890',
    email: 'info@aponairtravels.com',
    mapEmbedUrl: 'https://www.google.com/maps/embed?pb=Dhaka',
    workingHours: [
      { day: 'Saturday - Thursday', open: '10:00', close: '19:00', closed: false },
      { day: 'Friday', open: '', close: '', closed: true },
    ],
    isHeadOffice: true,
    published: true,
  });
  console.log('✅ Office created');

  const heroSlides = [
    {
      title: 'Your Journey Begins Here',
      subtitle: 'Trusted visa consultancy for students, tourists, and business professionals.',
      backgroundImage: { url: TRAVEL_IMAGES[0] },
      buttons: [
        { label: 'Explore Countries', href: '/countries', variant: 'primary' },
        { label: 'Contact Us', href: '/contact', variant: 'secondary' },
      ],
      highlights: ['95% Success Rate', '5000+ Happy Clients', '20+ Countries'],
      order: 0,
      published: true,
    },
    {
      title: 'Study Abroad Made Easy',
      subtitle: 'Complete support for student visas to Canada, Australia, UK, USA, and more.',
      backgroundImage: { url: TRAVEL_IMAGES[3] },
      buttons: [
        { label: 'Our Services', href: '/services', variant: 'primary' },
        { label: 'Apply Now', href: '/contact', variant: 'secondary' },
      ],
      highlights: ['Expert Consultants', 'University Admissions', 'End-to-End Support'],
      order: 1,
      published: true,
    },
  ];

  for (const h of heroSlides) {
    await upsert(HeroSlide, { title: h.title }, h);
  }
  console.log(`✅ ${heroSlides.length} hero slides created`);

  const pages = [
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      content: 'We value your privacy. This policy explains what information we collect, how we use it, and how we protect your personal data. We only collect information required to provide our visa and travel services and never share your data with third parties without consent.',
      template: 'default',
      published: true,
    },
    {
      title: 'Terms of Service',
      slug: 'terms-of-service',
      content: 'By using our services you agree to the following terms. All fees and processing times are estimates and may vary based on embassy decisions. We are not responsible for decisions made by immigration authorities.',
      template: 'default',
      published: true,
    },
    {
      title: 'Our Team',
      slug: 'our-team',
      content: 'Our team of experienced visa consultants, immigration advisors, and travel experts is dedicated to helping you achieve your international goals. Meet the people who make your journey smooth and stress-free.',
      template: 'default',
      published: true,
    },
  ];

  for (const p of pages) {
    await upsert(Page, { slug: p.slug }, p);
  }
  console.log(`✅ ${pages.length} custom pages created`);

  await disconnectDB();
  console.log('🎉 Seeding complete!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
