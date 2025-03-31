"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { LockKeyhole, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"

export function AuthDrawer() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
          Sign In
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-gray-950 border-t border-gray-800">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="text-white pb-2">
            <DrawerTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Welcome Back
            </DrawerTitle>
            <DrawerDescription className="text-gray-400 text-sm">
              Sign in to your account or create a new one
            </DrawerDescription>
          </DrawerHeader>

          <div className="px-4 pb-2">
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                className="w-full sm:w-3/5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Tabs defaultValue="signin" className="w-full">
                  <TabsList className="grid grid-cols-2 mb-3 bg-gray-900">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-gray-800 text-xs">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-gray-800 text-xs">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin" className="space-y-2 mt-0">
                    <div className="space-y-1">
                      <Label htmlFor="email-signin" className="text-gray-300 text-xs">
                        Username or Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email-signin"
                          placeholder="Enter your email"
                          className="pl-8 h-8 text-sm bg-gray-900 border-gray-800 text-white focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        />
                        <Mail className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="password-signin" className="text-gray-300 text-xs">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password-signin"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-8 h-8 text-sm bg-gray-900 border-gray-800 text-white focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        />
                        <LockKeyhole className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="signup" className="space-y-2 mt-0">
                    <div className="space-y-1">
                      <Label htmlFor="email-signup" className="text-gray-300 text-xs">
                        Username or Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email-signup"
                          placeholder="Enter your email"
                          className="pl-8 h-8 text-sm bg-gray-900 border-gray-800 text-white focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        />
                        <Mail className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="password-signup" className="text-gray-300 text-xs">
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password-signup"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-8 h-8 text-sm bg-gray-900 border-gray-800 text-white focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        />
                        <LockKeyhole className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="confirm-password" className="text-gray-300 text-xs">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-8 h-8 text-sm bg-gray-900 border-gray-800 text-white focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                        />
                        <LockKeyhole className="absolute left-2 top-1.5 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>

              <motion.div
                className="hidden sm:block w-2/5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
                  <img
                    src="/placeholder.svg?height=120&width=120"
                    alt="Futuristic authentication"
                    className="w-full h-full object-cover mix-blend-luminosity opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="text-gray-400 border-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-300"
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

