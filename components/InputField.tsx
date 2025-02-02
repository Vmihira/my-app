"use client"

import { useState } from "react"
import { Button, GlowingBorder } from "@/components/ui/moving-border"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const inputTypes = ["Audio", "Document", "PPT"]

export default function FuturisticAIInput() {
  const [prompt, setPrompt] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const handleTypeSelect = (type: string) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type) ? prevTypes.filter((t) => t !== type) : [...prevTypes, type],
    )
  }

  const handleTypeRemove = (type: string) => {
    setSelectedTypes((prevTypes) => prevTypes.filter((t) => t !== type))
  }

  return (
    <div className="bg-black flex items-center justify-center p-4 m-28">
      <div className="w-full max-w-3xl space-y-8">
        <motion.h1
          className="text-4xl font-bold text-center text-white mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Convey Meteor AI about what the topic
        </motion.h1>
        <GlowingBorder className="rounded-2xl p-1">
          <div className="relative bg-gray-800 rounded-xl">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent text-white p-4 pr-12 focus:outline-none placeholder-gray-400"
              placeholder="Enter your prompt here..."
            />
            <motion.button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={() => console.log("Send prompt:", prompt)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </motion.button>
          </div>
        </GlowingBorder>
        <AnimatePresence>
          {selectedTypes.length > 0 && (
            <motion.div
              className="flex flex-wrap gap-2 mt-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {selectedTypes.map((type) => (
                <motion.span
                  key={type}
                  className="bg-cyan-900 text-cyan-100 px-2 py-1 rounded-full text-sm flex items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {type}
                  <button onClick={() => handleTypeRemove(type)} className="ml-1 focus:outline-none">
                    <X size={14} />
                  </button>
                </motion.span>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex justify-center space-x-4 mt-4">
          {inputTypes.map((type) => (
            <Button
              key={type}
              onClick={() => handleTypeSelect(type)}
              className={`bg-gray-800 text-white transition-colors px-6 py-3 text-lg font-semibold ${
                selectedTypes.includes(type) ? "bg-cyan-900 text-cyan-100" : "hover:bg-gray-700"
              }`}
              borderClassName={`${
                selectedTypes.includes(type) ? "bg-[radial-gradient(var(--cyan-500)_40%,transparent_60%)]" : ""
              }`}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

