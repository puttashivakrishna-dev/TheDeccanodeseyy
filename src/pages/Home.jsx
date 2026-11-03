import HeroSection from '@/components/home/HeroSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedSection from '@/components/home/FeaturedSection';
import SeasonalPicks from '@/components/home/SeasonalPicks';
import PlannerExplainer from '@/components/home/PlannerExplainer';
import { featuredDestinations, hiddenGems } from '@/data/destinations';

export default function Home() {
  return (
    <div>
      <HeroSection />
      <CategoryGrid />

      <FeaturedSection
        eyebrow="Editor’s picks"
        title="Featured destinations"
        description="The places worth building a trip around — chosen for the experience, not the queue."
        items={featuredDestinations.slice(0, 3)}
        actionLabel="See all"
        actionTo="/explore"
      />

      <FeaturedSection
        eyebrow="Hidden gems"
        title="Quiet corners of the Deccan"
        description="Smaller sites that see few visitors and reward the detour."
        items={hiddenGems.slice(0, 8)}
        actionLabel="More offbeat places"
        actionTo="/explore?sort=offbeat"
        variant="rail"
      />

      <SeasonalPicks />
      <PlannerExplainer />
    </div>
  );
}