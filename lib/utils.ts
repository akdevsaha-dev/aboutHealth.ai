import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const projects = [
  {
    title: "Natural Conversations",
    description:
  "Engage in fluid, human-like conversations with advanced language understanding capabilities.",
    link: "https://stripe.com",
  },
  {
    title: "Lightning Fast",
    description:
"Get instant responses with our optimized AI processing for minimal latency.",
    link: "https://netflix.com",
  },
  {
    title: "Private & Secure",
    description:
      "Your conversations are encrypted and never stored without your permission.",
    link: "https://google.com",
  },
  {
    title: "Creative Assistant",
    description:
      "Give detailes about any health related problems, get creative guidance for any health realted issues,  ",
    link: "https://meta.com",
  },
  {
    title: "Knowledge Base",
    description:
     "Access a vast knowledge base covering virtually any topic you need information on.",
    link: "https://amazon.com",
  },
  {
    title: "Personalized ",
    description:
      "The more you use it, the better it understands your preferences and needs.",
    link: "https://microsoft.com",
  },
];