import MyHero from "@/components/MyHeroSection.jsx";
import ProjectPreviewCard from "@/components/project-card.jsx";
import GitHubCalendar from "@/components/github-calender";
import { getHero, defaultHeroContent } from "@/lib/db";

export default async function Home() {
  const heroFromDb = await getHero();
  const hero = heroFromDb ?? defaultHeroContent;

  return (
    <main className="flex flex-col w-full">
      <MyHero hero={hero} />
      <ProjectPreviewCard count={3} />
      <GitHubCalendar />
    </main>
  );
}
