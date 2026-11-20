import { HeroSection } from "./hero-section";
import { HomeIntro, PackagesSection, WhySection } from "./home-sections";
import { ReviewSection } from "./review-section";
import { TourOfTheMonth } from "./tour-of-the-month";
import { getTourRadarSummary } from "./tourradar";

export async function ShowlankaHome() {
  const tourRadar = await getTourRadarSummary();
  return (
    <>
      <HeroSection tourRadar={tourRadar} />
      <HomeIntro />
      <PackagesSection />
      <WhySection />
      <TourOfTheMonth />
      <ReviewSection tourRadar={tourRadar} />
    </>
  );
}
