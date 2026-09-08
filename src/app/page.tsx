import { getLibraryPoems } from "@/lib/catalog";
import { CinematicIntro } from "@/components/CinematicIntro";
import { FeaturedSalon } from "@/components/FeaturedSalon";
import { HeroSalon } from "@/components/HeroSalon";
import { PoetFeature } from "@/components/PoetFeature";
import { PortraitGallery } from "@/components/PortraitGallery";

export const dynamic = "force-dynamic";

export default async function Home() {
  const poems = await getLibraryPoems();
  return (
    <div>
      <CinematicIntro />
      <HeroSalon />
      <PoetFeature />
      <div id="honneur">
        <FeaturedSalon poems={poems} />
      </div>
      <PortraitGallery />
    </div>
  );
}
