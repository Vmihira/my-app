"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Play,
  Clock,
  Palette,
  StickyNote,
  FileText,
  FileImage,
  FileIcon,
  X,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import pptxgen from "pptxgenjs";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Define TypeScript types for our JSON structure
type SlideContent = {
  type:
    | "paragraph"
    | "bullets"
    | "image-left"
    | "image-right"
    | "quote"
    | "title-only"
    | "two-column"
    | "grid-images"
    | "timeline"
    | "chart"
    | "section-divider";
  text?: string;
  bullets?: string[];
  quote?: {
    text: string;
    author: string;
  };
  columns?: {
    left: string;
    right: string;
    leftTitle?: string;
    rightTitle?: string;
  };
  images?: string[];
  timelineEvents?: {
    year: string;
    event: string;
  }[];
  chartData?: {
    labels: string[];
    values: number[];
    type: "bar" | "line" | "pie";
  };
  notes?: string; // Added presenter notes
};

type Slide = {
  title: string;
  imageUrl?: string;
  content?: SlideContent;
  backgroundColor?: string;
  textColor?: string;
  transition?: "fade" | "slide" | "zoom" | "flip" | "none";
};

type PresentationTheme = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  accentColor?: string;
};

type Presentation = {
  title: string;
  theme: PresentationTheme;
  slides: Slide[];
};

// Predefined themes
const predefinedThemes: PresentationTheme[] = [
  {
    name: "Corporate Blue",
    primaryColor: "#2c3e50",
    secondaryColor: "#3498db",
    accentColor: "#e74c3c",
    fontFamily: "Inter, sans-serif",
  },
  {
    name: "Minimal Light",
    primaryColor: "#ffffff",
    secondaryColor: "#f8f9fa",
    accentColor: "#6c5ce7",
    fontFamily: "Inter, sans-serif",
  },
  {
    name: "Dark Elegance",
    primaryColor: "#1a1a2e",
    secondaryColor: "#16213e",
    accentColor: "#e94560",
    fontFamily: "Poppins, sans-serif",
  },
  {
    name: "Nature Green",
    primaryColor: "#2d6a4f",
    secondaryColor: "#40916c",
    accentColor: "#d8f3dc",
    fontFamily: "Montserrat, sans-serif",
  },
  {
    name: "Vibrant Orange",
    primaryColor: "#ff9a00",
    secondaryColor: "#ff7b00",
    accentColor: "#ffffff",
    fontFamily: "Roboto, sans-serif",
  },
];

// Input types for the futuristic input component
const inputTypes = ["Audio", "Document", "PPT"];

// System instruction for Gemini API
const SYSTEM_INSTRUCTION = `You are an AI Presentation Generator. Your task is to create structured and visually appealing presentations based on user-provided topics. You will receive a user's request for a presentation, and you must respond with a JSON object that defines the presentation's content and style.

**Instructions:**

1. **Understand the User's Request:** Carefully analyze the user's input to determine the topic and key points they want to cover in the presentation.
2. **Generate High-Quality Content:** Produce accurate, relevant, and engaging content for each slide. Ensure the information is presented in a clear and concise manner. Make sure that there is a lot of relavant content in each slide.
3. **Structure the Presentation:** Organize the content into a logical flow with an introduction, main points, and a conclusion.
4. **Format the Output as JSON:** Adhere strictly to the following JSON structure to define the presentation:

{
  "title": "Presentation Title",
  "theme": {
    "primaryColor": "#1a5276",
    "secondaryColor": "#2ecc71",
    "fontFamily": "Inter, sans-serif"
  },
  "slides": [
    {
      "title": "First Slide Title",
      "imageUrl": "https://example.com/image.jpg",
      "backgroundColor": "#1a5276",
      "textColor": "#ffffff"
    },
    {
      "title": "Content Slide with Paragraph",
      "backgroundColor": "#ffffff",
      "textColor": "#333333",
      "content": {
        "type": "paragraph",
        "text": "This is a paragraph of text that will be displayed on the slide."
      }
    },
    {
      "title": "Bullet Points Slide",
      "backgroundColor": "#f8f9fa",
      "textColor": "#333333",
      "content": {
        "type": "bullets",
        "bullets": [
          "First bullet point",
          "Second bullet point",
          "Third bullet point"
        ]
      }
    },
    {
      "title": "Image and Text (Right)",
      "imageUrl": "https://example.com/image2.jpg",
      "backgroundColor": "#ffffff",
      "textColor": "#333333",
      "content": {
        "type": "image-right",
        "text": "This text will appear on the left side with the image on the right."
      }
    },
    {
      "title": "Image and Text (Left)",
      "imageUrl": "https://example.com/image3.jpg",
      "backgroundColor": "#f8f9fa",
      "textColor": "#333333",
      "content": {
        "type": "image-left",
        "text": "This text will appear on the right side with the image on the left."
      }
    },
    {
      "title": "Quote Slide",
      "backgroundColor": "#2c3e50",
      "textColor": "#ecf0f1",
      "content": {
        "type": "quote",
        "quote": {
          "text": "This is a quote that will be displayed prominently.",
          "author": "Author Name"
        }
      }
    },
    {
      "title": "Final Slide",
      "backgroundColor": "#1a5276",
      "textColor": "#ffffff",
      "content": {
        "type": "title-only"
      }
    }
  ]
}

5. **Utilize Available Content Types:** Use the following content types within the \`content\` object:
   * \`paragraph\`: For blocks of text.
   * \`bullets\`: For lists of bullet points.
   * \`two-column\`: For two columns of text with optional titles.
   * \`timeline\`: For displaying a sequence of events.
   * \`quote\`: For displaying a quote with an author.
   * \`section-divider\`: For a slide that introduces a new section.
   * \`title-only\`: For a slide with only a title.
6. **Theme:** Choose appropriate \`primaryColor\`, \`secondaryColor\`, and \`fontFamily\` values to create a visually appealing theme that complements the topic.
7. **Slide Variety:** Use a mix of different content types to keep the presentation engaging.
8. **Length:** create presentations with at least 5 slides, and up to 10 slides, depending on the complexity of the topic.
9. **Do not include any text outside of the JSON output.**
10. PLease generate longs jsons with full contents and also use valid related image urls from the web in the generated json`;

