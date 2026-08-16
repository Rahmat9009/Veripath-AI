import { VerifiedArticle, ResourceItem, NewsArticle } from '../types';

export const INITIAL_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-hero-1',
    title: 'Italy Opens Decreto Flussi 2026 Quotas for 151,000 Seasonal & Skilled Foreign Workers',
    category: 'Visa & Immigration',
    country: 'Italy',
    region: 'UK & Europe',
    publishDate: '12 August 2026',
    timeAgo: '15 mins ago',
    readTime: '4 min read',
    summary: 'The Italian Ministry of Interior published the official Gazzetta Ufficiale allocation for Decreto Flussi. Quotas cover agriculture, construction, transport, and healthcare with zero recruiter fee mandates.',
    fullContent: 'The Italian Ministry of Interior (Ministero dell\'Interno) has officially issued the 2026 Decreto Flussi decree allocating over 151,000 work permits for non-EU workers. The application window allows Italian employers to directly request Null Osta (work authorization) for seasonal agricultural workers, commercial drivers, construction technicians, and healthcare staff. Crucially, the decree reaffirms that applicants pay zero recruitment or agent fees; all application processing is conducted through the official Sportello Unico per l\'Immigrazione portal.',
    sourceName: 'Italian Ministry of Interior (Gazzetta Ufficiale)',
    sourceDomain: 'interno.gov.it',
    sourceType: 'Official Gazette',
    officialLink: 'https://www.interno.gov.it',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 342,
    trendingTag: '#DecretoFlussi2026'
  },
  {
    id: 'news-2',
    title: 'UK Home Office Updates Skilled Worker Minimum Salary Thresholds & Healthcare Visas',
    category: 'Jobs & Career',
    country: 'United Kingdom',
    region: 'UK & Europe',
    publishDate: '12 August 2026',
    timeAgo: '1 hour ago',
    readTime: '3 min read',
    summary: 'Revised UK Visas & Immigration guidelines update minimum going-rates for engineering, IT, and healthcare roles. Employers must meet new salary floors for CoS issuance.',
    fullContent: 'The UK Home Office has issued updated operational guidance for Tier 2 Skilled Worker and Health & Care Visa sponsors. The new thresholds set specific annual salary minimums across occupations while protecting existing visa holders during extensions. International job seekers are reminded that legitimate employers issue Certificates of Sponsorship (CoS) directly without charging candidates slot fees.',
    sourceName: 'UK Visas & Immigration (GOV.UK)',
    sourceDomain: 'gov.uk',
    sourceType: 'Government Portal',
    officialLink: 'https://www.gov.uk/skilled-worker-visa',
    imageUrl: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 289,
    trendingTag: '#UKSkilledWorker'
  },
  {
    id: 'news-3',
    title: 'Global University Admission 2026: UK & Canada Offer £15M International STEM Scholarships',
    category: 'Study & Admissions',
    country: 'UK / Canada',
    region: 'Global',
    publishDate: '11 August 2026',
    timeAgo: '3 hours ago',
    readTime: '5 min read',
    summary: 'Major universities across the UK, Canada, and Australia announce Vice-Chancellor excellence scholarships and simplified CAS/I-20 financial proof guidelines for 2026-2027 intake.',
    fullContent: 'International students applying for STEM and AI postgraduate programs can now access over £15 million in merit-based fee waivers. The British Council and Canadian High Commissions have published updated financial proof guidelines, specifying that 28-day bank statement balance checks must reflect clear, un-borrowed liquid funds held in official commercial banks.',
    sourceName: 'British Council & UKVI Admissions Bureau',
    sourceDomain: 'britishcouncil.org',
    sourceType: 'Verified News Outlet',
    officialLink: 'https://study-uk.britishcouncil.org',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 512,
    trendingTag: '#GlobalStudy2026'
  },
  {
    id: 'news-3b',
    title: 'Germany DAAD Expands Tuition-Free Master Programs & Post-Study Work Visa Window',
    category: 'Study & Admissions',
    country: 'Germany',
    region: 'UK & Europe',
    publishDate: '11 August 2026',
    timeAgo: '4 hours ago',
    readTime: '4 min read',
    summary: 'German Federal Ministry of Education expands DAAD international scholarships and extends post-study job seeker visa validity to 24 months for public university graduates.',
    fullContent: 'The German Academic Exchange Service (DAAD) and Federal Ministry of Education announced new funding allocations for international Master students in engineering, data science, and renewable energy. Public universities in Germany continue offering tuition-free education with simplified blocked bank account proof through official Deutsche Bank and Expatrio portals.',
    sourceName: 'DAAD Germany & Federal Ministry of Education',
    sourceDomain: 'daad.de',
    sourceType: 'Government Portal',
    officialLink: 'https://www.daad.de',
    imageUrl: 'https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 418,
    trendingTag: '#StudyInGermany'
  },
  {
    id: 'news-4',
    title: 'Qatar & Saudi Arabia Launch Instant Commercial Registration (CR) Digital Portals for Expats',
    category: 'Business & Trade',
    country: 'Qatar / KSA',
    region: 'Middle East',
    publishDate: '11 August 2026',
    timeAgo: '5 hours ago',
    readTime: '3 min read',
    summary: 'Qatar MOCI and Saudi Ministry of Commerce introduce 24-hour online company registration for foreign entrepreneurs with 100% foreign ownership options in tech & technical services.',
    fullContent: 'In a significant economic update, the Qatar Ministry of Commerce and Industry (MOCI) and Saudi Ministry of Commerce have streamlined business startup procedures for international investors. Under new foreign investment statutes, qualifying entrepreneurs can secure a Commercial Registration (CR) and tax identification number completely online without local sponsor requirement for designated technical sectors.',
    sourceName: 'Qatar Ministry of Commerce & Industry (MOCI)',
    sourceDomain: 'moci.gov.qa',
    sourceType: 'Government Portal',
    officialLink: 'https://www.moci.gov.qa',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 198,
    trendingTag: '#GulfBusinessSetup'
  },
  {
    id: 'news-4b',
    title: 'UAE Dubai Chamber Unveils Instant Green Visa Startup Pass for Tech & E-Commerce Expats',
    category: 'Business & Trade',
    country: 'UAE',
    region: 'Middle East',
    publishDate: '10 August 2026',
    timeAgo: '12 hours ago',
    readTime: '3 min read',
    summary: 'Dubai Economy and Tourism (DET) launches a 5-year self-residency startup license for expatriate entrepreneurs, freelancers, and small trade businesses.',
    fullContent: 'The Dubai Department of Economy and Tourism announced an expanded Green Visa framework enabling international business founders to establish legal trade licenses without requiring UAE national partners. The pass includes multi-year family sponsorship, instant corporate bank account opening, and zero personal income tax guarantees.',
    sourceName: 'Dubai Economy & Tourism (DET Portal)',
    sourceDomain: 'dubai.ae',
    sourceType: 'Government Portal',
    officialLink: 'https://www.dubai.ae',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 310,
    trendingTag: '#DubaiGreenVisa'
  },
  {
    id: 'news-5',
    title: 'New Gazette Policy: Mandatory Digital Wage Protection (WPS) & Zero Recruiter Fee Enforcement',
    category: 'Government & Laws',
    country: 'Gulf Cooperation Council',
    region: 'Middle East',
    publishDate: '10 August 2026',
    timeAgo: '1 day ago',
    readTime: '4 min read',
    summary: 'Official gazette publications enforce strict criminal penalties for recruitment agencies charging job seekers processing deposits or withholding worker passports.',
    fullContent: 'Labor ministries across GCC member states have gazetted joint enforcement resolutions mandating digital payroll verification (WPS) and prohibiting agencies from charging job applicants processing fees. Employers failing to pay workers through direct bank transfers face immediate freeze of recruitment quotas.',
    sourceName: 'GCC Labor Ministries Joint Gazette',
    sourceDomain: 'probashi.gov.bd',
    sourceType: 'Official Gazette',
    officialLink: 'https://www.probashi.gov.bd',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 421,
    trendingTag: '#WageProtectionLaw'
  },
  {
    id: 'news-5b',
    title: 'Japan Immigration Services Agency Expands Specified Skilled Worker (SSW-2) Legal Pathway',
    category: 'Government & Laws',
    country: 'Japan',
    region: 'Asia Pacific',
    publishDate: '10 August 2026',
    timeAgo: '1 day ago',
    readTime: '4 min read',
    summary: 'Japan Ministry of Justice publishes gazette revisions allowing Tokutei Ginou SSW-2 visa holders in 11 industrial sectors to renew indefinitely and sponsor family members.',
    fullContent: 'The Ministry of Justice in Tokyo officially gazetted the expansion of the Specified Skilled Worker (SSW-2) visa category. Foreign workers who pass Japanese technical skill evaluations in construction, manufacturing, agriculture, and hospitality can now obtain long-term residency rights with unlimited visa renewals and full family reunification rights.',
    sourceName: 'Japan Ministry of Justice (MOJ Gazette)',
    sourceDomain: 'moj.go.jp',
    sourceType: 'Official Gazette',
    officialLink: 'https://www.moj.go.jp/isa',
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 367,
    trendingTag: '#JapanSSWVisa'
  },
  {
    id: 'news-6',
    title: 'Future Skill Roadmap 2030: Top High-Demand International Vocations in Green Energy & AI',
    category: 'Future & Planning',
    country: 'Global',
    region: 'Global',
    publishDate: '10 August 2026',
    timeAgo: '1 day ago',
    readTime: '6 min read',
    summary: 'International Labor Organization (ILO) report highlights rapid growth in solar installation, HVAC automation, cybersecurity, and nursing skill visas for the next decade.',
    fullContent: 'The International Labor Organization (ILO) released its 2030 Global Migration & Vocation Analysis identifying certified HVAC technicians, industrial solar installers, healthcare specialists, and software developers as the highest-growth categories for fast-track immigration pathways. The report outlines specific internationally accredited trade certifications that boost visa approval odds by over 60%.',
    sourceName: 'International Labor Organization (ILO)',
    sourceDomain: 'ilo.org',
    sourceType: 'International Newsletter',
    officialLink: 'https://www.ilo.org',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 630,
    trendingTag: '#FutureSkills2030'
  },
  {
    id: 'news-6b',
    title: 'World Bank Global Mobility Index: How Certified Skill Profiles Increase Visa Success 3x',
    category: 'Future & Planning',
    country: 'Global',
    region: 'Global',
    publishDate: '09 August 2026',
    timeAgo: '2 days ago',
    readTime: '5 min read',
    summary: 'World Bank research demonstrates that foreign job applicants holding verified digital credentials and accredited trade certificates experience 75% faster visa processing.',
    fullContent: 'A comprehensive study published by the World Bank Group highlights the transformation of international labor mobility through verified digital identity and skill credentials. Candidates utilizing government-backed credential verification portals reduce employer onboarding delays from months to days, shielding themselves from predatory middleman scams.',
    sourceName: 'World Bank Group Migration & Development Desk',
    sourceDomain: 'worldbank.org',
    sourceType: 'International Newsletter',
    officialLink: 'https://www.worldbank.org',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 295,
    trendingTag: '#WorldBankMobility'
  },
  {
    id: 'news-7',
    title: 'Canada Express Entry & LMIA Work Permit Category Draw Results Released',
    category: 'Visa & Immigration',
    country: 'Canada',
    region: 'North America',
    publishDate: '09 August 2026',
    timeAgo: '2 days ago',
    readTime: '3 min read',
    summary: 'IRCC conducts targeted Express Entry category selection for trade professionals, healthcare workers, and French-language candidates.',
    fullContent: 'Immigration, Refugees and Citizenship Canada (IRCC) held its latest targeted Express Entry draw inviting 4,200 applicants in trades, agriculture, and healthcare roles. IRCC reiterated that LMIA job offers must be verified directly on the Job Bank Canada database to avoid fake employment fraud.',
    sourceName: 'IRCC Canada Immigration Portal',
    sourceDomain: 'canada.ca',
    sourceType: 'Government Portal',
    officialLink: 'https://www.canada.ca/en/immigration-refugees-citizenship.html',
    imageUrl: 'https://images.unsplash.com/photo-1517935703635-27c706246aea?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 388,
    trendingTag: '#CanadaExpressEntry'
  },
  {
    id: 'news-8',
    title: 'Saudi Qiwa System Mandates QR Code Verified Digital Work Contracts for Expats',
    category: 'Jobs & Career',
    country: 'Saudi Arabia',
    region: 'Middle East',
    publishDate: '08 August 2026',
    timeAgo: '3 days ago',
    readTime: '3 min read',
    summary: 'Ministry of Human Resources enforces instant QR code verification for all Iqama work agreements prior to visa stamping at Saudi embassies.',
    fullContent: 'The Saudi Ministry of Human Resources and Social Development requires all foreign workers entering the Kingdom to possess an active Qiwa digital contract authenticated with a scannable QR code. Paper contracts without Qiwa electronic validation will not be accepted by embassy visa issuing centers.',
    sourceName: 'Saudi Qiwa Digital Employment Portal',
    sourceDomain: 'qiwa.sa',
    sourceType: 'Government Portal',
    officialLink: 'https://qiwa.sa',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    isVerified: true,
    likesCount: 275,
    trendingTag: '#SaudiQiwaContract'
  }
];

