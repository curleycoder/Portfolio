import Image from "next/image";
import MyNavBar from "@/components/MyNavBar";


export default function Home() {
  return (
    <main>
      <MyNavBar />
      <div>
        <h1 className="text-4xl font-bold">Welcome to My Portfolio</h1>
      </div>
    </main>

  );
}


