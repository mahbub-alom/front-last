import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './config';

export default getRequestConfig(async ({ requestLocale }) => {
  // Await the locale from the request (e.g. from the [locale] segment)
  let locale = await requestLocale;

  // Ensure a valid locale is used
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  const navbar = (await import(`@/messages/${locale}/navbar.json`)).default;
  const home = (await import(`@/messages/${locale}/home.json`)).default;
  const about = (await import(`@/messages/${locale}/about.json`)).default;
  const contact = (await import(`@/messages/${locale}/contact.json`)).default;
  const footer = (await import(`@/messages/${locale}/footer.json`)).default;
  const firstpackage = (await import(`@/messages/${locale}/firstpackage.json`)).default;
  const secondpackage = (await import(`@/messages/${locale}/secondpackage.json`)).default;

  return {
    locale,
    messages: { navbar, home, about, contact, footer, firstpackage, secondpackage }
  };
});
