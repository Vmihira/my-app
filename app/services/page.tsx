import { BackgroundLinesDemo } from "@/components/BackgroundLines";
import Footer from "@/components/Footer";
import FuturisticTimeline from "@/components/Services_timeline";
import FuturisticAIInput from "@/components/InputField";
import PresentationGenerator from "@/components/PresentationGenerator";

export default function Home() {
  return (
    <main className="min-h-screen bg-black-100 dark">
      <BackgroundLinesDemo />
      <FuturisticTimeline />
      {/*<FuturisticAIInput />*/}
      <PresentationGenerator />
      <Footer />
    </main>
  );
}
