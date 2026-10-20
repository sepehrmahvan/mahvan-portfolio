import { RootRedirect } from '@/components/shared/root-redirect';
import { defaultLocale } from '@/types/locale';

/** Locale routes live under `/[lang]`. Send `/` to the default language. */
export default function RootPage() {
  return <RootRedirect locale={defaultLocale} />;
}
