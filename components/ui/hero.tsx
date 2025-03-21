"use client"

import { motion } from "framer-motion"
import { RoboAnimation } from "./robo-animation"
import { FloatingPaper } from "./floating-paper"
import { FileText, Sparkles } from "lucide-react"
import { TypingAnimation } from "../magicui/typing-animation"

export default function Hero() {
    return (
        <div className="relative min-h-[calc(100vh-76px)] flex items-center">
            {/* Floating papers background */}
            <div className="absolute inset-0 overflow-hidden">
                <FloatingPaper count={6} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                            Your Intelligent AI Assistant for
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                {" "}
                                Everything.
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
                    >
                        <TypingAnimation>Ask health-related questions, upload reports, or share symptoms — our Health AI provides accurate, conversational answers, simplifying complex medical information into easy-to-understand insights, tailored just for you.</TypingAnimation>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded flex">
                            <FileText className="mr-2 h-5 w-5" />
                            Try it now
                        </button>
                        <button className="text-white border-purple-500 hover:bg-purple-500/20 px-8 flex rounded-md bg-white/20 py-2">
                            <Sparkles className="mr-2 h-5 w-5" />
                            learn more
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Animated robot */}
            <div className="absolute bottom-0 right-0 w-96 h-96">
                <RoboAnimation />
            </div>
        </div>
    )
}

