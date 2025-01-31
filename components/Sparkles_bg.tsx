"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles";
import { SparklesPreview } from "@/components/Sparkles_heading";
import { StickyScrollRevealDemo } from "./Scroll_reveal";
import { FloatingDockDemo } from "@/components/FloatingDockNavbar";
import { AnimatedPinDemo } from "@/components/Pin";

export function SparklesPreview2() {
  return (
    <div className="h-[130rem] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0 h-full">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <FloatingDockDemo />
      </div>
      <div>
        <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
          <SparklesPreview />
        </h1>
        <StickyScrollRevealDemo />
        <AnimatedPinDemo />
      </div>
    </div>
  );
}
