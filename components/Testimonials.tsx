"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { Twitter, BadgeCheck } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: number;
  name: string;
  username: string;
  content: string;
  verified?: boolean;
  column: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Joe Mifsud",
    username: "@Joe_Mifsud",
    content: "These look awesome, nice work! ✨",
    verified: true,
    column: 0,
  },
  {
    id: 2,
    name: "Cody De Arkland",
    username: "@Codydearkland",
    content: "This library is so dope. Stoked to see more components drop. 🚀",
    verified: true,
    column: 1,
  },
  {
    id: 3,
    name: "Greg Bergé",
    username: "@gregberge_",
    content:
      "✨ Aceternity UI is a complete collections of stunning effects ready to used for your website. It's shadcn/ui for magic effects. Can't believe it's free!",
    column: 0,
  },
  {
    id: 4,
    name: "shubh",
    username: "@PatniShubh",
    content: "bro just keeps dropping crazy alpha 🔥",
    verified: true,
    column: 1,
  },
  {
    id: 5,
    name: "vish",
    username: "@indievish",
    content: "Well done Manu\nYou rock 🚀",
    verified: true,
    column: 2,
  },
  {
    id: 6,
    name: "sus646",
    username: "@sus6461",
    content: "is amazing ❤️ 🫶 ❤️ 🔥",
    column: 2,
  },
];

interface TestimonialsProps {
  baseSpeed?: number;
  debug?: boolean;
}

export default function Testimonials({
  baseSpeed = 0.5,
  debug = false,
}: TestimonialsProps) {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const columnRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const animationRef = useRef<number | null>(null);
  const scrollPositions = useRef([0, 0, 0]);
  const lastTimestamp = useRef<number | undefined>(undefined);

  const speeds = useMemo(
    () => [
      -baseSpeed * speedMultiplier,
      -baseSpeed * 1.2 * speedMultiplier,
      -baseSpeed * 0.8 * speedMultiplier,
    ],
    [baseSpeed, speedMultiplier]
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (!lastTimestamp.current) {
        lastTimestamp.current = timestamp;
      }
      const deltaTime = timestamp - lastTimestamp.current;
      lastTimestamp.current = timestamp;

      columnRefs.forEach((columnRef, index) => {
        const column = columnRef.current;
        if (!column) return;

        scrollPositions.current[index] += speeds[index] * (deltaTime / 16.67); // Normalize to 60fps

        const currentPosition = scrollPositions.current[index];
        const singleSetHeight = column.scrollHeight / 2;

        if (Math.abs(currentPosition) >= singleSetHeight) {
          scrollPositions.current[index] = currentPosition + singleSetHeight;
        }

        column.style.transform = `translateY(${scrollPositions.current[index]}px)`;
      });

      animationRef.current = requestAnimationFrame(animate);
    },
    [speeds, columnRefs]
  ); // Added columnRefs to dependencies

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  const handleMouseEnter = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    lastTimestamp.current = undefined;
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  const getColumnContent = useCallback((columnIndex: number) => {
    const columnTestimonials = testimonials.filter(
      (t) => t.column === columnIndex
    );
    return [...columnTestimonials, ...columnTestimonials].map(
      (testimonial, index) => (
        <div
          key={`${testimonial.id}-${index}`}
          className="bg-white rounded-xl p-6 shadow-lg mb-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={`/placeholder.svg?height=48&width=48`}
                alt=""
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {testimonial.name}
                </h3>
                {testimonial.verified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-gray-500 text-sm mb-3">
                {testimonial.username}
              </p>
              <p className="text-gray-800 whitespace-pre-line">
                {testimonial.content}
              </p>
              <div className="mt-4 flex justify-end">
                <Twitter className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>
        </div>
      )
    );
  }, []);

  const columnContents = useMemo(
    () => [getColumnContent(0), getColumnContent(1), getColumnContent(2)],
    [getColumnContent]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Loved by thousands of people
        </h2>
        <p className="text-xl text-gray-600">
          Here&apos;s what some of our users have to say about Aceternity UI.
        </p>
      </div>

      {debug && (
        <div className="max-w-md mx-auto mb-8">
          <label
            htmlFor="speed"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Speed Multiplier: {speedMultiplier.toFixed(2)}
          </label>
          <input
            type="range"
            id="speed"
            min="0.1"
            max="5"
            step="0.1"
            value={speedMultiplier}
            onChange={(e) =>
              setSpeedMultiplier(Number.parseFloat(e.target.value))
            }
            className="w-full"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
          {columnRefs.map((ref, index) => (
            <div key={index} className="relative h-[600px] overflow-hidden">
              <div
                ref={ref}
                className="absolute w-full transition-transform duration-1000 ease-linear will-change-transform"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {columnContents[index]}
              </div>
            </div>
          ))}
        </div>

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
