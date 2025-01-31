import { SparklesPreview2 } from "@/components/Sparkles_bg";
import { TimelineDemo } from "@/components/Steps_timeline";
import TestimonialsDemo from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {

  return (
    <main className="min-h-screen bg-gray-100">
      <SparklesPreview2 />
      <TimelineDemo />
      <TestimonialsDemo />
      <Footer />
    </main>
  );
}