export const INITIAL_VERIFIED_ARTICLES: VerifiedArticle[] = [
  {
    id: 'art-1',
    title: 'Official Government Fee Cap Set for Overseas Worker Recruitment',
    category: 'Fee Regulation',
    publishDate: 'August 2026',
    summary: 'New directives specify strict caps on agency charges. Recruitment agencies demanding fees beyond legal thresholds face immediate license cancellation.',
    fullContent: 'The Ministry of Expatriates Welfare & Overseas Employment has issued a strict binding fee directive prohibiting agencies from charging workers excessive recruitment costs. Official visa sponsorship costs must be borne by the employer under international standards.',
    sourceMinistry: "Ministry of Expatriates' Welfare & BMET",
    officialLink: 'https://www.bmet.gov.bd',
    isAiVerified: true
  },
  {
    id: 'art-2',
    title: 'Warning: Fraudulent WhatsApp Offer Letters for Gulf Construction Jobs',
    category: 'Scam Warning',
    publishDate: 'August 2026',
    summary: 'AI monitoring flagged fake employment contracts distributed via messaging apps requesting upfront medical screening money via personal mobile wallets.',
    fullContent: 'Job seekers are warned against unsolicited job offers received via WhatsApp or social media claiming guaranteed visa issuance upon sending money via mobile banking. Official contracts are only valid when verified through Ministry or Embassy portals.',
    sourceMinistry: 'Overseas Employment Protection Cell',
    officialLink: 'https://www.probashi.gov.bd',
    isAiVerified: true
  },
  {
    id: 'art-3',
    title: 'Qatar Labour Law Revision on Work Contract Digital Attestation',
    category: 'Policy Update',
    publishDate: 'July 2026',
    summary: 'All foreign employment contracts must now be digitally verified on the official Ministry portal before departure to ensure wage protection.',
    fullContent: 'The Qatar Ministry of Labour mandates that every worker must receive an officially registered electronic contract prior to travel. Workers can verify contract authenticity using their passport number.',
    sourceMinistry: 'Qatar Ministry of Labour',
    officialLink: 'https://www.mol.gov.qa',
    isAiVerified: true
  },
  {
    id: 'art-4',
    title: 'Italy Decree Flussi 2026: Official Work Permit Application Quotas Opened',
    category: 'Policy Update',
    publishDate: 'August 2026',
    summary: 'The Italian Ministry of Interior published official quotas for seasonal and non-seasonal foreign workers. Employers must initiate Null Osta directly.',
    fullContent: 'The Italian Ministry of Interior announced the allocation of official work permit quotas under Decreto Flussi. Workers are reminded that Null Osta applications are free of recruiter fees and submitted by the Italian employer directly through the official Sportello Unico per l\'Immigrazione portal.',
    sourceMinistry: 'Italian Ministry of Interior (Ministero dell\'Interno)',
    officialLink: 'https://www.interno.gov.it',
    isAiVerified: true
  },
  {
    id: 'art-5',
    title: 'Saudi Arabia Qiwa Platform Mandates Digital Contract Authentication',
    category: 'Fee Regulation',
    publishDate: 'July 2026',
    summary: 'Saudi Ministry of Human Resources warns against fake job offers not registered on the official Qiwa platform.',
    fullContent: 'All work contracts for foreign workers in the Kingdom of Saudi Arabia must be uploaded and authenticated on the official Qiwa platform. Any agreement made outside the Qiwa digital system is legally non-binding, and charging candidate recruitment fees remains illegal under Saudi Labor Law.',
    sourceMinistry: 'Saudi Ministry of Human Resources & Social Development',
    officialLink: 'https://qiwa.sa',
    isAiVerified: true
  },
  {
    id: 'art-6',
    title: 'UK Home Office Crackdown on Unlicensed Visa Sponsorship Brokers',
    category: 'Scam Warning',
    publishDate: 'August 2026',
    summary: 'Home Office revokes licenses of bogus employers selling Certificates of Sponsorship (CoS) to international job applicants.',
    fullContent: 'The UK Home Office has intensified enforcement against middleman agents attempting to sell Certificates of Sponsorship (CoS) for skilled worker visas. Selling sponsorship slots is illegal, and victims of sponsorship fraud are advised to report suspicious agents immediately.',
    sourceMinistry: 'UK Home Office Visa & Immigration Service',
    officialLink: 'https://www.gov.uk/government/organisations/uk-visas-and-immigration',
    isAiVerified: true
  }
];

