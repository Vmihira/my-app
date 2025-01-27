import { SparklesPreview2 } from "@/components/Sparkles_bg";
import { AnimatedPinDemo } from "@/components/Pin";
import { TimelineDemo } from "@/components/Steps_timeline";
import { FloatingDockDemo } from "@/components/FloatingDockNavbar";

export default function Home() {

  return (
    <main className="min-h-screen bg-gray-100">
      <FloatingDockDemo />
      <SparklesPreview2 />
      <AnimatedPinDemo />
      <TimelineDemo />
    </main>
  );
}
