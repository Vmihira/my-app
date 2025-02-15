'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bot, Search, Star, User, Home, LogOut, Sun, Moon } from 'lucide-react'
import Link from 'next/link'

type Agent = {
  id: number
  name: string
  creator: string
  description: string
  popularity: number
  image?: string
  genre: string
}

export default function UserDashboardDemo() {
  const [searchTerm, setSearchTerm] = useState('')
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [myAgents, setMyAgents] = useState<Agent[]>([])
  const [popularAgents, setPopularAgents] = useState<Agent[]>([])
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  // Mock data - replace with actual API calls in a real application
  useEffect(() => {
    setMyAgents([
      { id: 1, name: "CodeWizard", creator: "You", description: "AI-powered coding assistant", popularity: 95, genre: "Productivity" },
      { id: 2, name: "DesignMuse", creator: "You", description: "Creative design partner", popularity: 88, genre: "Creativity" },
      { id: 3, name: "DataSage", creator: "You", description: "Data analysis expert", popularity: 92, genre: "Analytics" },
    ])

    setPopularAgents([
      { id: 4, name: "WritingGenius", creator: "Jane Doe", description: "Advanced writing assistant", popularity: 98, genre: "Productivity" },
      { id: 5, name: "MathMaster", creator: "John Smith", description: "Mathematics tutor", popularity: 96, genre: "Education" },
      { id: 6, name: "HealthGuide", creator: "Dr. Brown", description: "Personal health advisor", popularity: 94, genre: "Health" },
      { id: 7, name: "TravelBuddy", creator: "Alex Green", description: "Travel planning assistant", popularity: 91, genre: "Lifestyle" },
      { id: 8, name: "FinanceGuru", creator: "Emma White", description: "Financial advisor AI", popularity: 93, genre: "Finance" },
    ])
  }, [])

  // Mock recommendation logic - replace with actual recommendation algorithm
  useEffect(() => {
    if (searchTerm.length > 0) {
      const allAgents = [...myAgents, ...popularAgents]
      const matchingAgents = allAgents
        .filter(agent => agent.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(agent => agent.name)
      setRecommendations(matchingAgents.slice(0, 5))
    } else {
      setRecommendations([])
    }
  }, [searchTerm, myAgents, popularAgents])

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
    document.documentElement.classList.toggle('dark')
  }

  const AgentCard = ({ agent }: { agent: Agent }) => (
    <Card className="w-64 flex-shrink-0 overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gradient-to-br from-blue-500 to-pink-500 dark:from-blue-700 dark:to-pink-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
            {agent.image ? (
              <img src={agent.image} alt={agent.name} className="w-10 h-10 rounded-full" />
            ) : (
              <Bot className="w-8 h-8 text-blue-500" />
            )}
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1 cursor-pointer" /*title="Rate this agent"*/ />
            <span className="text-white text-sm">{agent.popularity}</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-1">{agent.name}</h3>
        <p className="text-sm text-blue-100 mb-2">{agent.description}</p>
        <div className="flex items-center justify-between text-xs text-pink-200">
          <span className="flex items-center">
            <User className="w-3 h-3 mr-1" />
            {agent.creator}
          </span>
          <span className="bg-blue-600 px-2 py-1 rounded-full">{agent.genre}</span>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm" className="w-full mt-2">View Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{agent.name}</DialogTitle>
              <DialogDescription>
                Created by: {agent.creator}
                <br />
                Genre: {agent.genre}
                <br />
                Popularity: {agent.popularity}
                <br />
                <br />
                {agent.description}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'dark' : ''}`}>
      <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-blue-900 dark:via-purple-900 dark:to-pink-900 text-gray-900 dark:text-white">
        <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <span className="font-bold text-xl text-blue-600 dark:text-blue-400">AI Marketplace</span>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <Home className="w-5 h-5" />
                </Link>
                <Link href="/marketplace" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <Bot className="w-5 h-5" />
                </Link>
                <button onClick={toggleTheme} className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  {isDarkTheme ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600 dark:from-blue-400 dark:to-pink-400">
            AI Agent Marketplace
          </h1>

          <div className="relative mb-12">
            <Input
              type="text"
              placeholder="Search for AI agents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border-2 border-blue-500 dark:border-blue-400 rounded-full py-3 px-6 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400" />
            {recommendations.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow-lg">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-blue-500/50 cursor-pointer text-gray-900 dark:text-gray-100"
                    onClick={() => setSearchTerm(rec)}
                  >
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Your Agents</h2>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border border-blue-500/50">
              <div className="flex space-x-4 p-4">
                {myAgents.map(agent => (
                  <AgentCard key={agent.id} agent={agent} />
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-pink-600 dark:text-pink-400">Popular Agents</h2>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="productivity">Productivity</TabsTrigger>
                <TabsTrigger value="creativity">Creativity</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <ScrollArea className="w-full whitespace-nowrap rounded-md border border-pink-500/50">
                  <div className="flex space-x-4 p-4">
                    {popularAgents.map(agent => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsContent>
              {['productivity', 'creativity', 'education', 'lifestyle'].map(genre => (
                <TabsContent key={genre} value={genre}>
                  <ScrollArea className="w-full whitespace-nowrap rounded-md border border-pink-500/50">
                    <div className="flex space-x-4 p-4">
                      {popularAgents
                        .filter(agent => agent.genre.toLowerCase() === genre)
                        .map(agent => (
                          <AgentCard key={agent.id} agent={agent} />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}