export const OFFICIAL_RESOURCES: ResourceItem[] = [
  // 1. Italy
  {
    id: 'res-italy-1',
    title: 'Ministero dell\'Interno (Ministry of Interior)',
    country: 'Italy',
    countryFlag: '🇮🇹',
    description: 'Official portal for Decreto Flussi quotas, Null Osta work permit submission, and Sportello Unico status.',
    officialUrl: 'https://www.interno.gov.it',
    domain: 'interno.gov.it',
    category: 'Visa & Status'
  },
  {
    id: 'res-italy-2',
    title: 'Visto per l\'Italia (Italian Foreign Visa Portal)',
    country: 'Italy',
    countryFlag: '🇮🇹',
    description: 'Official Ministry of Foreign Affairs system to check visa requirements, fees, and appointment booking.',
    officialUrl: 'https://vistoperitalia.esteri.it',
    domain: 'esteri.it',
    category: 'Visa & Status'
  },
  {
    id: 'res-italy-3',
    title: 'Ministero del Lavoro (Ministry of Labour)',
    country: 'Italy',
    countryFlag: '🇮🇹',
    description: 'Official labor regulation, collective bargaining agreements, and foreign worker protection policies.',
    officialUrl: 'https://www.lavoro.gov.it',
    domain: 'lavoro.gov.it',
    category: 'Labour & Contracts'
  },

  // 2. Qatar
  {
    id: 'res-qatar-1',
    title: 'Qatar Ministry of Labour (MOL)',
    country: 'Qatar',
    countryFlag: '🇶🇦',
    description: 'Verify electronic employment contracts, lodge labour complaints, and check Wage Protection System status.',
    officialUrl: 'https://www.mol.gov.qa',
    domain: 'mol.gov.qa',
    category: 'Labour & Contracts'
  },
  {
    id: 'res-qatar-2',
    title: 'Qatar MOI Visa Portal & Status Checker',
    country: 'Qatar',
    countryFlag: '🇶🇦',
    description: 'Ministry of Interior online portal to verify entry visas, residency approvals, and QID status.',
    officialUrl: 'https://portal.moi.gov.qa',
    domain: 'moi.gov.qa',
    category: 'Visa & Status'
  },
  {
    id: 'res-qatar-3',
    title: 'Qatar Visa Center (QVC)',
    country: 'Qatar',
    countryFlag: '🇶🇦',
    description: 'Official pre-departure biometric enrollment, medical test appointments, and contract signing centers.',
    officialUrl: 'https://www.qatarvisacenter.com',
    domain: 'qatarvisacenter.com',
    category: 'Visa & Status'
  },

  // 3. Saudi Arabia
  {
    id: 'res-saudi-1',
    title: 'Qiwa Employment Platform',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    description: 'Official digital contract authentication platform mandated by Saudi Ministry of Human Resources.',
    officialUrl: 'https://qiwa.sa',
    domain: 'qiwa.sa',
    category: 'Labour & Contracts'
  },
  {
    id: 'res-saudi-2',
    title: 'Muqeem Portal (Residency & Visa Checker)',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    description: 'Verify Iqama validity, exit-reentry visas, and employer registration status in the Kingdom.',
    officialUrl: 'https://muqeem.sa',
    domain: 'muqeem.sa',
    category: 'Visa & Status'
  },
  {
    id: 'res-saudi-3',
    title: 'KSAVisa Portal (Ministry of Foreign Affairs)',
    country: 'Saudi Arabia',
    countryFlag: '🇸🇦',
    description: 'Unified official national platform for Saudi visa applications, MOFA attestations, and status tracking.',
    officialUrl: 'https://ksavisa.sa',
    domain: 'ksavisa.sa',
    category: 'Visa & Status'
  },

  // 4. United Arab Emirates
  {
    id: 'res-uae-1',
    title: 'ICP Smart Services (UAE Federal Authority)',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    description: 'Federal Authority for Identity, Citizenship, Customs & Port Security visa validity and fine checker.',
    officialUrl: 'https://smartservices.icp.gov.ae',
    domain: 'icp.gov.ae',
    category: 'Visa & Status'
  },
  {
    id: 'res-uae-2',
    title: 'MOHRE UAE (Ministry of Human Resources)',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    description: 'Official work offer contract verification, labor permit status, and MOHRE complaint system.',
    officialUrl: 'https://www.mohre.gov.ae',
    domain: 'mohre.gov.ae',
    category: 'Labour & Contracts'
  },
  {
    id: 'res-uae-3',
    title: 'GDRFA Dubai (General Directorate of Residency)',
    country: 'United Arab Emirates',
    countryFlag: '🇦🇪',
    description: 'Official Dubai residency entry permit, golden visa eligibility check, and application tracking portal.',
    officialUrl: 'https://gdrfad.gov.ae',
    domain: 'gdrfad.gov.ae',
    category: 'Visa & Status'
  },

  // 5. Malaysia
  {
    id: 'res-malaysia-1',
    title: 'MYVISA Portal (Malaysia Immigration)',
    country: 'Malaysia',
    countryFlag: '🇲🇾',
    description: 'Official eVISA portal for international visitors, workers, and eVisa status verification.',
    officialUrl: 'https://malaysiavisa.imi.gov.my',
    domain: 'imi.gov.my',
    category: 'Visa & Status'
  },
  {
    id: 'res-malaysia-2',
    title: 'Jabatan Imigresen Malaysia (Immigration Dept)',
    country: 'Malaysia',
    countryFlag: '🇲🇾',
    description: 'Official government department for foreign worker quota checks, passes, and immigration guidelines.',
    officialUrl: 'https://www.imi.gov.my',
    domain: 'imi.gov.my',
    category: 'Government & Ministries'
  },
  {
    id: 'res-malaysia-3',
    title: 'EMGS (Education Malaysia Global Services)',
    country: 'Malaysia',
    countryFlag: '🇲🇾',
    description: 'Official government ministry portal for international student visa application tracking and VAL approval.',
    officialUrl: 'https://visa.educationmalaysia.gov.my',
    domain: 'educationmalaysia.gov.my',
    category: 'Study & Education'
  },

  // 6. Japan
  {
    id: 'res-japan-1',
    title: 'Immigration Services Agency of Japan (ISA)',
    country: 'Japan',
    countryFlag: '🇯🇵',
    description: 'Official government agency for Tokutei Ginou (Specified Skilled Worker) visas and residency status.',
    officialUrl: 'https://www.moj.go.jp/isa',
    domain: 'moj.go.jp',
    category: 'Visa & Status'
  },
  {
    id: 'res-japan-2',
    title: 'Ministry of Foreign Affairs of Japan (MOFA)',
    country: 'Japan',
    countryFlag: '🇯🇵',
    description: 'Official visa processing guidelines, embassy locations, and entry requirement details for Japan.',
    officialUrl: 'https://www.mofa.go.jp',
    domain: 'mofa.go.jp',
    category: 'Government & Ministries'
  },
  {
    id: 'res-japan-3',
    title: 'MHLW Japan Employment Portal',
    country: 'Japan',
    countryFlag: '🇯🇵',
    description: 'Ministry of Health, Labour and Welfare rules on foreign worker labor rights and technical intern training.',
    officialUrl: 'https://www.mhlw.go.jp',
    domain: 'mhlw.go.jp',
    category: 'Labour & Contracts'
  },

  // 7. South Korea
  {
    id: 'res-korea-1',
    title: 'HiKorea Official Foreigner Portal',
    country: 'South Korea',
    countryFlag: '🇰🇷',
    description: 'Ministry of Justice portal for electronic visa extensions, residence card appointments, and status checks.',
    officialUrl: 'https://www.hikorea.go.kr',
    domain: 'hikorea.go.kr',
    category: 'Visa & Status'
  },
  {
    id: 'res-korea-2',
    title: 'Korea Visa Portal (MOJ E-Visa System)',
    country: 'South Korea',
    countryFlag: '🇰🇷',
    description: 'Official Republic of Korea system for checking visa application results and issuing E-Visa confirmation documents.',
    officialUrl: 'https://www.visa.go.kr',
    domain: 'visa.go.kr',
    category: 'Visa & Status'
  },
  {
    id: 'res-korea-3',
    title: 'EPS Korea (Employment Permit System - MOEL)',
    country: 'South Korea',
    countryFlag: '🇰🇷',
    description: 'Official government system for government-to-government (G2G) worker recruitment (E-9 visa).',
    officialUrl: 'https://www.eps.go.kr',
    domain: 'eps.go.kr',
    category: 'Labour & Contracts'
  },

  // 8. Germany
  {
    id: 'res-germany-1',
    title: 'Make it in Germany (Federal Government Portal)',
    country: 'Germany',
    countryFlag: '🇩🇪',
    description: 'Official portal for international skilled workers, Opportunity Card (Chancenkarte), and visa guidance.',
    officialUrl: 'https://www.make-it-in-germany.com',
    domain: 'make-it-in-germany.com',
    category: 'Government & Ministries'
  },
  {
    id: 'res-germany-2',
    title: 'Auswärtiges Amt (German Visa Navigator)',
    country: 'Germany',
    countryFlag: '🇩🇪',
    description: 'Federal Foreign Office official national visa application system and embassy appointment booking.',
    officialUrl: 'https://www.auswaertiges-amt.de',
    domain: 'auswaertiges-amt.de',
    category: 'Visa & Status'
  },
  {
    id: 'res-germany-3',
    title: 'DAAD Germany (Academic Exchange Service)',
    country: 'Germany',
    countryFlag: '🇩🇪',
    description: 'Official public university database, international degree programs, and DAAD scholarship applications.',
    officialUrl: 'https://www.daad.de',
    domain: 'daad.de',
    category: 'Study & Education'
  },

  // 9. Romania
  {
    id: 'res-romania-1',
    title: 'IGI Romania (General Inspectorate for Immigration)',
    country: 'Romania',
    countryFlag: '🇷🇴',
    description: 'Ministry of Internal Affairs department for work authorization permits, residence stay, and visa verification.',
    officialUrl: 'https://igi.mai.gov.ro',
    domain: 'mai.gov.ro',
    category: 'Visa & Status'
  },
  {
    id: 'res-romania-2',
    title: 'E-VISA Romania (Official MAE Online Visa Portal)',
    country: 'Romania',
    countryFlag: '🇷🇴',
    description: 'Ministry of Foreign Affairs official portal for applying for short and long-stay Romanian work visas.',
    officialUrl: 'https://evisa.mae.ro',
    domain: 'mae.ro',
    category: 'Visa & Status'
  },
  {
    id: 'res-romania-3',
    title: 'Study in Romania (Official Government Portal)',
    country: 'Romania',
    countryFlag: '🇷🇴',
    description: 'Ministry of Education portal for international student university admissions and degree equivalence.',
    officialUrl: 'https://studyinromania.gov.ro',
    domain: 'studyinromania.gov.ro',
    category: 'Study & Education'
  },

  // 10. United Kingdom
  {
    id: 'res-uk-1',
    title: 'GOV.UK Visas and Immigration (UKVI)',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    description: 'Official UK Government portal for Skilled Worker, Health & Care, Student visas, and eVisa status checking.',
    officialUrl: 'https://www.gov.uk/browse/visas-immigration',
    domain: 'gov.uk',
    category: 'Visa & Status'
  },
  {
    id: 'res-uk-2',
    title: 'UK Sponsor Register (Licensed Employers Check)',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    description: 'Official Home Office database to verify if an employer is legally authorized to issue Certificates of Sponsorship (CoS).',
    officialUrl: 'https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers',
    domain: 'gov.uk',
    category: 'Labour & Contracts'
  },
  {
    id: 'res-uk-3',
    title: 'Study UK (British Council Official Portal)',
    country: 'United Kingdom',
    countryFlag: '🇬🇧',
    description: 'Official UK university finder, GREAT scholarships, student visa requirements, and CAS guidance.',
    officialUrl: 'https://study-uk.britishcouncil.org',
    domain: 'britishcouncil.org',
    category: 'Study & Education'
  },

  // 11. Oman
  {
    id: 'res-oman-1',
    title: 'Royal Oman Police E-VISA Portal',
    country: 'Oman',
    countryFlag: '🇴🇲',
    description: 'Official Royal Oman Police portal for tourist, work, and express visa applications and status tracking.',
    officialUrl: 'https://evisa.rop.gov.om',
    domain: 'rop.gov.om',
    category: 'Visa & Status'
  },
  {
    id: 'res-oman-2',
    title: 'Oman Ministry of Labour (MOL Portal)',
    country: 'Oman',
    countryFlag: '🇴🇲',
    description: 'Official government portal for work permit clearance, employment contract attestation, and wage protection.',
    officialUrl: 'https://www.mol.gov.om',
    domain: 'mol.gov.om',
    category: 'Labour & Contracts'
  },
  {
    id: 'res-oman-3',
    title: 'Invest in Oman (Commercial Portal)',
    country: 'Oman',
    countryFlag: '🇴🇲',
    description: 'Official Ministry of Commerce, Industry and Investment Promotion portal for foreign business registration.',
    officialUrl: 'https://investinoman.om',
    domain: 'investinoman.om',
    category: 'Business & Trade'
  },

  // 12. Kuwait
  {
    id: 'res-kuwait-1',
    title: 'Kuwait Ministry of Interior (MOI Residency Portal)',
    country: 'Kuwait',
    countryFlag: '🇰🇼',
    description: 'Official MOI portal for checking residency visa validity, entry permits, and traffic civil ID data.',
    officialUrl: 'https://www.moi.gov.kw',
    domain: 'moi.gov.kw',
    category: 'Visa & Status'
  },
  {
    id: 'res-kuwait-2',
    title: 'Public Authority of Manpower (PAM Kuwait)',
    country: 'Kuwait',
    countryFlag: '🇰🇼',
    description: 'Official labor regulation agency for work permit issuing, contract verification, and labor dispute resolution.',
    officialUrl: 'https://www.manpower.gov.kw',
    domain: 'manpower.gov.kw',
    category: 'Labour & Contracts'
  },

  // Home Country Clearance (Bangladesh / Global Clearance)
  {
    id: 'res-bd-1',
    title: 'BMET Official Manpower Clearing Portal',
    country: 'Home Country',
    countryFlag: '🇧🇩',
    description: 'Verify recruitment agency RL license numbers, SMART card clearance, and official migration clearance.',
    officialUrl: 'https://www.bmet.gov.bd',
    domain: 'bmet.gov.bd',
    category: 'Home Country & Clearance'
  },
  {
    id: 'res-bd-2',
    title: "Ministry of Expatriates' Welfare & Overseas Employment",
    country: 'Home Country',
    countryFlag: '🇧🇩',
    description: 'Official ministry welfare services, migration policy updates, and fraud protection advisories.',
    officialUrl: 'https://www.probashi.gov.bd',
    domain: 'probashi.gov.bd',
    category: 'Home Country & Clearance'
  }
];

export const DEMO_HERO_OFFER = {
  title: 'Overseas Employment BD',
  timestamp: 'Friday 10:47',
  textItems: [
    { type: 'warning', text: 'URGENT! – Security Guard Positions available now!' },
    { type: 'warning', text: 'Guaranteed visa – no interview required' },
    { type: 'info', text: 'Salary: QAR 4,500 / month' },
    { type: 'danger', text: 'Processing fee: QAR 1,500 (pts tested)' },
    { type: 'danger', text: 'Only 8 positions left – deadline 48 hours' }
  ],
  footerNote: 'Send passport copy to reserve your place.',
  analysisData: {
    flagsFound: 3,
    riskLevel: 'SERIOUS WARNING SIGNS',
    summary: 'The offer demands QAR 1,500 processing fees and claims guaranteed visa without interview. Official Qatar Labour Law forbids charging workers recruitment fees.'
  }
};
