import MyHero from "@/components/MyHeroSection.jsx";
import ProjectPreviewCard from "@/components/project-card.jsx";
import GitHubCalendar from "@/components/github-calender";


export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <MyHero />
      <ProjectPreviewCard count={3} />
      <GitHubCalendar/>
    </main>
  );
}