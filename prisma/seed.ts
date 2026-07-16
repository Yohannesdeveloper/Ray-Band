import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

// ── Helpers ──────────────────────────────────────────
const d = (y: number, m: number, day: number) => new Date(y, m - 1, day);
const j = (val: unknown) => JSON.stringify(val);

const TAGS = {
  entertainment: j(['entertainment', 'events', 'music']),
  tech: j(['tech', 'digital', 'innovation']),
  finance: j(['finance', 'banking', 'payment']),
  telecom: j(['telecom', 'mobile', 'connectivity']),
  aviation: j(['aviation', 'travel', 'airline']),
  beverage: j(['beverage', 'brewery', 'lifestyle']),
  education: j(['education', 'youth', 'training']),
  government: j(['government', 'public', 'policy']),
};

// ── Main ─────────────────────────────────────────────
async function main() {
  console.log('🎭 Seeding Ray Entertainment & Promotion ERP...\n');

  // Clean
  console.log('🧹 Cleaning old data...');
  const tables = [
    'AuditLog', 'Notification', 'FinancialTransaction', 'MediaAsset',
    'LegalDocument', 'Proposal', 'FundingOpportunity',
    'PartnershipContact', 'PartnerDocument', 'Partnership',
    'Communication', 'Sponsorship', 'SponsorContact', 'Sponsor',
    'EventExpense', 'EventTask', 'EventMedia', 'Event',
    'LessonProgress', 'Enrollment', 'CourseReview', 'Lesson', 'Course',
    'StaffMember', 'User',
  ];
  for (const t of tables) {
    await prisma.$executeRawUnsafe(`DELETE FROM "${t}"`);
  }
  console.log('  Done.\n');

  // ─── Staff Members ─────────────────────────────────
  console.log('👨‍💼 Seeding staff...');
  const staffData = [
    { name: 'Dawit Mekonnen', role: 'band_manager', email: 'dawit@rayent.et', phone: '+251911223344', department: 'Operations', hourlyRate: 450, contractType: 'full_time' as const, hireDate: d(2015, 3, 1), skills: j(['band_management', 'scheduling', 'negotiation']), bio: 'Senior band manager with 10+ years in Ethiopian live music.' },
    { name: 'Sara Tadesse', role: 'sound_engineer', email: 'sara@rayent.et', phone: '+251922334455', department: 'Technical', hourlyRate: 550, contractType: 'full_time' as const, hireDate: d(2016, 7, 15), skills: j(['live_sound', 'mixing', 'studio_recording']), bio: 'Award-winning sound engineer specialized in large-format concerts.' },
    { name: 'Yonathan Gebre', role: 'marketing', email: 'yonathan@rayent.et', phone: '+251933445566', department: 'Marketing', hourlyRate: 400, contractType: 'full_time' as const, hireDate: d(2018, 1, 10), skills: j(['digital_marketing', 'social_media', 'branding']), bio: 'Digital marketing lead driving brand growth across East Africa.' },
    { name: 'Hana Desta', role: 'photographer', email: 'hana@rayent.et', phone: '+251944556677', department: 'Creative', hourlyRate: 350, contractType: 'freelance' as const, hireDate: d(2019, 5, 20), skills: j(['event_photography', 'portrait', 'post_processing']), bio: 'Freelance photographer capturing Ethiopia\'s vibrant entertainment scene.' },
    { name: 'Abebe Kebede', role: 'finance', email: 'abebe@rayent.et', phone: '+251955667788', department: 'Finance', hourlyRate: 500, contractType: 'full_time' as const, hireDate: d(2017, 9, 1), skills: j(['accounting', 'financial_planning', 'tax_compliance']), bio: 'CPA-qualified finance manager overseeing budgets and compliance.' },
    { name: 'Meron Alemayehu', role: 'event_manager', email: 'meron@rayent.et', phone: '+251966778899', department: 'Operations', hourlyRate: 480, contractType: 'full_time' as const, hireDate: d(2020, 2, 14), skills: j(['event_planning', 'vendor_management', 'logistics']), bio: 'Detail-oriented event manager specializing in corporate and festival events.' },
  ];
  const staff = [];
  for (const s of staffData) {
    staff.push(await prisma.staffMember.create({ data: s }));
  }
  console.log(`  Created ${staff.length} staff members.`);

  // ─── Users ─────────────────────────────────────────
  console.log('👤 Seeding users...');
  const usersData = [
    { clerkId: 'user_admin_01_ray2026', email: 'admin@rayentertainment.com', firstName: 'Tewodros', lastName: 'Assefa', role: 'admin', phone: '+251911000001', department: 'Administration' },
    { clerkId: 'user_mgr_02_ray2026', email: 'manager@rayentertainment.com', firstName: 'Liya', lastName: 'Worku', role: 'manager', phone: '+251911000002', department: 'Operations' },
    { clerkId: 'user_cust_03_ray2026', email: 'client@example.com', firstName: 'Samuel', lastName: 'Haile', role: 'customer', phone: '+251911000003' },
  ];
  const users = [];
  for (const u of usersData) {
    users.push(await prisma.user.create({ data: u }));
  }
  console.log(`  Created ${users.length} users.`);

  // ─── Events ────────────────────────────────────────
  console.log('🎪 Seeding events...');
  const eventsData = [
    { name: 'Addis Vibes Music Festival 2026', slug: 'addis-vibes-music-festival-2026', category: 'festival', status: 'preparation', priority: 'high', venue: 'Bole Medhanealem Grounds', venueAddress: 'Bole Road, Addis Ababa', capacity: 15000, budget: 2500000, estimatedCost: 2100000, revenueProjection: 3200000, ticketPrice: 1500, ticketType: 'general', eventDate: d(2026, 9, 12), eventEndDate: d(2026, 9, 13), startTime: '14:00', endTime: '23:00', description: 'Two-day outdoor music festival featuring top Ethiopian artists.', organizer: 'Ray Entertainment', tags: j(['festival', 'music', 'outdoor']), contactName: 'Meron Alemayehu', contactEmail: 'meron@rayent.et', contactPhone: '+251966778899', creatorId: users[1].id },
    { name: 'Ethio Telecom Annual Gala', slug: 'ethio-telecom-annual-gala-2026', category: 'corporate', status: 'marketing', priority: 'normal', venue: 'Sheraton Addis Grand Ballroom', venueAddress: 'Taitu Street, Addis Ababa', capacity: 500, budget: 850000, estimatedCost: 780000, revenueProjection: 1200000, eventDate: d(2026, 8, 22), startTime: '18:00', endTime: '23:30', description: 'Annual corporate gala celebrating telecom milestones.', organizer: 'Ethio Telecom', tags: j(['corporate', 'gala', 'luxury']), contactName: 'Alem Mulugeta', contactEmail: 'alem@ethiotelecom.et', contactPhone: '+251911555000', creatorId: users[0].id },
    { name: 'Abebe & Tigist Wedding', slug: 'abebe-tigist-wedding-aug2026', category: 'wedding', status: 'contract_signed', priority: 'normal', venue: 'Skylight Hotel Banquet Hall', venueAddress: 'Airport Road, Addis Ababa', capacity: 350, budget: 450000, estimatedCost: 420000, revenueProjection: 550000, ticketType: 'invite_only', eventDate: d(2026, 8, 15), startTime: '16:00', endTime: '23:00', description: 'Traditional and modern wedding celebration.', organizer: 'Private Client', tags: j(['wedding', 'traditional', 'celebration']), contactName: 'Abebe Tesfaye', contactEmail: 'abebe.t@gmail.com', contactPhone: '+251911222333', creatorId: users[1].id },
    { name: 'AAU Tech Innovation Summit', slug: 'aau-tech-innovation-summit-2026', category: 'university', status: 'planning', priority: 'normal', venue: 'AAU Sidist Kilo Campus', venueAddress: 'Sidist Kilo, Addis Ababa', capacity: 800, budget: 350000, estimatedCost: 320000, revenueProjection: 480000, ticketPrice: 200, ticketType: 'student', eventDate: d(2026, 9, 5), startTime: '09:00', endTime: '17:00', description: 'Annual tech summit for university students and startups.', organizer: 'Addis Ababa University', tags: j(['university', 'tech', 'innovation']), contactName: 'Dr. Fikru Lemma', contactEmail: 'fikru@aau.edu.et', contactPhone: '+251911333444', creatorId: users[0].id },
    { name: 'Ray Entertainment Year-End Concert', slug: 'ray-year-end-concert-2026', category: 'concert', status: 'draft', priority: 'low', venue: 'Millennium Hall', venueAddress: 'Bole, Addis Ababa', capacity: 5000, budget: 1800000, estimatedCost: 1600000, revenueProjection: 2800000, ticketPrice: 500, ticketType: 'general', eventDate: d(2026, 12, 28), startTime: '17:00', endTime: '02:00', description: 'Grand year-end concert showcasing Ray Entertainment artists.', organizer: 'Ray Entertainment', tags: j(['concert', 'year_end', 'showcase']), contactName: 'Dawit Mekonnen', contactEmail: 'dawit@rayent.et', contactPhone: '+251911223344', creatorId: users[0].id },
  ];
  const events = [];
  for (const e of eventsData) {
    events.push(await prisma.event.create({ data: e }));
  }
  console.log(`  Created ${events.length} events.`);

  // ─── Event Tasks ───────────────────────────────────
  console.log('✅ Seeding event tasks...');
  const taskTemplates: Record<string, Array<{ title: string; stage: string; status: string; priority: string }>> = {
    festival: [
      { title: 'Secure venue permit from Addis Ababa admin', stage: 'planning', status: 'completed', priority: 'high' },
      { title: 'Book headline artists and confirm lineups', stage: 'planning', status: 'in_progress', priority: 'high' },
      { title: 'Set up vendor and food court contracts', stage: 'preparation', status: 'pending', priority: 'normal' },
      { title: 'Launch social media marketing campaign', stage: 'marketing', status: 'pending', priority: 'normal' },
    ],
    corporate: [
      { title: 'Finalize event brief with Ethio Telecom', stage: 'planning', status: 'completed', priority: 'high' },
      { title: 'Arrange AV equipment and staging', stage: 'preparation', status: 'in_progress', priority: 'normal' },
      { title: 'Prepare printed materials and branding', stage: 'marketing', status: 'pending', priority: 'normal' },
    ],
    wedding: [
      { title: 'Confirm catering menu and guest list', stage: 'planning', status: 'completed', priority: 'high' },
      { title: 'Coordinate floral arrangements and decor', stage: 'preparation', status: 'in_progress', priority: 'normal' },
      { title: 'Set up sound system and DJ equipment', stage: 'preparation', status: 'pending', priority: 'normal' },
    ],
    university: [
      { title: 'Coordinate with AAU administration', stage: 'planning', status: 'completed', priority: 'high' },
      { title: 'Recruit speakers and panelists', stage: 'planning', status: 'in_progress', priority: 'high' },
      { title: 'Arrange student volunteer teams', stage: 'preparation', status: 'pending', priority: 'normal' },
      { title: 'Distribute campus promotional flyers', stage: 'marketing', status: 'pending', priority: 'low' },
    ],
    concert: [
      { title: 'Draft artist lineup and budget proposal', stage: 'planning', status: 'pending', priority: 'normal' },
      { title: 'Research venue availability and pricing', stage: 'planning', status: 'pending', priority: 'normal' },
    ],
  };

  let taskCount = 0;
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    const templates = taskTemplates[ev.category] || taskTemplates.concert;
    for (const t of templates) {
      await prisma.eventTask.create({
        data: {
          eventId: ev.id,
          title: t.title,
          stage: t.stage,
          status: t.status,
          priority: t.priority,
          assignedToId: users[i % 2].id,
          dueDate: ev.eventDate ? d(ev.eventDate.getFullYear(), ev.eventDate.getMonth() + 1, ev.eventDate.getDate() - 14) : d(2026, 9, 1),
        },
      });
      taskCount++;
    }
  }
  console.log(`  Created ${taskCount} event tasks.`);

  // ─── Event Expenses ────────────────────────────────
  console.log('💸 Seeding event expenses...');
  const expenseTemplates: { category: string; description: string; amount: number; vendor: string; status: string }[][] = [
    // festival
    [
      { category: 'venue', description: 'Bole Medhanealem ground rental (2 days)', amount: 350000, vendor: 'Addis Ababa City Admin', status: 'approved' },
      { category: 'equipment', description: 'Stage, sound & lighting system rental', amount: 580000, vendor: 'ProSound Ethiopia', status: 'paid' },
      { category: 'catering', description: 'Food court vendor coordination', amount: 220000, vendor: 'Various Vendors', status: 'pending' },
    ],
    // corporate
    [
      { category: 'venue', description: 'Sheraton Grand Ballroom rental', amount: 180000, vendor: 'Sheraton Addis', status: 'paid' },
      { category: 'equipment', description: 'Corporate AV and presentation setup', amount: 95000, vendor: 'Ethio AV Solutions', status: 'approved' },
    ],
    // wedding
    [
      { category: 'catering', description: 'Full dinner service for 350 guests', amount: 175000, vendor: 'Skylight Hotel Catering', status: 'approved' },
      { category: 'equipment', description: 'DJ equipment and sound system', amount: 45000, vendor: 'BeatBox Rentals', status: 'paid' },
      { category: 'transport', description: 'Guest shuttle service', amount: 35000, vendor: 'Addis Trans', status: 'pending' },
    ],
    // university
    [
      { category: 'venue', description: 'AAU campus hall rental', amount: 50000, vendor: 'Addis Ababa University', status: 'approved' },
      { category: 'marketing', description: 'Campus flyers and banners', amount: 25000, vendor: 'PrintHub Addis', status: 'paid' },
    ],
    // concert
    [
      { category: 'venue', description: 'Millennium Hall deposit', amount: 200000, vendor: 'Millennium Hall', status: 'pending' },
      { category: 'equipment', description: 'Concert-grade sound system estimate', amount: 450000, vendor: 'ProSound Ethiopia', status: 'pending' },
    ],
  ];

  let expCount = 0;
  for (let i = 0; i < events.length; i++) {
    for (const ex of expenseTemplates[i]) {
      await prisma.eventExpense.create({
        data: { eventId: events[i].id, ...ex },
      });
      expCount++;
    }
  }
  console.log(`  Created ${expCount} event expenses.`);

  // ─── Sponsors ──────────────────────────────────────
  console.log('🏢 Seeding sponsors...');
  const sponsorsData = [
    { companyName: 'Ethio Telecom', slug: 'ethio-telecom', industry: 'Telecommunications', website: 'https://www.ethiotelecom.et', email: 'info@ethiotelecom.et', phone: '+251115500000', address: 'Old Airport Road', city: 'Addis Ababa', taxId: 'ETH-TEL-001', status: 'active', pipelineStage: 'active', totalValue: 1500000, ceoName: 'Frehiwot Tamiru', marketingDirector: 'Elias Demeke', sponsorshipManager: 'Nahom Yacob', tags: TAGS.telecom },
    { companyName: 'Habesha Breweries', slug: 'habesha-breweries', industry: 'Beverage & Hospitality', website: 'https://www.habeshabreweries.com', email: 'marketing@habesha.com', phone: '+251116780000', address: 'Bole Road', city: 'Addis Ababa', taxId: 'ETH-BRW-002', status: 'active', pipelineStage: 'active', totalValue: 800000, ceoName: 'Dana Rohleder', brandManager: 'Abel Tesfaye', tags: TAGS.beverage },
    { companyName: 'Safaricom Ethiopia', slug: 'safaricom-ethiopia', industry: 'Telecommunications', website: 'https://www.safaricom.et', email: 'partnerships@safaricom.et', phone: '+251900123456', address: 'Cairo Road', city: 'Addis Ababa', taxId: 'ETH-SAF-003', status: 'negotiation', pipelineStage: 'negotiation', totalValue: 600000, ceoName: 'Peter Ndegwa', marketingDirector: 'Zemedeneh Negatu', tags: TAGS.telecom },
    { companyName: 'Dashen Bank', slug: 'dashen-bank', industry: 'Banking & Finance', website: 'https://www.dashenbank.com', email: 'corporate@dashenbank.com', phone: '+251115530000', address: 'Meskel Square', city: 'Addis Ababa', taxId: 'ETH-BNK-004', status: 'proposal_sent', pipelineStage: 'proposal_sent', totalValue: 500000, ceoName: 'Asfaw Alemayehu', financeOfficer: 'Mulugeta Berhanu', tags: TAGS.finance },
    { companyName: 'Ethiopian Airlines', slug: 'ethiopian-airlines', industry: 'Aviation & Travel', website: 'https://www.ethiopianairlines.com', email: 'events@ethiopianairlines.com', phone: '+251115178000', address: 'Bole International Airport', city: 'Addis Ababa', taxId: 'ETH-AIR-005', status: 'initial_contact', pipelineStage: 'initial_contact', totalValue: 1200000, ceoName: 'Mesfin Tasew', prManager: 'Yohannes Tekeste', tags: TAGS.aviation },
  ];
  const sponsors = [];
  for (const s of sponsorsData) {
    sponsors.push(await prisma.sponsor.create({ data: s }));
  }
  console.log(`  Created ${sponsors.length} sponsors.`);

  // ─── Sponsor Contacts ──────────────────────────────
  console.log('📞 Seeding sponsor contacts...');
  const sponsorContactsData: Array<{ sponsorIdx: number; name: string; position: string; email: string; phone: string; isPrimary: boolean }[]> = [
    [{ sponsorIdx: 0, name: 'Nahom Yacob', position: 'Sponsorship Manager', email: 'nahom@ethiotelecom.et', phone: '+251911555001', isPrimary: true }, { sponsorIdx: 0, name: 'Elias Demeke', position: 'Marketing Director', email: 'elias@ethiotelecom.et', phone: '+251911555002', isPrimary: false }],
    [{ sponsorIdx: 1, name: 'Abel Tesfaye', position: 'Brand Manager', email: 'abel@habesha.com', phone: '+251911666001', isPrimary: true }],
    [{ sponsorIdx: 2, name: 'Sara Bekele', position: 'Partnerships Lead', email: 'sara@safaricom.et', phone: '+251900123457', isPrimary: true }],
    [{ sponsorIdx: 3, name: 'Mulugeta Berhanu', position: 'Finance Officer', email: 'mulugeta@dashenbank.com', phone: '+251911777001', isPrimary: true }, { sponsorIdx: 3, name: 'Fatima Abdi', position: 'Corporate Relations', email: 'fatima@dashenbank.com', phone: '+251911777002', isPrimary: false }],
    [{ sponsorIdx: 4, name: 'Yohannes Tekeste', position: 'PR Manager', email: 'yohannes@ethiopianairlines.com', phone: '+251911888001', isPrimary: true }],
  ];
  let contactCount = 0;
  for (const group of sponsorContactsData) {
    for (const c of group) {
      await prisma.sponsorContact.create({ data: { sponsorId: sponsors[c.sponsorIdx].id, name: c.name, position: c.position, email: c.email, phone: c.phone, isPrimary: c.isPrimary } });
      contactCount++;
    }
  }
  console.log(`  Created ${contactCount} sponsor contacts.`);

  // ─── Sponsorships ──────────────────────────────────
  console.log('🤝 Seeding sponsorships...');
  const sponsorshipData = [
    { sponsorIdx: 0, name: 'Ethio Telecom – Addis Vibes Festival 2026', packageType: 'platinum', amount: 1500000, status: 'active', startDate: d(2026, 6, 1), endDate: d(2026, 9, 30), eventId: events[0].id, benefits: j(['main_stage_branding', 'vip_lounge', '30s_ad_spot', 'social_media_package']), brandingOpportunities: j(['stageBackdrop', 'ledScreens', 'bannerPlacement']), marketingExposure: j(['tv_commercials', 'radio_spots', 'social_media']), digitalPromotion: j(['facebook_ads', 'instagram_stories', 'tiktok']),
      vipBenefits: '10 VIP passes, backstage access', stageBranding: 'Main stage title sponsor', mediaCoverage: 'TV and online coverage' },
    { sponsorIdx: 1, name: 'Habesha Breweries – Corporate Gala 2026', packageType: 'gold', amount: 500000, status: 'active', startDate: d(2026, 7, 1), endDate: d(2026, 8, 31), eventId: events[1].id, benefits: j(['beverage_exclusive', 'logo_placement', 'table_sponsorship']), brandingOpportunities: j(['welcomeDrinkBranding', 'tableCards']), digitalPromotion: j(['instagram_mentions']),
      vipBenefits: '5 VIP seats', stageBranding: 'Beverage partner banner', mediaCoverage: 'Online features' },
    { sponsorIdx: 3, name: 'Dashen Bank – Year-End Concert 2026', packageType: 'silver', amount: 300000, status: 'proposed', startDate: d(2026, 11, 1), endDate: d(2026, 12, 31), eventId: events[4].id, benefits: j(['logo_placement', 'ticket_giveaway']), brandingOpportunities: j(['programAd', 'bannerPlacement']),
      vipBenefits: '20 complimentary tickets', stageBranding: 'Silver sponsor banner', mediaCoverage: 'Social media mentions' },
    { sponsorIdx: 2, name: 'Safaricom Ethiopia – Tech Summit', packageType: 'gold', amount: 400000, status: 'proposed', startDate: d(2026, 8, 1), endDate: d(2026, 9, 15), eventId: events[3].id, benefits: j(['booth_space', 'speaker_slot', 'logo_placement']), brandingOpportunities: j(['registrationDesk', 'lanyardBranding']), digitalPromotion: j(['linkedin_campaign', 'email_feature']),
      vipBenefits: '3 speaker passes', stageBranding: 'Tech partner logo wall', mediaCoverage: 'Tech press coverage' },
  ];
  const sponsorships = [];
  for (const s of sponsorshipData) {
    const { sponsorIdx, ...rest } = s;
    sponsorships.push(await prisma.sponsorship.create({ data: { sponsorId: sponsors[sponsorIdx].id, ...rest } }));
  }
  console.log(`  Created ${sponsorships.length} sponsorships.`);

  // ─── Communications ────────────────────────────────
  console.log('📧 Seeding communications...');
  const commData: Array<{ sponsorIdx: number; type: string; direction: string; subject: string; content: string; contactName: string; contactEmail: string; followUpDate?: Date; completed: boolean }> = [
    { sponsorIdx: 0, type: 'meeting', direction: 'outbound', subject: 'Sponsorship Renewal Discussion', content: 'Met with Nahom to discuss Platinum package renewal for 2027. Positive reception.', contactName: 'Nahom Yacob', contactEmail: 'nahom@ethiotelecom.et', followUpDate: d(2026, 8, 1), completed: false },
    { sponsorIdx: 1, type: 'email', direction: 'outbound', subject: 'Gala Sponsorship Confirmation', content: 'Sent final sponsorship agreement for Ethio Telecom Annual Gala. Awaiting signature.', contactName: 'Abel Tesfaye', contactEmail: 'abel@habesha.com', completed: true },
    { sponsorIdx: 2, type: 'phone', direction: 'inbound', subject: 'Inquiry about Tech Summit Packages', content: 'Safaricom called asking about Gold package for the university tech summit.', contactName: 'Sara Bekele', contactEmail: 'sara@safaricom.et', followUpDate: d(2026, 7, 25), completed: false },
    { sponsorIdx: 3, type: 'email', direction: 'outbound', subject: 'Dashen Bank Proposal Follow-up', content: 'Following up on Silver sponsorship proposal sent last week for Year-End Concert.', contactName: 'Mulugeta Berhanu', contactEmail: 'mulugeta@dashenbank.com', followUpDate: d(2026, 7, 30), completed: false },
    { sponsorIdx: 4, type: 'meeting', direction: 'outbound', subject: 'Partnership Exploration Meeting', content: 'Initial meeting with Ethiopian Airlines PR team to explore aviation sponsorship.', contactName: 'Yohannes Tekeste', contactEmail: 'yohannes@ethiopianairlines.com', completed: true },
  ];
  let commCount = 0;
  for (const c of commData) {
    const { sponsorIdx, ...rest } = c;
    await prisma.communication.create({ data: { sponsorId: sponsors[sponsorIdx].id, ...rest } });
    commCount++;
  }
  console.log(`  Created ${commCount} communications.`);

  // ─── Partnerships ──────────────────────────────────
  console.log('🏛️ Seeding partnerships...');
  const partnershipsData = [
    { organizationName: 'Addis Ababa Culture and Tourism Bureau', slug: 'addis-ababa-culture-tourism', category: 'government', status: 'active', email: 'info@aacitytourism.gov.et', phone: '+251115510000', address: 'Arada sub-city', city: 'Addis Ababa', primaryContactName: 'Ato Girma Birru', primaryContactEmail: 'girma@aacitytourism.gov.et', primaryContactPosition: 'Director of Events', department: 'Events & Festivals', partnershipType: 'venue', description: 'Government partner for public entertainment permits and venue access.', totalValue: 2000000, tags: j(['government', 'permits', 'public_events']) },
    { organizationName: 'Addis Ababa University', slug: 'addis-ababa-university', category: 'university', status: 'active', email: 'partnerships@aau.edu.et', phone: '+251111234567', address: 'Sidist Kilo Campus', city: 'Addis Ababa', primaryContactName: 'Dr. Fikru Lemma', primaryContactEmail: 'fikru@aau.edu.et', primaryContactPosition: 'Dean of Technology Faculty', department: 'Faculty of Technology', partnershipType: 'training', description: 'Academic partner for tech events and student talent development.', totalValue: 500000, tags: j(['university', 'education', 'youth']) },
    { organizationName: 'Skylight Hotel', slug: 'skylight-hotel', category: 'hotel', status: 'active', email: 'events@skylighthotel.com', phone: '+251116610000', address: 'Airport Road', city: 'Addis Ababa', primaryContactName: 'Yonas Tadesse', primaryContactEmail: 'yonas@skylighthotel.com', primaryContactPosition: 'Events Director', department: 'Banquet & Events', partnershipType: 'venue', description: 'Premium venue partner for weddings and corporate events.', totalValue: 1500000, tags: j(['hotel', 'venue', 'luxury']) },
    { organizationName: 'Dashen Bank Corporate Division', slug: 'dashen-bank-corporate', category: 'corporate', status: 'negotiating', email: 'corporate@dashenbank.com', phone: '+251115530000', address: 'Meskel Square', city: 'Addis Ababa', primaryContactName: 'Ato Asfaw Alemayehu', primaryContactEmail: 'asfaw@dashenbank.com', primaryContactPosition: 'CEO', department: 'Corporate Banking', partnershipType: 'sponsorship', description: 'Financial services partner exploring co-branded entertainment financing.', totalValue: 800000, tags: j(['banking', 'finance', 'corporate']) },
  ];
  const partnerships = [];
  for (const p of partnershipsData) {
    partnerships.push(await prisma.partnership.create({ data: p }));
  }
  console.log(`  Created ${partnerships.length} partnerships.`);

  // ─── Partnership Contacts ──────────────────────────
  console.log('📞 Seeding partnership contacts...');
  const pcData: Array<{ partnershipIdx: number; name: string; department: string; position: string; email: string; phone: string; isPrimary: boolean }[]> = [
    [{ partnershipIdx: 0, name: 'Girma Birru', department: 'Events', position: 'Director of Events', email: 'girma@aacitytourism.gov.et', phone: '+251911900001', isPrimary: true }, { partnershipIdx: 0, name: 'Tigist Haile', department: 'Permits', position: 'Liaison Officer', email: 'tigist@aacitytourism.gov.et', phone: '+251911900002', isPrimary: false }],
    [{ partnershipIdx: 1, name: 'Dr. Fikru Lemma', department: 'Technology', position: 'Dean', email: 'fikru@aau.edu.et', phone: '+251911900003', isPrimary: true }],
    [{ partnershipIdx: 2, name: 'Yonas Tadesse', department: 'Banquet & Events', position: 'Events Director', email: 'yonas@skylighthotel.com', phone: '+251911900004', isPrimary: true }, { partnershipIdx: 2, name: 'Dawit Solomon', department: 'Sales', position: 'Group Sales Manager', email: 'dawit@skylighthotel.com', phone: '+251911900005', isPrimary: false }],
    [{ partnershipIdx: 3, name: 'Asfaw Alemayehu', department: 'Corporate', position: 'CEO', email: 'asfaw@dashenbank.com', phone: '+251911900006', isPrimary: true }],
  ];
  let pcCount = 0;
  for (const group of pcData) {
    for (const c of group) {
      const { partnershipIdx, ...rest } = c;
      await prisma.partnershipContact.create({ data: { partnershipId: partnerships[partnershipIdx].id, ...rest } });
      pcCount++;
    }
  }
  console.log(`  Created ${pcCount} partnership contacts.`);

  // ─── Funding Opportunities ─────────────────────────
  console.log('💰 Seeding funding opportunities...');
  const fundingData = [
    { partnershipId: partnerships[0].id, title: 'Addis Ababa Cultural Events Grant 2026', source: 'Addis Ababa Culture Bureau', amount: 500000, deadline: d(2026, 10, 15), status: 'applied', description: 'Annual government grant for cultural and entertainment events promoting tourism.', requirements: 'Must be registered entertainment company with 2+ years history.' },
    { partnershipId: partnerships[1].id, title: 'AAU Innovation Hub Youth Fund', source: 'Addis Ababa University', amount: 200000, deadline: d(2026, 11, 30), status: 'identified', description: 'University fund supporting tech-driven entertainment and media projects.', requirements: 'Partnership with academic institution required.' },
    { partnershipId: null, title: 'Ethiopian Tourism Board Event Sponsorship', source: 'Ethiopian Tourism Organization', amount: 800000, deadline: d(2026, 12, 1), status: 'identified', description: 'National tourism board funding for events that promote Ethiopian culture internationally.', requirements: 'International media coverage and cultural significance.' },
  ];
  const fundingOpps = [];
  for (const f of fundingData) {
    fundingOpps.push(await prisma.fundingOpportunity.create({ data: f }));
  }
  console.log(`  Created ${fundingOpps.length} funding opportunities.`);

  // ─── Proposals ─────────────────────────────────────
  console.log('📄 Seeding proposals...');
  const proposalsData = [
    { title: 'Sponsorship Proposal – Addis Vibes 2026', type: 'sponsorship', status: 'sent', recipientName: 'Nahom Yacob', recipientEmail: 'nahom@ethiotelecom.et', recipientOrg: 'Ethio Telecom', subject: 'Platinum Sponsorship for Addis Vibes Music Festival 2026', executiveSummary: 'Exclusive platinum sponsorship opportunity for Ethiopia\'s largest outdoor music festival.', amount: 1500000, sponsorId: sponsors[0].id, eventId: events[0].id, authorId: users[0].id, validUntil: d(2026, 8, 15), sentAt: d(2026, 6, 15) },
    { title: 'Corporate Partnership – Dashen Bank', type: 'corporate', status: 'review', recipientName: 'Asfaw Alemayehu', recipientEmail: 'asfaw@dashenbank.com', recipientOrg: 'Dashen Bank', subject: 'Year-End Concert Silver Sponsorship Partnership', executiveSummary: 'Silver-level partnership with Ray Entertainment for brand exposure at year-end concert.', amount: 300000, sponsorId: sponsors[3].id, eventId: events[4].id, authorId: users[1].id, validUntil: d(2026, 11, 30) },
    { title: 'Partnership Proposal – Safaricom Tech Summit', type: 'partnership', status: 'draft', recipientName: 'Sara Bekele', recipientEmail: 'sara@safaricom.et', recipientOrg: 'Safaricom Ethiopia', subject: 'Gold Sponsorship for AAU Tech Innovation Summit', executiveSummary: 'Technology-focused sponsorship reaching 800+ university students and startups.', amount: 400000, sponsorId: sponsors[2].id, eventId: events[3].id, authorId: users[0].id, validUntil: d(2026, 8, 30) },
    { title: 'Event Sponsorship – Habesha Breweries Gala', type: 'sponsorship', status: 'accepted', recipientName: 'Abel Tesfaye', recipientEmail: 'abel@habesha.com', recipientOrg: 'Habesha Breweries', subject: 'Gold Beverage Partner for Ethio Telecom Annual Gala', executiveSummary: 'Exclusive beverage sponsorship for the corporate gala event.', amount: 500000, sponsorId: sponsors[1].id, eventId: events[1].id, authorId: users[1].id, validUntil: d(2026, 7, 31), sentAt: d(2026, 6, 20), responseAt: d(2026, 7, 5) },
    { title: 'Government Partnership – Venue Permit', type: 'government', status: 'accepted', recipientName: 'Girma Birru', recipientEmail: 'girma@aacitytourism.gov.et', recipientOrg: 'Addis Ababa Culture Bureau', subject: 'Event Permit Application – Addis Vibes Festival 2026', executiveSummary: 'Formal permit request for outdoor music festival at Bole Medhanealem.', authorId: users[1].id, validUntil: d(2026, 8, 1), sentAt: d(2026, 5, 10), responseAt: d(2026, 6, 1) },
  ];
  const proposals = [];
  for (const p of proposalsData) {
    proposals.push(await prisma.proposal.create({ data: p }));
  }
  console.log(`  Created ${proposals.length} proposals.`);

  // ─── Legal Documents ───────────────────────────────
  console.log('📜 Seeding legal documents...');
  const legalDocsData = [
    { title: 'Ray Entertainment Business License 2026', category: 'business_registration', subcategory: 'business_license', description: 'Annual business operating license for entertainment services.', issueDate: d(2026, 1, 1), expirationDate: d(2026, 12, 31), issuingAuthority: 'Addis Ababa Trade Bureau', documentNumber: 'BA-LIC-2026-0451', status: 'active', version: 1, approvalStatus: 'approved', approvedBy: 'Ato Tewodros Assefa', tags: j(['business', 'license', 'annual']) },
    { title: 'TIN Certificate – Ray Entertainment', category: 'tax_finance', subcategory: 'tin_certificate', description: 'Tax Identification Number certificate from Ethiopian Revenue Authority.', issueDate: d(2023, 4, 15), issuingAuthority: 'Ethiopian Revenue and Customs Authority', documentNumber: 'TIN-1234567890', status: 'active', version: 1, approvalStatus: 'approved', tags: j(['tax', 'tin', 'compliance']) },
    { title: 'Music Performance Copyright Registration', category: 'entertainment', subcategory: 'copyright', description: 'Copyright registration for original compositions performed by Ray Entertainment artists.', issueDate: d(2025, 6, 20), issuingAuthority: 'Ethiopian Intellectual Property Office', documentNumber: 'COPY-ET-2025-0088', status: 'active', version: 1, approvalStatus: 'approved', tags: j(['copyright', 'music', 'intellectual_property']) },
    { title: 'Event Permit – Addis Vibes Festival 2026', category: 'entertainment', subcategory: 'event_permit', description: 'Public event permit for outdoor music festival at Bole Medhanealem Grounds.', issueDate: d(2026, 7, 1), expirationDate: d(2026, 9, 20), issuingAuthority: 'Addis Ababa City Administration', documentNumber: 'EVT-2026-AV-001', status: 'active', version: 1, approvalStatus: 'approved', approvedBy: 'Ato Girma Birru', tags: j(['event', 'permit', 'outdoor', 'festival']) },
  ];
  const legalDocs = [];
  for (const l of legalDocsData) {
    legalDocs.push(await prisma.legalDocument.create({ data: l }));
  }
  console.log(`  Created ${legalDocs.length} legal documents.`);

  // ─── Media Assets ──────────────────────────────────
  console.log('🖼️ Seeding media assets...');
  const mediaData = [
    { title: 'Ray Entertainment Logo – Primary', type: 'logo', category: 'brand', description: 'Official primary logo in high resolution.', fileUrl: '/assets/media/ray-logo-primary.png', fileName: 'ray-logo-primary.png', fileSize: 245000, mimeType: 'image/png', featured: true, tags: j(['logo', 'brand', 'primary']) },
    { title: 'Addis Vibes 2025 Highlight Reel', type: 'video', category: 'portfolio', description: '60-second highlight video from last year\'s festival.', fileUrl: '/assets/media/addis-vibes-2025-highlights.mp4', fileName: 'addis-vibes-2025-highlights.mp4', fileSize: 52000000, mimeType: 'video/mp4', featured: true, downloadCount: 124, tags: j(['video', 'highlight', 'festival']) },
    { title: 'Corporate Event Portfolio 2026', type: 'document', category: 'portfolio', description: 'PDF portfolio showcasing recent corporate events.', fileUrl: '/assets/media/corporate-portfolio-2026.pdf', fileName: 'corporate-portfolio-2026.pdf', fileSize: 8300000, mimeType: 'application/pdf', featured: false, downloadCount: 45, tags: j(['document', 'portfolio', 'corporate']) },
    { title: 'Sheraton Gala 2025 – Photo Set', type: 'image', category: 'performance', description: 'Professional photography from Ethio Telecom Gala 2025.', fileUrl: '/assets/media/gala-2025-photos.zip', fileName: 'gala-2025-photos.zip', fileSize: 125000000, mimeType: 'application/zip', downloadCount: 32, tags: j(['photos', 'gala', 'corporate']) },
    { title: 'Brand Guidelines – Ray Entertainment', type: 'brand_guide', category: 'brand', description: 'Complete brand guidelines document including colors, fonts, and usage.', fileUrl: '/assets/media/brand-guidelines.pdf', fileName: 'brand-guidelines.pdf', fileSize: 4500000, mimeType: 'application/pdf', featured: true, tags: j(['brand', 'guidelines', 'design']) },
  ];
  const mediaAssets = [];
  for (const m of mediaData) {
    mediaAssets.push(await prisma.mediaAsset.create({ data: m }));
  }
  console.log(`  Created ${mediaAssets.length} media assets.`);

  // ─── Financial Transactions ────────────────────────
  console.log('💹 Seeding financial transactions...');
  const txData = [
    { type: 'income', category: 'sponsorship', description: 'Ethio Telecom – Addis Vibes Platinum Sponsorship', amount: 1500000, reference: 'INV-2026-001', paymentMethod: 'bank_transfer', eventId: events[0].id, sponsorId: sponsors[0].id, transactionDate: d(2026, 6, 20) },
    { type: 'income', category: 'sponsorship', description: 'Habesha Breweries – Corporate Gala Gold Sponsorship', amount: 500000, reference: 'INV-2026-002', paymentMethod: 'bank_transfer', eventId: events[1].id, sponsorId: sponsors[1].id, transactionDate: d(2026, 7, 10) },
    { type: 'income', category: 'event_revenue', description: 'Early bird ticket sales – Addis Vibes Festival', amount: 450000, reference: 'TX-EARLY-001', paymentMethod: 'mobile_money', eventId: events[0].id, transactionDate: d(2026, 7, 1) },
    { type: 'expense', category: 'venue', description: 'Venue deposit – Bole Medhanealem Grounds', amount: 350000, reference: 'REC-2026-001', paymentMethod: 'bank_transfer', eventId: events[0].id, transactionDate: d(2026, 6, 1) },
    { type: 'expense', category: 'equipment', description: 'Sound & lighting rental – ProSound Ethiopia', amount: 580000, reference: 'REC-2026-002', paymentMethod: 'bank_transfer', eventId: events[0].id, transactionDate: d(2026, 7, 15) },
    { type: 'expense', category: 'salary', description: 'Monthly staff salaries – July 2026', amount: 280000, reference: 'SAL-2026-07', paymentMethod: 'bank_transfer', transactionDate: d(2026, 7, 30) },
    { type: 'expense', category: 'marketing', description: 'Social media ad campaigns – August promotions', amount: 75000, reference: 'MKT-2026-08', paymentMethod: 'card', transactionDate: d(2026, 8, 1) },
    { type: 'income', category: 'course_enrollment', description: 'Online music production course enrollments (12 students)', amount: 96000, reference: 'CRS-2026-Q3', paymentMethod: 'mobile_money', transactionDate: d(2026, 7, 20) },
  ];
  const txs = [];
  for (const t of txData) {
    txs.push(await prisma.financialTransaction.create({ data: t }));
  }
  console.log(`  Created ${txs.length} financial transactions.`);

  // ─── Notifications ─────────────────────────────────
  console.log('🔔 Seeding notifications...');
  const notifData = [
    { userId: users[0].id, title: 'New Sponsorship Received', message: 'Ethio Telecom confirmed Platinum sponsorship for Addis Vibes Festival.', type: 'success', category: 'sponsor', read: true },
    { userId: users[1].id, title: 'Event Permit Approved', message: 'The event permit for Addis Vibes 2026 has been approved by the city administration.', type: 'success', category: 'event', read: false },
    { userId: users[0].id, title: 'Payment Overdue – Dashen Bank', message: 'The Dashen Bank sponsorship payment is 7 days past the agreed date.', type: 'warning', category: 'payment', read: false },
    { userId: users[1].id, title: 'Task Due Soon', message: 'Book headline artists task for Addis Vibes is due in 3 days.', type: 'reminder', category: 'task', read: false },
    { userId: users[0].id, title: 'Legal Document Expiring', message: 'The business operating license expires on December 31, 2026. Consider early renewal.', type: 'info', category: 'legal', read: false },
  ];
  const notifs = [];
  for (const n of notifData) {
    notifs.push(await prisma.notification.create({ data: n }));
  }
  console.log(`  Created ${notifs.length} notifications.`);

  // ─── Audit Logs ────────────────────────────────────
  console.log('📋 Seeding audit logs...');
  const auditData = [
    { userId: users[0].id, action: 'create', entity: 'event', entityId: events[0].id, details: j({ field: 'name', newValue: 'Addis Vibes Music Festival 2026' }), ipAddress: '192.168.1.10', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
    { userId: users[1].id, action: 'update', entity: 'sponsor', entityId: sponsors[0].id, details: j({ field: 'status', oldValue: 'proposal_sent', newValue: 'active' }), ipAddress: '192.168.1.20', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' },
    { userId: users[0].id, action: 'approve', entity: 'proposal', entityId: proposals[3].id, details: j({ field: 'status', oldValue: 'review', newValue: 'accepted' }), ipAddress: '192.168.1.10', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
  ];
  const auditLogs = [];
  for (const a of auditData) {
    auditLogs.push(await prisma.auditLog.create({ data: a }));
  }
  console.log(`  Created ${auditLogs.length} audit logs.`);

  // ─── Courses ───────────────────────────────────────
  console.log('🎓 Seeding courses...');
  const coursesData = [
    { title: 'Live Sound Engineering Fundamentals', slug: 'live-sound-engineering-fundamentals', description: 'Master the art of live sound mixing for concerts and events. Learn from professional sound engineers with 10+ years of experience in the Ethiopian entertainment industry.', shortDescription: 'Learn professional live sound mixing for events.', instructor: 'Sara Tadesse', instructorBio: 'Award-winning sound engineer with credits at major Ethiopian festivals.', category: 'technical', level: 'beginner', price: 3500, durationHours: 18, lessonCount: 6, rating: 4.7, reviewCount: 23, enrollmentCount: 89, featured: true, published: true, thumbnailUrl: '/assets/courses/sound-engineering-thumb.jpg' },
    { title: 'Event Planning & Management Masterclass', slug: 'event-planning-management-masterclass', description: 'A comprehensive guide to planning and executing successful events in Ethiopia, from concept to post-event analysis.', shortDescription: 'Plan and manage professional events from start to finish.', instructor: 'Meron Alemayehu', instructorBio: 'Experienced event manager who has organized 200+ events across Ethiopia.', category: 'management', level: 'intermediate', price: 5000, durationHours: 24, lessonCount: 8, rating: 4.8, reviewCount: 41, enrollmentCount: 156, featured: true, published: true, thumbnailUrl: '/assets/courses/event-planning-thumb.jpg' },
    { title: 'Digital Marketing for Entertainment', slug: 'digital-marketing-entertainment', description: 'Grow your entertainment brand online with proven digital marketing strategies tailored for the Ethiopian market.', shortDescription: 'Boost your entertainment brand with digital marketing.', instructor: 'Yonathan Gebre', instructorBio: 'Digital marketing specialist with experience growing brands across East Africa.', category: 'marketing', level: 'beginner', price: 2500, durationHours: 12, lessonCount: 4, rating: 4.5, reviewCount: 18, enrollmentCount: 67, featured: false, published: true, thumbnailUrl: '/assets/courses/digital-marketing-thumb.jpg' },
  ];
  const courses = [];
  for (const c of coursesData) {
    courses.push(await prisma.course.create({ data: c }));
  }
  console.log(`  Created ${courses.length} courses.`);

  // ─── Lessons ───────────────────────────────────────
  console.log('📚 Seeding lessons...');
  const lessonTemplates: { title: string; description: string; durationMinutes: number; order: number; isFree: boolean }[][] = [
    // Course 0: Sound Engineering
    [
      { title: 'Introduction to Sound Systems', description: 'Understanding speakers, amplifiers, mixers, and signal flow.', durationMinutes: 45, order: 1, isFree: true },
      { title: 'Microphone Selection & Placement', description: 'Choosing the right mic for vocals and instruments.', durationMinutes: 35, order: 2, isFree: false },
      { title: 'Live Mixing Techniques', description: 'Hands-on mixing with EQ, compression, and reverb.', durationMinutes: 50, order: 3, isFree: false },
    ],
    // Course 1: Event Planning
    [
      { title: 'Event Concept Development', description: 'Defining your event vision, goals, and target audience.', durationMinutes: 40, order: 1, isFree: true },
      { title: 'Budgeting & Vendor Management', description: 'Creating budgets and negotiating with vendors.', durationMinutes: 55, order: 2, isFree: false },
      { title: 'Day-of-Event Logistics', description: 'Managing timelines, crews, and on-site operations.', durationMinutes: 60, order: 3, isFree: false },
    ],
    // Course 2: Digital Marketing
    [
      { title: 'Social Media Strategy for Events', description: 'Building effective social media campaigns.', durationMinutes: 35, order: 1, isFree: true },
      { title: 'Content Creation & Scheduling', description: 'Creating engaging visual content for entertainment brands.', durationMinutes: 30, order: 2, isFree: false },
      { title: 'Analytics & Optimization', description: 'Measuring performance and optimizing campaigns.', durationMinutes: 25, order: 3, isFree: false },
    ],
  ];

  let lessonCount = 0;
  for (let i = 0; i < courses.length; i++) {
    for (const l of lessonTemplates[i]) {
      await prisma.lesson.create({
        data: { courseId: courses[i].id, ...l, content: `# ${l.title}\n\n${l.description}\n\nThis lesson covers the fundamentals in an easy-to-follow format with practical exercises.` },
      });
      lessonCount++;
    }
  }
  console.log(`  Created ${lessonCount} lessons.`);

  console.log('\n✨ Seeding complete!');
  console.log('───────────────────────────────────');
  console.log(`  Staff:            ${staff.length}`);
  console.log(`  Users:            ${users.length}`);
  console.log(`  Events:           ${events.length}`);
  console.log(`  Event Tasks:      ${taskCount}`);
  console.log(`  Event Expenses:   ${expCount}`);
  console.log(`  Sponsors:         ${sponsors.length}`);
  console.log(`  Sponsor Contacts: ${contactCount}`);
  console.log(`  Sponsorships:     ${sponsorships.length}`);
  console.log(`  Communications:   ${commCount}`);
  console.log(`  Partnerships:     ${partnerships.length}`);
  console.log(`  Partner Contacts: ${pcCount}`);
  console.log(`  Funding Opps:     ${fundingOpps.length}`);
  console.log(`  Proposals:        ${proposals.length}`);
  console.log(`  Legal Documents:  ${legalDocs.length}`);
  console.log(`  Media Assets:     ${mediaAssets.length}`);
  console.log(`  Transactions:     ${txs.length}`);
  console.log(`  Notifications:    ${notifs.length}`);
  console.log(`  Audit Logs:       ${auditLogs.length}`);
  console.log(`  Courses:          ${courses.length}`);
  console.log(`  Lessons:          ${lessonCount}`);
  console.log('───────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
