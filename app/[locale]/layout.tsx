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
  const { locale } = params;

  // Validate locale
  if (!locales.includes(locale)) notFound();

  // Load translation messages dynamically
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
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
