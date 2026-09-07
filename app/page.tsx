import Header from "./components/Header";
import Hero from "./components/Hero";
import HomeAbout from "./components/HomeAbout";
import FeaturedProjects from "./components/FeaturedProjects";
import HomeReelsPreview from "./components/HomeReelsPreview";
import Footer from "./components/Footer";
import HomeGallery from "./components/HomeGallery";
import GoogleReviews from "./components/GoogleReviews";

import { fetchCompanyData, fetchPropertiesData } from "./lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PREM Properties | Premium Real Estate in Kongara Kalan, Hyderabad",
  description: "Invest in Kongara Kalan, Hyderabad's fastest-growing real estate hub. Near ORR Exit 13, Foxconn, Hardware Park, Future City, and Adibatla. Premium residential plots, villas, and apartments.",
  keywords: ["Real Estate Hyderabad", "Kongara Kalan Plots", "Foxconn Hyderabad Projects", "Investment in Kongara Kalan", "Premium Villas Hyderabad", "Properties near Future City", "Real Estate near Adibatla", "Plots near Meerkanpet"],
};

async function getData() {
  const [propertiesData, companyData] = await Promise.all([
    fetchPropertiesData(),
    fetchCompanyData()
  ]);

  return { propertiesData, companyData };
}

export const dynamic = "force-dynamic";

export default async function Home() {
  const { propertiesData, companyData } = await getData();
  const homeBanner = companyData?.banners?.home;
  const googleReviews = companyData?.googleReviews || {
    placeId: process.env.GOOGLE_PLACES_PLACE_ID || "",
    apiKey: process.env.GOOGLE_PLACES_API_KEY || "",
    items: [],
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <Header />
      <Hero banner={homeBanner} />

      {/* ABOUT SECTION */}
      <HomeAbout company={companyData?.company} />

      {/* FEATURED PROPERTIES PREVIEW */}
      <FeaturedProjects projects={propertiesData} />

      {/* INSTAGRAM REELS PREVIEW */}
      <HomeReelsPreview reels={companyData?.company?.reels} />

      {/* HOME GALLERY */}
      <HomeGallery properties={propertiesData} galleryImages={companyData?.galleryImages} />

      {/* GOOGLE REVIEWS */}
      <GoogleReviews
        placeId={googleReviews?.placeId}
        apiKey={googleReviews?.apiKey}
        reviews={googleReviews?.items}
      />

      <Footer />
    </main>
  );
}
