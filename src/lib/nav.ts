import { PageTab } from '../types';

export interface NavItem {
  tab: PageTab;
  en: string;
  bn: string;
  /** Shorter label for the mobile bar, where horizontal room is tight. */
  shortEn: string;
  shortBn: string;
}

/**
 * One source of truth for navigation. The header, the mobile bar and the
 * footer all read from here so a page can never appear in one and not another.
 */
export const NAV_ITEMS: NavItem[] = [
  { tab: 'home', en: 'Home', bn: 'হোম', shortEn: 'Home', shortBn: 'হোম' },
  { tab: 'matcher', en: 'Profile Matcher', bn: 'প্রোফাইল ম্যাচার', shortEn: 'Matcher', shortBn: 'ম্যাচার' },
  { tab: 'auditor', en: 'Document Auditor', bn: 'ডকুমেন্ট অডিটর', shortEn: 'Auditor', shortBn: 'অডিটর' },
  { tab: 'updates', en: 'Updates', bn: 'আপডেট', shortEn: 'Updates', shortBn: 'আপডেট' },
  { tab: 'resources', en: 'Resources', bn: 'রিসোর্স', shortEn: 'Resources', shortBn: 'রিসোর্স' },
  { tab: 'about', en: 'About', bn: 'আমাদের সম্পর্কে', shortEn: 'About', shortBn: 'সম্পর্কে' },
];
