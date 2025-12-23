import Header from "./components/Header";
import Hero from "./components/Hero";
import HomeAbout from "./components/HomeAbout";
import FeaturedProjects from "./components/FeaturedProjects";
import Footer from "./components/Footer";
import HomeGallery from "./components/HomeGallery";

import { fetchCompanyData, fetchPropertiesData } from "./lib/data";
import { Metadata } from "next";

export async function generateMetadata() {
  const companyData = await fetchCompanyData();
  const seo = companyData?.seo || {};

  return {
    title: seo.defaultTitle || "PREM Properties | Real Estate in Kongara Kalan, Hyderabad",
    description: seo.defaultDescription || "Invest in Kongara Kalan, Hyderabad's fastest-growing industrial hub. Near Foxconn, Hardware Park, Amazon Data Centre, and Ranga Reddy IDOC. Strategic location near ORR Exit 13.",
    keywords: seo.keywords || "Kongara Kalan Real Estate, Foxconn Hyderabad, ORR Exit 13 Plots, Hardware Park, Ranga Reddy IDOC, Real Estate Investment Hyderabad, Gold Refinery Kongara Kalan",
  };
}

async function getData() {
  const [propertiesData, companyData] = await Promise.all([
    fetchPropertiesData(),
    fetchCompanyData()
  ]);

  return { propertiesData, companyData };
}

export default async function Home() {
  const { propertiesData, companyData } = await getData();
  const homeBanner = companyData.banners?.home;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            "name": "PREM Properties",
            "description": "Premium real estate in Kongara Kalan, Hyderabad. Near Foxconn, Hardware Park, and ORR Exit 13.",
            "url": "https://premproperties.com",
            "telephone": "+91 888 557 5557",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Hyderabad",
              "addressRegion": "Telangana",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "17.3734057",
              "longitude": "78.5476483"
            }
          })
        }}
      />
      <Hero banner={homeBanner} />

      {/* ABOUT SECTION */}
      <HomeAbout company={companyData.company} />

      {/* FEATURED PROPERTIES PREVIEW */}
      <FeaturedProjects projects={propertiesData} />

      {/* HOME GALLERY */}
      <HomeGallery />

      <Footer />
    </main>
  );
}
