import MyNavBar from "@/components/MyNavBar.js";
import MyHero from "@/components/MyHeroSection.jsx";
import ProjectPreviewCard from "@/components/project-card.jsx";

export default function Home() {
  return (
    <main className="flex flex-col w-full">
      <MyNavBar />
      <MyHero />
      <ProjectPreviewCard count={3} />
    </main>
  );
}