"use client"

import { useState, useEffect } from "react"

export default function FuturisticTimeline() {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    { title: "Initiate", description: "Give an informative prompt" },
    { title: "Select", description: "Selct audio, doc or ppt" },
    { title: "Preview", description: "Check out the results" },
    { title: "Save", description: "Download the output" },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black text-white py-8 sm:py-12 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between relative">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-full sm:w-1/4 mb-8 sm:mb-0 relative">
              <div
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center bg-gray-800 border-4 transition-all duration-500 ease-in-out z-10 ${
                  index === activeStep ? "border-blue-500 shadow-lg shadow-blue-500/50 scale-110" : "border-gray-700"
                }`}
              >
                <div className="text-center p-2">
                  <h3
                    className={`text-lg sm:text-xl font-semibold mb-1 transition-all duration-500 ${
                      index === activeStep ? "text-blue-500" : ""
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <>
                  {/* Horizontal line for larger screens */}
                  <div className="hidden sm:block absolute top-1/2 left-[calc(50%+16px)] right-[calc(-50%+16px)] h-1 bg-gray-700 transform -translate-y-1/2 overflow-hidden">
                    <div
                      className={`h-full bg-blue-500 transition-all duration-300 ease-in-out`}
                      style={{ width: index < activeStep ? "100%" : index === activeStep ? "50%" : "0%" }}
                    ></div>
                  </div>
                  {/* Vertical line for smaller screens */}
                  <div className="sm:hidden absolute top-full left-1/2 w-1 h-8 bg-gray-700 transform -translate-x-1/2 overflow-hidden">
                    <div
                      className={`w-full bg-blue-500 transition-all duration-300 ease-in-out`}
                      style={{ height: index < activeStep ? "100%" : index === activeStep ? "50%" : "0%" }}
                    ></div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
