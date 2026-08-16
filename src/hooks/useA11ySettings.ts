import { useEffect, useState } from 'react';
import { Language } from '../types';

const STORAGE_KEY = 'veripath_display_settings';

interface StoredSettings {
  largeText: boolean;
  highContrast: boolean;
  lang: Language;
}

const DEFAULTS: StoredSettings = { largeText: false, highContrast: false, lang: 'en' };

function read(): StoredSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return {
      largeText: Boolean(parsed.largeText),
      highContrast: Boolean(parsed.highContrast),
      // Anything that is not the one other language we ship falls back to
      // English, so a corrupted or hand-edited value cannot leave the app in
      // a language that has no dictionary.
      lang: parsed.lang === 'bn' ? 'bn' : 'en',
    };
  } catch {
    return DEFAULTS;
  }
}

/**
 * The reader's three display preferences, in one place because they are one
 * decision: how this person needs the product presented to them.
 *
 * Language belongs here with the other two. It was held as ordinary state in
 * `App`, so a Bengali reader who refreshed the page — or was returned to it by
 * their browser — was handed an English one. That is a worse loss than either
 * of the other two settings, since it is the difference between a page someone
 * can read and one they cannot.
 *
 * All three are written to <html>, where the token overrides and the Bengali
 * type rules in index.css pick them up, and all three survive the visit.
 */
export function useA11ySettings() {
  const [settings, setSettings] = useState<StoredSettings>(read);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.textsize = settings.largeText ? 'large' : 'normal';
    root.dataset.contrast = settings.highContrast ? 'high' : 'normal';
    // Assistive technology needs to know which language it is reading, and the
    // Bengali size, leading and font-stack rules key off this attribute.
    root.lang = settings.lang;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* storage unavailable — preferences still apply for this visit */
    }
  }, [settings]);

  return {
    largeText: settings.largeText,
    highContrast: settings.highContrast,
    lang: settings.lang,
    setLargeText: (value: boolean) => setSettings((s) => ({ ...s, largeText: value })),
    setHighContrast: (value: boolean) => setSettings((s) => ({ ...s, highContrast: value })),
    setLang: (value: Language) => setSettings((s) => ({ ...s, lang: value })),
  };
}
