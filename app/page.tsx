import { NavbarDemo } from "@/components/Navbar_display";
import { CarouselDemo } from "@/components/Carousel_shadcn";
import { SparklesPreview2 } from "@/components/Sparkles_bg";

export default function Home() {

  return (
    <main className="min-h-screen bg-gray-100">
      <NavbarDemo />
      <SparklesPreview2 />
      <CarouselDemo />
    </main>
  );
}
