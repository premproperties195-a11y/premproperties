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
    title: seo.defaultTitle || "PREM Properties | Premium Real Estate in Kongara Kalan, Hyderabad",
    description: seo.defaultDescription || "Invest in Kongara Kalan, Hyderabad's fastest-growing real estate hub. Near ORR Exit 13, Foxconn, and Hardware Park.",
    keywords: seo.keywords || "Real Estate Hyderabad, Kongara Kalan Plots",
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
