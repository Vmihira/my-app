import { NavbarDemo } from "@/components/Navbar_display";
import { SparklesPreview2 } from "@/components/Sparkles_bg";
import { AnimatedPinDemo } from "@/components/Pin";
import { TimelineDemo } from "@/components/Steps_timeline";

export default function Home() {

  return (
    <main className="min-h-screen bg-gray-100">
      <NavbarDemo />
      <SparklesPreview2 />
      <AnimatedPinDemo />
      <TimelineDemo />
    </main>
  );
}
