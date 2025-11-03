import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";

const inter = Inter({ subsets: ["latin"] });

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } =await params;

  // Validate locale
  if (!locales.includes(locale)) notFound();

  // Load translation messages dynamically
  let messages;
  try {
    // messages = (await import(`@/messages/${locale}.json`)).default;
    const navbar = (await import(`@/messages/${locale}/navbar.json`)).default;
    const home = (await import(`@/messages/${locale}/home.json`)).default;
    const about = (await import(`@/messages/${locale}/about.json`)).default;
    const contact = (await import(`@/messages/${locale}/contact.json`)).default;
    const footer = (await import(`@/messages/${locale}/footer.json`)).default;
    const firstpackage = (await import(`@/messages/${locale}/firstpackage.json`)).default;
    const secondpackage = (await import(`@/messages/${locale}/secondpackage.json`)).default;

    messages = { navbar, home, about, contact, footer, firstpackage, secondpackage };
  } catch (error) {
    console.error("Failed to load locale messages:", error);
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <html lang={locale}>
        <body className={inter.className}>
          <ToastContainer position="top-right" />
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </NextIntlClientProvider>
  );
}

// Generate static paths for all locales
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
