// GET /api/projects
export async function GET() {
  const projects = [
    {
      title: "Conway's Game of Life",
      description: "Cellular automaton visualizer.",
      image: "/project2.png",
      link: "https://example.com/game-of-life",
      keywords: ["algorithms", "simulation"],
    },
    {
      title: "Next.js Starter",
      description: "Minimal starter with App Router.",
      image: "/project3.png",
      link: "https://example.com/next-starter",
      keywords: ["nextjs", "app-router"],
    },
    {
      title: "Forge",
      description: "App to help students to get information about the trade skills industry.",
      image: "/forge.png",
      link: "https://example.com/forge",
      keywords: ["nextjs", "app-router"],
    },
  ];
  return Response.json({ projects });
}