export default function PresentationGenerator() {
  // State for the user input
  const [prompt, setPrompt] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["PPT"]);

  // State for the presentation data
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  // State for the current slide index
  const [currentSlide, setCurrentSlide] = useState(0);
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for presentation mode
  const [presentationMode, setPresentationMode] = useState(false);
  // State for showing presenter notes
  const [showNotes, setShowNotes] = useState(false);
  // State for presenter notes content
  const [currentNotes, setCurrentNotes] = useState("");
  // State for timer
  const [timer, setTimer] = useState(0);
  // State for timer running
  const [timerRunning, setTimerRunning] = useState(false);
  // State for export dialog
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  // State for export format
  const [exportFormat, setExportFormat] = useState("pdf");
  // State for theme selection dialog
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  // State for selected theme
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  // Ref for notes textarea
  const notesTextareaRef = useRef<HTMLTextAreaElement>(null);
  // State for API error
  const [apiError, setApiError] = useState<string | null>(null);

  // Handle type selection for the input component
  const handleTypeSelect = (type: string) => {
    setSelectedTypes((prevTypes) =>
      prevTypes.includes(type)
        ? prevTypes.filter((t) => t !== type)
        : [...prevTypes, type]
    );
  };

  // Handle type removal for the input component
  const handleTypeRemove = (type: string) => {
    setSelectedTypes((prevTypes) => prevTypes.filter((t) => t !== type));
  };

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Function to call Gemini API to generate presentation content
  const callGeminiAPI = async (
    userPrompt: string
  ): Promise<Presentation | null> => {
    try {
      // For development or when API key is not available, use simulated response
      if (false) {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return generateSimulatedResponse(userPrompt);
      }

      // Initialize the Google Generative AI client
      const genAI = new GoogleGenerativeAI(
        "AIzaSyCWbU4uNJqAW-XWYky2z_YH77RAj2Hium4"
      );

      // Get the model
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: SYSTEM_INSTRUCTION,
      });

      // Create generation config
      const generationConfig = {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };

      // Start a chat session
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      // Send the message
      const result = await chatSession.sendMessage(userPrompt);
      const responseText = result.response.text();

      // Extract the JSON part of the response
      // First, find the first { and last }
      const firstBraceIndex = responseText.indexOf("{");
      const lastBraceIndex = responseText.lastIndexOf("}");

      if (
        firstBraceIndex === -1 ||
        lastBraceIndex === -1 ||
        firstBraceIndex >= lastBraceIndex
      ) {
        console.error(
          "Could not extract valid JSON from API response:",
          responseText
        );
        throw new Error("Could not extract valid JSON from API response");
      }

      // Extract just the JSON part
      const jsonString = responseText.substring(
        firstBraceIndex,
        lastBraceIndex + 1
      );

      try {
        // Parse the JSON
        const presentationData = JSON.parse(jsonString);

        // Validate the required fields
        if (
          !presentationData.title ||
          !presentationData.slides ||
          !Array.isArray(presentationData.slides)
        ) {
          throw new Error("Invalid presentation data: missing required fields");
        }

        // Convert the theme format if needed
        let theme: PresentationTheme;

        if (presentationData.theme) {
          theme = {
            name: "Custom Theme",
            primaryColor: presentationData.theme.primaryColor || "#1a5276",
            secondaryColor: presentationData.theme.secondaryColor || "#2ecc71",
            fontFamily:
              presentationData.theme.fontFamily || "Inter, sans-serif",
            accentColor: presentationData.theme.accentColor || "#e74c3c",
          };
        } else {
          // Default theme if none provided
          theme = predefinedThemes[0];
        }

        // Return the presentation with the theme
        return {
          title: presentationData.title,
          theme: theme,
          slides: presentationData.slides,
        };
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        console.error("JSON string:", jsonString);
        throw new Error("Failed to parse JSON from API response");
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setApiError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      // Fall back to simulated response
      console.log("Falling back to simulated response");
      return generateSimulatedResponse(userPrompt);
    }
  };

  // Function to generate a simulated response (for development or when API key is not available)
  const generateSimulatedResponse = (userPrompt: string): Presentation => {
    // Extract a title from the prompt
    const title =
      userPrompt.length > 30 ? userPrompt.substring(0, 30) + "..." : userPrompt;

    // Generate some slides based on the prompt
    const slides: Slide[] = [
      {
        title: title,
        backgroundColor: "#2c3e50",
        textColor: "#ffffff",
        transition: "fade",
        imageUrl: "/placeholder.svg?height=800&width=1200",
      },
      {
        title: "Introduction",
        backgroundColor: "#ecf0f1",
        textColor: "#2c3e50",
        content: {
          type: "section-divider",
          text: "Let's explore " + userPrompt,
          notes:
            "This is an introduction slide. Pause here to introduce the main topics.",
        },
        transition: "zoom",
      },
      {
        title: "Key Points",
        backgroundColor: "#ffffff",
        textColor: "#2c3e50",
        content: {
          type: "bullets",
          bullets: [
            "First key point about " + userPrompt,
            "Second important aspect to consider",
            "Third element worth discussing",
            "Fourth critical component",
            "Fifth relevant consideration",
          ],
          notes: "Go through each bullet point with a brief explanation.",
        },
        transition: "fade",
      },
      {
        title: "Visual Representation",
        imageUrl: "/placeholder.svg?height=600&width=800",
        backgroundColor: "#ffffff",
        textColor: "#2c3e50",
        content: {
          type: "image-right",
          text:
            "This visual representation helps illustrate the key concepts related to " +
            userPrompt +
            ". The image provides context and makes the information more accessible to visual learners.",
          notes:
            "Explain the significance of the visual and how it relates to the topic.",
        },
        transition: "slide",
      },
      {
        title: "Comparing Perspectives",
        backgroundColor: "#ffffff",
        textColor: "#2c3e50",
        content: {
          type: "two-column",
          columns: {
            leftTitle: "Traditional Approach",
            left:
              "The conventional understanding of " +
              userPrompt +
              " focuses on established methodologies and historical context.",
            rightTitle: "Modern Perspective",
            right:
              "Contemporary views on " +
              userPrompt +
              " incorporate recent developments and innovative thinking.",
          },
          notes: "Highlight the evolution of thinking on this topic over time.",
        },
        transition: "slide",
      },
      {
        title: "Timeline of Developments",
        backgroundColor: "#f8f9fa",
        textColor: "#2c3e50",
        content: {
          type: "timeline",
          timelineEvents: [
            {
              year: "Early Stage",
              event: "Initial developments related to " + userPrompt,
            },
            {
              year: "Middle Period",
              event: "Significant advancements and refinements",
            },
            {
              year: "Recent Times",
              event: "Current state and latest innovations",
            },
            {
              year: "Future",
              event: "Projected developments and potential directions",
            },
          ],
          notes: "This timeline shows the evolution of the topic over time.",
        },
        transition: "fade",
      },
      {
        title: "Expert Insight",
        backgroundColor: "#34495e",
        textColor: "#ecf0f1",
        content: {
          type: "quote",
          quote: {
            text:
              "The most profound insights about " +
              userPrompt +
              " come from examining it from multiple perspectives.",
            author: "Expert in the field",
          },
          notes:
            "This quote emphasizes the importance of diverse viewpoints on the topic.",
        },
        transition: "zoom",
      },
      {
        title: "Conclusion",
        backgroundColor: "#2c3e50",
        textColor: "#ffffff",
        content: {
          type: "paragraph",
          text:
            "In conclusion, " +
            userPrompt +
            " represents an important area of study with significant implications. By understanding its key components and evolution, we can better appreciate its relevance and potential future developments.",
          notes:
            "Summarize the key points and emphasize the significance of the topic.",
        },
        transition: "fade",
      },
      {
        title: "Thank You",
        backgroundColor: "#2c3e50",
        textColor: "#ffffff",
        content: {
          type: "title-only",
          notes:
            "Thank the audience for their attention and open the floor for questions.",
        },
        transition: "fade",
      },
    ];

    return {
      title: title,
      theme: predefinedThemes[0], // Default to Corporate Blue theme
      slides: slides,
    };
  };

  // Function to generate presentation data based on user input
  const generatePresentation = async () => {
    if (!prompt || !selectedTypes.includes("PPT")) {
      alert("Please enter a prompt and select PPT as the output type");
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      // Call Gemini API to generate presentation content
      const generatedPresentation = await callGeminiAPI(prompt);

      if (generatedPresentation) {
        setPresentation(generatedPresentation);
        setCurrentSlide(0);
        // Update notes for the first slide
        if (generatedPresentation.slides[0]?.content?.notes) {
          setCurrentNotes(generatedPresentation.slides[0].content.notes);
        }
      } else {
        // If we didn't get a presentation back, use a fallback
        const fallbackPresentation = generateSimulatedResponse(prompt);
        setPresentation(fallbackPresentation);
        setCurrentSlide(0);
        if (fallbackPresentation.slides[0]?.content?.notes) {
          setCurrentNotes(fallbackPresentation.slides[0].content.notes);
        }
      }
    } catch (error) {
      console.error("Error generating presentation:", error);
      setApiError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );

      // Even if there's an error, provide a fallback presentation
      const fallbackPresentation = generateSimulatedResponse(prompt);
      setPresentation(fallbackPresentation);
      setCurrentSlide(0);
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to the next slide
  const nextSlide = () => {
    if (presentation && currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      updateCurrentNotes(currentSlide + 1);
    }
  };

  // Function to navigate to the previous slide
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      updateCurrentNotes(currentSlide - 1);
    }
  };

  // Function to toggle presentation mode
  const togglePresentationMode = () => {
    setPresentationMode(!presentationMode);
    if (!presentationMode) {
      // Reset and start timer when entering presentation mode
      setTimer(0);
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  };

  // Function to update current notes
  const updateCurrentNotes = (slideIndex: number) => {
    if (presentation && presentation.slides[slideIndex]?.content?.notes) {
      setCurrentNotes(presentation.slides[slideIndex].content!.notes || "");
    } else {
      setCurrentNotes("");
    }
  };

  // Function to save notes for the current slide
  const saveNotes = () => {
    if (presentation && notesTextareaRef.current) {
      const newNotes = notesTextareaRef.current.value;
      const updatedSlides = [...presentation.slides];

      if (!updatedSlides[currentSlide].content) {
        updatedSlides[currentSlide].content = {
          type: "title-only",
          notes: newNotes,
        };
      } else {
        updatedSlides[currentSlide].content!.notes = newNotes;
      }

      setPresentation({
        ...presentation,
        slides: updatedSlides,
      });

      setCurrentNotes(newNotes);
    }
  };

  // Function to toggle notes visibility
  const toggleNotes = () => {
    setShowNotes(!showNotes);
    updateCurrentNotes(currentSlide);
  };

  // Function to change theme
  const changeTheme = (themeName: string) => {
    if (!presentation) return;

    const newTheme = predefinedThemes.find((theme) => theme.name === themeName);
    if (!newTheme) return;

    setPresentation({
      ...presentation,
      theme: newTheme,
    });

    setSelectedTheme(themeName);
    setThemeDialogOpen(false);
  };

  // Function to render a slide based on its content type
  const renderSlideContent = (slide: Slide) => {
    if (!slide.content) return null;

    switch (slide.content.type) {
      case "paragraph":
        return (
          <div className="text-lg leading-relaxed">{slide.content.text}</div>
        );
      case "bullets":
        return (
          <ul className="list-disc pl-6 space-y-2 text-lg">
            {slide.content.bullets?.map((bullet, index) => (
              <li
                key={index}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {bullet}
              </li>
            ))}
          </ul>
        );
      case "image-left":
        return (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {slide.imageUrl && (
              <div className="w-full md:w-1/2">
                <img
                  src={
                    slide.imageUrl || "/placeholder.svg?height=400&width=600"
                  }
                  alt={slide.title}
                  className="rounded-lg shadow-lg object-cover w-full h-auto max-h-[400px]"
                />
              </div>
            )}
            <div className="w-full md:w-1/2 text-lg">{slide.content.text}</div>
          </div>
        );
      case "image-right":
        return (
          <div className="flex flex-col-reverse md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 text-lg">{slide.content.text}</div>
            {slide.imageUrl && (
              <div className="w-full md:w-1/2">
                <img
                  src={
                    slide.imageUrl || "/placeholder.svg?height=400&width=600"
                  }
                  alt={slide.title}
                  className="rounded-lg shadow-lg object-cover w-full h-auto max-h-[400px]"
                />
              </div>
            )}
          </div>
        );
      case "quote":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <blockquote className="text-2xl italic font-medium text-center">
              "{slide.content.quote?.text}"
            </blockquote>
            <cite className="mt-4 text-lg">
              — {slide.content.quote?.author}
            </cite>
          </div>
        );
      case "title-only":
        return null; // Title is already displayed separately
      case "two-column":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              {slide.content.columns?.leftTitle && (
                <h3 className="text-xl font-semibold">
                  {slide.content.columns.leftTitle}
                </h3>
              )}
              <div className="text-lg">{slide.content.columns?.left}</div>
            </div>
            <div className="space-y-2">
              {slide.content.columns?.rightTitle && (
                <h3 className="text-xl font-semibold">
                  {slide.content.columns.rightTitle}
                </h3>
              )}
              <div className="text-lg">{slide.content.columns?.right}</div>
            </div>
          </div>
        );
      case "grid-images":
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {slide.content.images?.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square overflow-hidden rounded-lg shadow-md"
              >
                <img
                  src={img || "/placeholder.svg?height=200&width=200"}
                  alt={`Grid image ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            ))}
          </div>
        );
      case "timeline":
        return (
          <div className="space-y-6">
            {slide.content.timelineEvents?.map((event, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 animate-fadeIn"
                style={{ animationDelay: `${idx * 0.2}s` }}
              >
                <div className="flex-shrink-0 w-24 font-bold text-xl">
                  {event.year}
                </div>
                <div className="flex-1 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="text-lg">{event.event}</div>
                </div>
              </div>
            ))}
          </div>
        );
      case "chart":
        return (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
              [Chart Visualization Would Appear Here]
              <div className="mt-4 text-sm opacity-70">
                {slide.content.chartData?.type} chart showing{" "}
                {slide.content.chartData?.labels.join(", ")}
              </div>
            </div>
          </div>
        );
      case "section-divider":
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-4xl md:text-6xl font-bold text-center">
              {slide.content.text}
            </h1>
          </div>
        );
      default:
        return <div>{slide.content.text}</div>;
    }
  };

  // Function to get transition class
  const getTransitionClass = (slide: Slide) => {
    if (!slide.transition || slide.transition === "none") return "";

    switch (slide.transition) {
      case "fade":
        return "animate-fadeIn";
      case "slide":
        return "animate-slideIn";
      case "zoom":
        return "animate-zoomIn";
      case "flip":
        return "animate-flipIn";
      default:
        return "";
    }
  };

  // Function to render the current slide
  const renderSlide = () => {
    if (!presentation) return null;

    const slide = presentation.slides[currentSlide];
    const isFirstSlide = currentSlide === 0;

    // Custom background and text colors
    const backgroundColor =
      slide.backgroundColor || presentation.theme.primaryColor;
    const textColor = slide.textColor || (isFirstSlide ? "#ffffff" : "#333333");

    return (
      <div
        className={cn(
          "w-full h-full flex flex-col p-8 md:p-12 rounded-lg shadow-xl transition-all duration-500",
          presentationMode
            ? "fixed inset-0 z-50 rounded-none"
            : "min-h-[500px]",
          getTransitionClass(slide)
        )}
        style={{
          backgroundColor,
          color: textColor,
          fontFamily: presentation.theme.fontFamily || "inherit",
          backgroundImage:
            slide.imageUrl && isFirstSlide
              ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slide.imageUrl})`
              : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Slide number indicator */}
        <div className="absolute top-4 right-4 text-sm opacity-70">
          {currentSlide + 1} / {presentation.slides.length}
        </div>

        {/* Slide content */}
        <div className="flex flex-col h-full">
          {/* Title */}
          <h2
            className={cn(
              "mb-6 font-bold",
              isFirstSlide
                ? "text-4xl md:text-6xl text-center mt-20"
                : "text-3xl md:text-4xl"
            )}
          >
            {slide.title}
          </h2>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center">
            {renderSlideContent(slide)}
          </div>
        </div>
      </div>
    );
  };

  // Function to handle export dialog open
  const handleExportClick = () => {
    setExportDialogOpen(true);
  };

  // Function to export presentation based on selected format
  const exportPresentation = () => {
    if (!presentation) return;

    switch (exportFormat) {
      case "pdf":
        exportAsPDF();
        break;
      case "ppt":
        exportAsPPTX();
        break;
      case "docx":
        exportAsDOCX();
        break;
      default:
        exportAsPDF();
    }

    setExportDialogOpen(false);
  };

  // Function to export as PDF
  const exportAsPDF = () => {
    // Create a new window for the exportable version
    const exportWindow = window.open("", "_blank");
    if (!exportWindow) {
      alert("Please allow popups to export the presentation");
      return;
    }

    // Generate HTML content for the presentation
    let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${presentation!.title}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: ${
            presentation!.theme.fontFamily || "Arial, sans-serif"
          }; margin: 0; padding: 0; }
          .slide { page-break-after: always; height: 100vh; padding: 5%; box-sizing: border-box; display: flex; flex-direction: column; }
          .slide-content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
          h1, h2 { margin-top: 0; }
          img { max-width: 100%; max-height: 50vh; object-fit: contain; }
          ul { padding-left: 20px; }
          .two-column { display: flex; gap: 20px; }
          .two-column > div { flex: 1; }
          .timeline-event { margin-bottom: 15px; }
          .timeline-year { font-weight: bold; }
          .grid-images { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
          .section-divider { display: flex; align-items: center; justify-content: center; height: 100%; }
          .chart-container { width: 100%; height: 300px; }
          blockquote { font-style: italic; font-size: 1.5em; margin: 20px 0; }
          cite { display: block; text-align: right; margin-top: 10px; }
          @media print {
            .slide { page-break-after: always; height: 100vh; }
          }
        </style>
      </head>
      <body>
    `;

    // Add each slide to the HTML content
    presentation!.slides.forEach((slide, index) => {
      const isFirstSlide = index === 0;
      const backgroundColor =
        slide.backgroundColor || presentation!.theme.primaryColor;
      const textColor =
        slide.textColor || (isFirstSlide ? "#ffffff" : "#333333");

      htmlContent += `
        <div class="slide" style="background-color: ${backgroundColor}; color: ${textColor}; ${
        slide.imageUrl && isFirstSlide
          ? `background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slide.imageUrl}); background-size: cover; background-position: center;`
          : ""
      }">
          <h2>${slide.title}</h2>
          <div class="slide-content">
      `;

      // Add slide content based on type
      if (slide.content) {
        switch (slide.content.type) {
          case "paragraph":
            htmlContent += `<p>${slide.content.text}</p>`;
            break;
          case "bullets":
            htmlContent += `<ul>${slide.content.bullets
              ?.map((bullet) => `<li>${bullet}</li>`)
              .join("")}</ul>`;
            break;
          case "image-left":
            htmlContent += `
              <div style="display: flex; gap: 20px; align-items: center;">
                ${
                  slide.imageUrl
                    ? `<div style="flex: 1;"><img src="${slide.imageUrl}" alt="${slide.title}"></div>`
                    : ""
                }
                <div style="flex: 1;"><p>${slide.content.text}</p></div>
              </div>
            `;
            break;
          case "image-right":
            htmlContent += `
              <div style="display: flex; gap: 20px; align-items: center;">
                <div style="flex: 1;"><p>${slide.content.text}</p></div>
                ${
                  slide.imageUrl
                    ? `<div style="flex: 1;"><img src="${slide.imageUrl}" alt="${slide.title}"></div>`
                    : ""
                }
              </div>
            `;
            break;
          case "quote":
            htmlContent += `
              <blockquote>"${slide.content.quote?.text}"</blockquote>
              <cite>— ${slide.content.quote?.author}</cite>
            `;
            break;
          case "two-column":
            htmlContent += `
              <div class="two-column">
                <div>
                  ${
                    slide.content.columns?.leftTitle
                      ? `<h3>${slide.content.columns.leftTitle}</h3>`
                      : ""
                  }
                  <p>${slide.content.columns?.left}</p>
                </div>
                <div>
                  ${
                    slide.content.columns?.rightTitle
                      ? `<h3>${slide.content.columns.rightTitle}</h3>`
                      : ""
                  }
                  <p>${slide.content.columns?.right}</p>
                </div>
              </div>
            `;
            break;
          case "grid-images":
            htmlContent += `
              <div class="grid-images">
                ${slide.content.images
                  ?.map((img) => `<img src="${img}" alt="Grid image">`)
                  .join("")}
              </div>
            `;
            break;
          case "timeline":
            htmlContent += `
              <div class="timeline">
                ${slide.content.timelineEvents
                  ?.map(
                    (event) => `
                  <div class="timeline-event">
                    <div class="timeline-year">${event.year}</div>
                    <div class="timeline-description">${event.event}</div>
                  </div>
                `
                  )
                  .join("")}
              </div>
            `;
            break;
          case "section-divider":
            htmlContent += `
              <div class="section-divider">
                <h1>${slide.content.text}</h1>
              </div>
            `;
            break;
        }
      }

      htmlContent += `
          </div>
        </div>
      `;
    });

    htmlContent += `
      <script>
        window.onload = function() {
          window.print();
        }
      </script>
      </body>
      </html>
    `;

    // Write the HTML content to the new window
    exportWindow.document.write(htmlContent);
    exportWindow.document.close();
  };

  // Function to export as PPTX using pptxgenjs
  const exportAsPPTX = () => {
    if (!presentation) return;

    try {
      // Create a new presentation
      const pptx = new pptxgen();

      // Set presentation properties
      pptx.author = "AI Presentation Generator";
      pptx.company = "AI Presentation Generator";
      pptx.subject = presentation.title;
      pptx.title = presentation.title;

      // Set theme colors
      pptx.defineLayout({ name: "CUSTOM", width: 10, height: 5.625 });
      pptx.layout = "CUSTOM";

      // Process each slide
      presentation.slides.forEach((slide, index) => {
        const isFirstSlide = index === 0;
        const backgroundColor =
          slide.backgroundColor || presentation.theme.primaryColor;
        const textColor =
          slide.textColor || (isFirstSlide ? "#ffffff" : "#333333");

        // Create a new slide
        const pptxSlide = pptx.addSlide();

        // Set background color
        pptxSlide.background = { color: backgroundColor };

        // Add title
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: 9,
          h: 1,
          color: textColor,
          fontSize: isFirstSlide ? 44 : 36,
          bold: true,
          align: isFirstSlide ? "center" : "left",
        });

        // Add content based on type
        if (slide.content) {
          switch (slide.content.type) {
            case "paragraph":
              pptxSlide.addText(slide.content.text || "", {
                x: 0.5,
                y: 1.5,
                w: 9,
                h: 3,
                color: textColor,
                fontSize: 18,
                align: "left",
              });
              break;

            case "bullets":
              if (slide.content.bullets && slide.content.bullets.length > 0) {
                pptxSlide.addText(
                  slide.content.bullets
                    .map((bullet) => `• ${bullet}`)
                    .join("\n"),
                  {
                    x: 0.5,
                    y: 1.5,
                    w: 9,
                    h: 3,
                    color: textColor,
                    fontSize: 18,
                    align: "left",
                    breakLine: true,
                  }
                );
              }
              break;

            case "quote":
              if (slide.content.quote) {
                pptxSlide.addText(`"${slide.content.quote.text}"`, {
                  x: 1,
                  y: 2,
                  w: 8,
                  h: 1.5,
                  color: textColor,
                  fontSize: 24,
                  italic: true,
                  align: "center",
                });

                pptxSlide.addText(`— ${slide.content.quote.author}`, {
                  x: 1,
                  y: 3.5,
                  w: 8,
                  h: 0.5,
                  color: textColor,
                  fontSize: 16,
                  align: "right",
                });
              }
              break;

            case "two-column":
              if (slide.content.columns) {
                // Left column title
                if (slide.content.columns.leftTitle) {
                  pptxSlide.addText(slide.content.columns.leftTitle, {
                    x: 0.5,
                    y: 1.5,
                    w: 4,
                    h: 0.5,
                    color: textColor,
                    fontSize: 20,
                    bold: true,
                    align: "left",
                  });
                }

                // Left column content
                pptxSlide.addText(slide.content.columns.left || "", {
                  x: 0.5,
                  y: 2,
                  w: 4,
                  h: 2.5,
                  color: textColor,
                  fontSize: 16,
                  align: "left",
                });

                // Right column title
                if (slide.content.columns.rightTitle) {
                  pptxSlide.addText(slide.content.columns.rightTitle, {
                    x: 5,
                    y: 1.5,
                    w: 4,
                    h: 0.5,
                    color: textColor,
                    fontSize: 20,
                    bold: true,
                    align: "left",
                  });
                }

                // Right column content
                pptxSlide.addText(slide.content.columns.right || "", {
                  x: 5,
                  y: 2,
                  w: 4,
                  h: 2.5,
                  color: textColor,
                  fontSize: 16,
                  align: "left",
                });
              }
              break;

            case "timeline":
              if (
                slide.content.timelineEvents &&
                slide.content.timelineEvents.length > 0
              ) {
                const timelineText = slide.content.timelineEvents
                  .map((event) => `${event.year}: ${event.event}`)
                  .join("\n\n");

                pptxSlide.addText(timelineText, {
                  x: 0.5,
                  y: 1.5,
                  w: 9,
                  h: 3,
                  color: textColor,
                  fontSize: 16,
                  align: "left",
                  breakLine: true,
                });
              }
              break;

            case "section-divider":
              pptxSlide.addText(slide.content.text || "", {
                x: 0.5,
                y: 2,
                w: 9,
                h: 1.5,
                color: textColor,
                fontSize: 36,
                bold: true,
                align: "center",
              });
              break;
          }
        }

        // Add notes if available
        if (slide.content?.notes) {
          pptxSlide.addNotes(slide.content.notes);
        }
      });

      // Save the presentation
      pptx.writeFile({
        fileName: `${presentation.title.replace(/\s+/g, "_")}.pptx`,
      });
    } catch (error) {
      console.error("Error exporting to PPTX:", error);
      alert("An error occurred while exporting to PPTX. Please try again.");
    }
  };

  // Function to export as DOCX
  const exportAsDOCX = () => {
    // Create a JSON representation of the presentation
    const presentationData = JSON.stringify(presentation, null, 2);

    // Create a Blob containing the data
    const blob = new Blob([presentationData], { type: "application/json" });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;
    link.download = `${presentation!.title.replace(
      /\s+/g,
      "_"
    )}_docx_export.json`;

    // Append the link to the body
    document.body.appendChild(link);

    // Simulate a click on the link
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);

    // Display a message to the user
    alert(
      "In a real implementation, this JSON would be sent to a server that would generate a DOCX file. For this demo, we've downloaded the presentation data as JSON."
    );
  };

  // Render the component
  return (
    <div className="container mx-auto py-8">
      {/* Input Field Component */}
      <div className="bg-black flex items-center justify-center p-4 mb-8 rounded-xl">
        <div className="w-full max-w-3xl space-y-8">
          <h1 className="text-4xl font-bold text-center text-white mb-8">
            AI Presentation Generator
          </h1>
          <div className="relative bg-gray-800 rounded-xl p-1">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-transparent text-white p-4 pr-12 focus:outline-none placeholder-gray-400 rounded-xl"
              placeholder="Enter your presentation topic here..."
            />
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-cyan-400 hover:text-cyan-300 transition-colors"
              onClick={generatePresentation}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          {selectedTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTypes.map((type) => (
                <span
                  key={type}
                  className="bg-cyan-900 text-cyan-100 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {type}
                  <button
                    onClick={() => handleTypeRemove(type)}
                    className="ml-1 focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex justify-center space-x-4 mt-4">
            {inputTypes.map((type) => (
              <Button
                key={type}
                onClick={() => handleTypeSelect(type)}
                className={`bg-gray-800 text-white transition-colors px-6 py-3 text-lg font-semibold ${
                  selectedTypes.includes(type)
                    ? "bg-cyan-900 text-cyan-100"
                    : "hover:bg-gray-700"
                }`}
                variant="ghost"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* API Error Message */}
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{apiError}</p>
        </div>
      )}

      {/* Presentation Generator */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-lg mb-6">Generating your presentation...</p>
          <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : presentation ? (
        <div className="space-y-6">
          {/* Presentation title */}
          <h2 className="text-2xl font-semibold">{presentation.title}</h2>

          {/* Presentation controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={nextSlide}
              disabled={currentSlide === presentation.slides.length - 1}
            >
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={togglePresentationMode}>
              <Play className="mr-1 h-4 w-4" />{" "}
              {presentationMode ? "Exit" : "Present"}
            </Button>
            <Button variant="outline" onClick={handleExportClick}>
              <Download className="mr-1 h-4 w-4" /> Export
            </Button>
            <Button variant="outline" onClick={() => setThemeDialogOpen(true)}>
              <Palette className="mr-1 h-4 w-4" /> Theme
            </Button>
            <Button variant="outline" onClick={toggleNotes}>
              <StickyNote className="mr-1 h-4 w-4" />{" "}
              {showNotes ? "Hide Notes" : "Show Notes"}
            </Button>
          </div>

          {/* Slide display */}
          {renderSlide()}

          {/* Presenter notes */}
          {showNotes && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="text-lg font-semibold mb-2">Presenter Notes</h3>
              <Textarea
                ref={notesTextareaRef}
                placeholder="Add notes for this slide..."
                className="min-h-[100px]"
                defaultValue={currentNotes}
              />
              <Button onClick={saveNotes} className="mt-2">
                Save Notes
              </Button>
            </div>
          )}

          {/* Slide thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-6">
            {presentation.slides.map((slide, index) => (
              <div
                key={index}
                className={cn(
                  "p-2 border rounded cursor-pointer transition-all hover:shadow-md",
                  currentSlide === index
                    ? "border-primary ring-2 ring-primary"
                    : "border-gray-200"
                )}
                onClick={() => setCurrentSlide(index)}
              >
                <div
                  className="h-20 flex items-center justify-center text-xs p-2 overflow-hidden"
                  style={{
                    backgroundColor:
                      slide.backgroundColor || presentation.theme.primaryColor,
                    color:
                      slide.textColor || (index === 0 ? "#ffffff" : "#333333"),
                  }}
                >
                  {slide.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Presentation mode overlay */}
      {presentationMode && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/70 text-white px-4 py-2 rounded-full flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={prevSlide}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <span>
            {currentSlide + 1} / {presentation.slides.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={nextSlide}
            disabled={currentSlide === presentation.slides.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="px-3 border-l border-white/20">
            <Clock className="inline-block mr-2 h-4 w-4" />
            {formatTime(timer)}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={togglePresentationMode}
          >
            Exit
          </Button>
        </div>
      )}

      {/* Export Format Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Presentation</DialogTitle>
            <DialogDescription>
              Choose the format you want to export your presentation to.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="export-format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center">
                    <FileIcon className="mr-2 h-4 w-4" />
                    PDF Document
                  </div>
                </SelectItem>
                <SelectItem value="ppt">
                  <div className="flex items-center">
                    <FileImage className="mr-2 h-4 w-4" />
                    PowerPoint Presentation
                  </div>
                </SelectItem>
                <SelectItem value="docx">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Word Document
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={exportPresentation}>Export</Button>
        </DialogContent>
      </Dialog>

      {/* Theme Selection Dialog */}
      <Dialog open={themeDialogOpen} onOpenChange={setThemeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose Presentation Theme</DialogTitle>
            <DialogDescription>
              Select a theme to change the look and feel of your presentation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Tabs defaultValue="predefined">
              <TabsList className="mb-4">
                <TabsTrigger value="predefined">Predefined Themes</TabsTrigger>
                <TabsTrigger value="custom">Custom Theme</TabsTrigger>
              </TabsList>
              <TabsContent value="predefined">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predefinedThemes.map((theme) => (
                    <div
                      key={theme.name}
                      className={cn(
                        "p-4 rounded-lg cursor-pointer border-2 transition-all",
                        selectedTheme === theme.name
                          ? "border-primary"
                          : "border-transparent hover:border-gray-300"
                      )}
                      onClick={() => changeTheme(theme.name)}
                      style={{
                        backgroundColor: theme.primaryColor,
                        color: "#ffffff",
                      }}
                    >
                      <h3 className="font-bold mb-2">{theme.name}</h3>
                      <div className="flex gap-2 mt-2">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: theme.primaryColor }}
                        ></div>
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: theme.secondaryColor }}
                        ></div>
                        {theme.accentColor && (
                          <div
                            className="w-6 h-6 rounded-full"
                            style={{ backgroundColor: theme.accentColor }}
                          ></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="custom">
                <p className="text-sm text-gray-500 mb-4">
                  Custom theme creation would be implemented here in a full
                  version.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          <Button onClick={() => setThemeDialogOpen(false)}>Close</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
