import { Sparkle } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
    return (
        <div className="fixed top-0 left-0 h-20 bg-[white]/30 dark:bg-[black]/40 backdrop-blur-lg w-full z-30 border-b border-white/10 dark:border-gray-800 flex items-center justify-between px-6">
            {/* Logo Section */}
            <div className="flex gap-1 items-center font-bold text-2xl md:text-3xl">
                <Sparkle color="green" size={30} />
                <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                    aboutHealth.ai
                </span>
            </div>

            {/* Navigation Links (Hidden on small screens) */}
            <div className="hidden md:flex gap-8 font-semibold text-white">
                <div>Features</div>
                <div>Testimonials</div>
                <div>Pricing</div>
            </div>

            {/* Buttons (Sign In hidden on small screens) */}
            <div className="flex items-center gap-4">
                <Link href="/signin" className="hidden md:block">
                    <button className="px-4 text-white font-semibold h-10 rounded-md border border-[white]/30 min-w-[100px] whitespace-nowrap">
                        Sign In
                    </button>
                </Link>

                <Link href="/signup">
                    <button className="bg-white text-black h-10 px-6 font-semibold rounded-md min-w-[120px] whitespace-nowrap">
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    );
};

