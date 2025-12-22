import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";
import FloatingWhatsApp from "./components/FloatingWhatsApp";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

import { fetchCompanyData } from "./lib/data";

export async function generateMetadata() {
  const companyData = await fetchCompanyData();
  const seo = companyData?.seo || {};

  return {
    title: seo.defaultTitle || "PREM Properties | Premium Living",
    description: seo.defaultDescription || "Experience the pinnacle of modern living.",
    keywords: seo.keywords || "real estate, luxury",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const companyData = await fetchCompanyData();
  const appearance = companyData?.appearance || {
    primaryColor: "#FFA600",
    secondaryColor: "#1A1A1A",
    fontSans: "Inter",
    fontSerif: "Playfair Display",
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
          :root {
            --primary: ${appearance.primaryColor};
            --primary-dark: ${appearance.primaryColor}dd;
            --secondary-bg: ${appearance.secondaryColor};
            --font-sans: ${appearance.fontSans}, system-ui, sans-serif;
            --font-serif: ${appearance.fontSerif}, serif;
          }
        `}} />
      </head>
      <body className="font-sans antialiased text-[var(--foreground)] bg-[var(--background)]">
        {children}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
