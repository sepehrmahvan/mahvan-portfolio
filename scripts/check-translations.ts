import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Keep in sync with `types/locale.ts` → `locales`. */
const locales = ['fa', 'en', 'ar', 'ru', 'zh', 'ja', 'de'] as const;
const localesDir = join(process.cwd(), 'locales');
const referenceLocale = 'fa' as const;

function flatten(obj: Record<string, unknown>, prefix = ''): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flatten(value as Record<string, unknown>, path);
    }
    return [path];
  });
}

function loadKeys(lang: string, file: string): string[] {
  const raw = readFileSync(join(localesDir, lang, file), 'utf8');
  return flatten(JSON.parse(raw) as Record<string, unknown>).sort();
}

const referenceFiles = readdirSync(join(localesDir, referenceLocale)).filter((f) =>
  f.endsWith('.json'),
);

let hasError = false;

for (const lang of locales) {
  if (lang === referenceLocale) continue;

  const langFiles = readdirSync(join(localesDir, lang)).filter((f) => f.endsWith('.json'));
  const missingFiles = referenceFiles.filter((file) => !langFiles.includes(file));
  const extraFiles = langFiles.filter((file) => !referenceFiles.includes(file));

  if (missingFiles.length || extraFiles.length) {
    hasError = true;
    console.error(`Namespace file mismatch between ${referenceLocale} and ${lang}`);
    if (missingFiles.length) console.error(`  missing in ${lang}:`, missingFiles);
    if (extraFiles.length) console.error(`  extra in ${lang}:`, extraFiles);
  }

  for (const file of referenceFiles) {
    if (!langFiles.includes(file)) continue;
    const referenceKeys = loadKeys(referenceLocale, file);
    const langKeys = loadKeys(lang, file);
    const missingInLang = referenceKeys.filter((key) => !langKeys.includes(key));
    const missingInReference = langKeys.filter((key) => !referenceKeys.includes(key));

    if (missingInLang.length || missingInReference.length) {
      hasError = true;
      console.error(`Key mismatch in ${file} (${referenceLocale} vs ${lang})`);
      if (missingInLang.length) console.error(`  missing in ${lang}:`, missingInLang);
      if (missingInReference.length) {
        console.error(`  missing in ${referenceLocale}:`, missingInReference);
      }
    }
  }
}

if (!hasError) {
  console.log(`Translation check passed for: ${locales.join(', ')}`);
  process.exit(0);
}

process.exit(1);
