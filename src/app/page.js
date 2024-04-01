import { Experience } from "@/components/Experience";

export const metadata = {
  openGraph: {
    title: "Lärare Ai Pro ",
    description: "Learn Swedish with Lärare Ai Pro",
  },
};
export default function Home() {
  return (
    <main className="h-screen min-h-screen  ">
      <Experience />
    </main>
  );
}
