import { Sparkle } from "lucide-react"

export const ChatNav = () => {
    return <div className="w-full bg-[white]/30 dark:bg-[black]/40 backdrop-blur-lg z-30 border-b border-white/10 dark:border-gray-800 flex items-center justify-between px-6 h-20">
        <div className="flex gap-1 items-center font-bold text-2xl md:text-3xl">
            <Sparkle color="violet" size={30} />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                aboutHealth.ai
            </span>
        </div>
    </div>
}