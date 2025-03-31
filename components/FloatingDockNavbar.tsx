"use client";

import React, { Fragment } from "react";

import { FloatingDock } from "@/components/ui/floating-dock";
import {
  IconBriefcase,
  IconHome,
  IconPencilPlus,
  IconUser,
} from "@tabler/icons-react";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Home",
      icon: (
        <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Services",
      icon: (
        <IconPencilPlus className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "My works",
      icon: (
        <IconBriefcase className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
    {
      title: "Login/Signup",
      icon: (
        <IconUser className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/login",
    },
  ];
  return (
    <div className="flex items-center justify-center w-full p-8">
      <FloatingDock
        items={links}
      />
    </div>
  );
}
