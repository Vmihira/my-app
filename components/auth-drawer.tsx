"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LockKeyhole, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

// Accept onClose prop
interface AuthDrawerProps {
  onClose: () => void;
  isOpen: boolean;
}

export function AuthDrawer({ isOpen, onClose }: AuthDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
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
            </Tabs>
          </div>

          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="text-gray-400 border-gray-800 hover:bg-gray-900 hover:text-white transition-all duration-300"
                onClick={onClose} // Close the drawer when cancel is clicked
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
