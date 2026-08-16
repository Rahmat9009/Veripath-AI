import { Language } from '../types';

/**
 * Form option lists. The `value` strings are sent to /api/match-pathway and
 * must stay byte-identical to what the server has always received — only the
 * visible label is translated.
 */
export interface Option {
  value: string;
  en: string;
  bn: string;
}

export const DESTINATIONS: Option[] = [
  { value: 'Italy (Flussi Seasonal & Work)', en: 'Italy — Flussi seasonal & work', bn: 'ইতালি — ফ্লুসি মৌসুমি ও কাজ' },
  { value: 'Qatar (Construction & Hospitality)', en: 'Qatar — construction & hospitality', bn: 'কাতার — নির্মাণ ও আতিথেয়তা' },
  { value: 'Saudi Arabia (General & Skilled Work)', en: 'Saudi Arabia — general & skilled work', bn: 'সৌদি আরব — সাধারণ ও দক্ষ কাজ' },
  { value: 'United Arab Emirates (Employment & Service)', en: 'United Arab Emirates — employment & service', bn: 'সংযুক্ত আরব আমিরাত — চাকরি ও সেবা' },
  { value: 'Malaysia (Manufacturing & Services)', en: 'Malaysia — manufacturing & services', bn: 'মালয়েশিয়া — উৎপাদন ও সেবা' },
  { value: 'Singapore (Construction & Marine)', en: 'Singapore — construction & marine', bn: 'সিঙ্গাপুর — নির্মাণ ও নৌ' },
  { value: 'South Korea (EPS Skilled Work)', en: 'South Korea — EPS skilled work', bn: 'দক্ষিণ কোরিয়া — ইপিএস দক্ষ কাজ' },
  { value: 'Japan (TITP & SSW Worker)', en: 'Japan — TITP & SSW worker', bn: 'জাপান — টিআইটিপি ও এসএসডব্লিউ' },
  { value: 'United Kingdom (Skilled Worker)', en: 'United Kingdom — skilled worker', bn: 'যুক্তরাজ্য — স্কিলড ওয়ার্কার' },
  { value: 'Canada (Express Entry / PNP)', en: 'Canada — Express Entry / PNP', bn: 'কানাডা — এক্সপ্রেস এন্ট্রি / পিএনপি' },
  { value: 'Germany (Opportunity Card / Skilled)', en: 'Germany — Opportunity Card / skilled', bn: 'জার্মানি — অপরচুনিটি কার্ড / দক্ষ' },
  { value: 'Romania / EU Work Permit', en: 'Romania / EU work permit', bn: 'রোমানিয়া / ইইউ ওয়ার্ক পারমিট' },
];

export const PURPOSES: Option[] = [
  { value: 'Skilled Work / Direct Employment', en: 'Skilled work / direct employment', bn: 'দক্ষ কাজ / সরাসরি চাকরি' },
  { value: 'Seasonal / Temporary Work', en: 'Seasonal / temporary work', bn: 'মৌসুমি / অস্থায়ী কাজ' },
  { value: 'Unskilled Labor / General Work', en: 'General labour', bn: 'সাধারণ শ্রমিকের কাজ' },
  { value: 'Higher Studies / University', en: 'Higher studies / university', bn: 'উচ্চশিক্ষা / বিশ্ববিদ্যালয়' },
  { value: 'Domestic Helper / Caregiver', en: 'Domestic helper / caregiver', bn: 'গৃহকর্মী / কেয়ারগিভার' },
  { value: 'Professional / Business Visa', en: 'Professional / business visa', bn: 'পেশাজীবী / ব্যবসায়িক ভিসা' },
];

export const EDUCATION_LEVELS: Option[] = [
  { value: 'Diploma / Trade Certificate', en: 'Diploma / trade certificate', bn: 'ডিপ্লোমা / ট্রেড সার্টিফিকেট' },
  { value: 'Primary / Below SSC', en: 'Primary / below SSC', bn: 'প্রাথমিক / এসএসসির নিচে' },
  { value: 'Secondary School Certificate (SSC)', en: 'Secondary School Certificate (SSC)', bn: 'মাধ্যমিক (এসএসসি)' },
  { value: 'Higher Secondary Certificate (HSC)', en: 'Higher Secondary Certificate (HSC)', bn: 'উচ্চ মাধ্যমিক (এইচএসসি)' },
  { value: 'Bachelor Degree / Honors', en: 'Bachelor degree / honours', bn: 'স্নাতক / সম্মান' },
  { value: 'Master Degree or Above', en: 'Master degree or above', bn: 'স্নাতকোত্তর বা তার বেশি' },
];

export const EXPERIENCE_LEVELS: Option[] = [
  { value: 'Less than 1 Year', en: 'Less than 1 year', bn: '১ বছরের কম' },
  { value: '1 to 2 Years', en: '1 to 2 years', bn: '১ থেকে ২ বছর' },
  { value: '3 to 5 Years', en: '3 to 5 years', bn: '৩ থেকে ৫ বছর' },
  { value: '5 to 10 Years', en: '5 to 10 years', bn: '৫ থেকে ১০ বছর' },
  { value: '10+ Years', en: 'More than 10 years', bn: '১০ বছরের বেশি' },
];

export const FUND_SOURCES: Option[] = [
  { value: 'Family Financial Support', en: 'Family support', bn: 'পরিবারের সহায়তা' },
  { value: 'Personal Savings', en: 'Personal savings', bn: 'নিজের সঞ্চয়' },
  { value: 'Bank Loan / Educational Loan', en: 'Bank or education loan', bn: 'ব্যাংক বা শিক্ষা ঋণ' },
  { value: 'Property / Asset Sale', en: 'Sale of property or assets', bn: 'জমি বা সম্পদ বিক্রি' },
  { value: 'Employer / Sponsor Funded', en: 'Paid by employer or sponsor', bn: 'নিয়োগকর্তা বা স্পন্সর বহন করবে' },
];

export const RECORD_OPTIONS: Option[] = [
  { value: 'No Record / Clean Police Record', en: 'No record / clean police clearance', bn: 'কোনো রেকর্ড নেই / পরিষ্কার পুলিশ ক্লিয়ারেন্স' },
  { value: 'Pending Minor Case', en: 'Minor case pending', bn: 'ছোট মামলা চলমান' },
  { value: 'Pardon / Cleared Record', en: 'Pardoned / cleared record', bn: 'মাফ / নিষ্পত্তি হওয়া রেকর্ড' },
];

export function optionLabel(option: Option, lang: Language): string {
  return lang === 'bn' ? option.bn : option.en;
}
