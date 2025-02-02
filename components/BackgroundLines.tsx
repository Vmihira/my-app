import { BackgroundLines } from "@/components/ui/background-lines"
import { FlipWords } from "@/components/ui/flip-words"

export function BackgroundLinesDemo() {
  const words = ["Audio", "Documents", "PPT"]

  return (
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-100 to-neutral-400 dark:from-neutral-100 dark:to-neutral-400 text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
      Make beautiful and informative<br />
        <FlipWords words={words} />
        <br />
      </h2>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-300 dark:text-neutral-300 text-center">
        Meteor AI helps you make various types of documents, presentations, and audio files by just giving it an informative prompt.
      </p>
    </BackgroundLines>
  )
}

