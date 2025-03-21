"use client"
import { Sparkle } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
    const { data: session } = useSession();
    return (
        <div className="fixed top-0 left-0 h-20 bg-[white]/30 dark:bg-[black]/40 backdrop-blur-lg w-full z-30 border-b border-white/10 dark:border-gray-800 flex items-center justify-between px-6">
            {/* Logo Section */}
            <div className="flex gap-1 items-center font-bold text-2xl md:text-3xl">
                <Sparkle color="violet" size={30} />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    aboutHealth.ai
                </span>
            </div>
            {session ? (
                <div className="flex items-center gap-4">
                    <Image
                        src={session.user?.image || "/avatar-wpfp.png"} // fallback avatar
                        alt="Profile"
                        width={40}
                        height={40}
                        className="rounded-full border border-white/30"
                    />
                    <span className="text-white font-medium">{session.user?.name}</span>
                </div>
            ) : <>
                < div className="hidden md:flex gap-8 font-semibold text-white">
                    <Link href={"#features"}><div>Features</div></Link>
                    <div>Testimonials</div>
                    <div>Pricing</div>
                </div>
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
            </>
            }


        </div >
    );
};

